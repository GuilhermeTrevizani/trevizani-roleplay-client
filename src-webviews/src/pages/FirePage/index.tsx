import { Button, Col, Flex, Form, Input, InputNumber, Modal, Popconfirm, Row, Table } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { ColumnsType } from 'antd/es/table';
import { configureEvent, emitEvent, formatValue, removeAccents } from '../../services/util';
import PlayerPosition from '../../types/PlayerPosition';

interface Fire {
  id: string;
  description: string;
  posX: number;
  posY: number;
  posZ: number;
  dimension: number;
  fireSpanLife: number;
  maxFireSpan: number;
  secondsNewFireSpan: number;
  positionNewFireSpan: number;
  fireSpanDamage: number;
  started: boolean;
}

const FirePage = () => {
  const [loading, setLoading] = useState(true);
  const [originalItems, setOriginalItems] = useState<Fire[]>([]);
  const [items, setItems] = useState<Fire[]>([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [record, setRecord] = useState<Fire>();
  const [playerPosition, setPlayerPosition] = useState<PlayerPosition>();

  useEffect(() => {
    configureEvent(Constants.FIRE_PAGE_SHOW, (itemsJson: string, playerPositionJson: string) => {
      setOriginalItems(JSON.parse(itemsJson));
      handleModalCancel();
      setPlayerPosition(JSON.parse(playerPositionJson));
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.FIRE_PAGE_SHOW);
  }, []);

  const add = () => {
    setModal(true);
    setRecord({
      id: '',
      posX: 0,
      posY: 0,
      posZ: 0,
      dimension: 0,
      description: '',
      fireSpanDamage: 0,
      fireSpanLife: 0,
      maxFireSpan: 0,
      positionNewFireSpan: 0,
      secondsNewFireSpan: 0,
      started: false,
    })
  };

  const edit = (record: Fire) => {
    setModal(true);
    setRecord(record);
  }

  const remove = (id: string) => {
    setLoading(true);
    emitEvent(Constants.FIRE_PAGE_REMOVE, id);
  }

  const start = (id: string) => {
    setLoading(true);
    emitEvent(Constants.FIRE_PAGE_START, id);
  }

  const stop = (id: string) => {
    setLoading(true);
    emitEvent(Constants.FIRE_PAGE_STOP, id);
  }

  const handleCancel = () => {
    emitEvent(Constants.FIRE_PAGE_CLOSE);
  };

  const handleModalCancel = () => {
    setModal(false);
  }

  const handleModalOk = () => {
    setLoading(true);
    emitEvent(Constants.FIRE_PAGE_SAVE, record.id, record.description, record.posX, record.posY, record.posZ, record.dimension,
      record.fireSpanLife, record.maxFireSpan, record.secondsNewFireSpan, record.positionNewFireSpan, record.fireSpanDamage
    );
  };

  const getPosition = () => {
    setRecord({ ...record, posX: playerPosition.x, posY: playerPosition.y, posZ: playerPosition.z, dimension: playerPosition.dimension });
  };

  useEffect(() => {
    if (search == '') {
      setItems(originalItems);
      return;
    }

    const newSearch = removeAccents(search);
    const filteredItems = originalItems.filter(x =>
      removeAccents(x.description).includes(newSearch)
    );
    setItems(filteredItems);
  }, [search, originalItems]);

  const columns: ColumnsType<Fire> = [
    {
      title: t('description'),
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: t('position'),
      dataIndex: 'position',
      key: 'position',
      render: (_, record: Fire) => `X: ${record.posX} | Y: ${record.posY} | Z: ${record.posZ}`,
    },
    {
      title: t('dimension'),
      dataIndex: 'dimension',
      key: 'dimension',
      render: (dimension: number) => formatValue(dimension),
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (id: string, record: Fire) => <Flex justify='space-evenly'>
        <Button size='small' onClick={() => edit(record)}>{t('edit')}</Button>
        {!record.started && <Button size='small' onClick={() => start(record.id)}>{t('toStart')}</Button>}
        {record.started && <Button size='small' onClick={() => stop(record.id)}>{t('toStop')}</Button>}
        <Popconfirm
          title={t('deleteRecord')}
          description={t('deleteRecordConfirm')}
          onConfirm={() => remove(id)}
          okText={t('yes')}
          cancelText={t('no')}
        >
          <Button danger size='small'>{t('delete')}</Button>
        </Popconfirm>
      </Flex>,
    },
  ];

  return <Modal open={true} title={t('fires')} onCancel={handleCancel} footer={null} width={'60%'}>
    <Row gutter={16}>
      <Col span={20}>
        <Input placeholder={t('searchHere')} value={search} onChange={(e) => setSearch(e.target.value)} />
      </Col>
      <Col span={4}>
        <Button style={{ width: '100%' }} onClick={add}>{t('add')}</Button>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={24}>
        <Table
          columns={columns}
          dataSource={items}
          loading={loading}
          style={{ marginTop: '10px', maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}
        />
      </Col>
    </Row>

    {record && <Modal open={modal} title={(record.id != '' ? t('edit') : t('add')) + ' ' + t('fire')}
      onOk={handleModalOk} onCancel={handleModalCancel} confirmLoading={loading}
      cancelText={t('close')} okText={t('save')} >
      <Form layout='vertical'>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('description')}>
              <Input value={record.description} onChange={(e) => setRecord({ ...record, description: e.target.value })} style={{ width: '100%' }}
                maxLength={100} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item>
              <Button onClick={getPosition}>{t('getPosition')}</Button>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label={t('positionX')}>
              <InputNumber value={record.posX} onChange={(value) => setRecord({ ...record, posX: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={t('positionY')}>
              <InputNumber value={record.posY} onChange={(value) => setRecord({ ...record, posY: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={t('positionZ')}>
              <InputNumber value={record.posZ} onChange={(value) => setRecord({ ...record, posZ: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={t('dimension')}>
              <InputNumber value={record.dimension} onChange={(value) => setRecord({ ...record, dimension: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={t('fireSpanLife')}>
              <InputNumber value={record.fireSpanLife} onChange={(value) => setRecord({ ...record, fireSpanLife: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('maxFireSpan')}>
              <InputNumber value={record.maxFireSpan} onChange={(value) => setRecord({ ...record, maxFireSpan: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={t('secondsNewFireSpan')}>
              <InputNumber value={record.secondsNewFireSpan} onChange={(value) => setRecord({ ...record, secondsNewFireSpan: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('positionNewFireSpan')}>
              <InputNumber value={record.positionNewFireSpan} onChange={(value) => setRecord({ ...record, positionNewFireSpan: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('fireSpanDamage')}>
              <InputNumber value={record.fireSpanDamage} onChange={(value) => setRecord({ ...record, fireSpanDamage: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>}
  </Modal>
};

export default FirePage;