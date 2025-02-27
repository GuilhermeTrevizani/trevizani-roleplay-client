import { Button, Col, Flex, Form, Input, InputNumber, Modal, Popconfirm, Row, Select, Table } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { ColumnsType } from 'antd/es/table';
import { configureEvent, emitEvent, formatDateTime, formatValue, removeAccents } from '../../services/util';
import PlayerPosition from '../../types/PlayerPosition';
import PlayerRotation from '../../types/PlayerRotation';

interface StaffSmuggler {
  id: string;
  model: string;
  dimension: number;
  posX: number;
  posY: number;
  posZ: number;
  rotR: number;
  rotP: number;
  rotY: number;
  value: number;
  cooldownQuantityLimit: number;
  cooldownMinutes: number;
  cooldownDate: Date;
  quantity: number;
  cellphone: number;
  allowedCharacters: string[];
};

const StaffSmugglerPage = () => {
  const [loading, setLoading] = useState(true);
  const [originalItems, setOriginalItems] = useState<StaffSmuggler[]>([]);
  const [items, setItems] = useState<StaffSmuggler[]>([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [record, setRecord] = useState<StaffSmuggler>();
  const [playerPosition, setPlayerPosition] = useState<PlayerPosition>();
  const [playerRotation, setPlayerRotation] = useState<PlayerRotation>();

  useEffect(() => {
    configureEvent(Constants.STAFF_SMUGGLER_PAGE_SHOW, (itemsJson: string, playerPositionJson: string, playerRotationJson: string) => {
      setOriginalItems(JSON.parse(itemsJson));
      handleModalCancel();
      setPlayerPosition(JSON.parse(playerPositionJson));
      setPlayerRotation(JSON.parse(playerRotationJson));
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.STAFF_SMUGGLER_PAGE_SHOW);
  }, []);

  const add = () => {
    setModal(true);
    setRecord({
      id: '',
      posX: 0,
      posY: 0,
      posZ: 0,
      allowedCharacters: [],
      cellphone: 0,
      cooldownDate: new Date(),
      cooldownMinutes: 0,
      cooldownQuantityLimit: 0,
      dimension: 0,
      model: '',
      quantity: 0,
      rotR: 0,
      rotP: 0,
      rotY: 0,
      value: 0,
    })
  };

  const edit = (record: StaffSmuggler) => {
    setModal(true);
    setRecord(record);
  }

  const remove = (id: string) => {
    setLoading(true);
    emitEvent(Constants.STAFF_SMUGGLER_PAGE_REMOVE, id);
  }

  const handleCancel = () => {
    emitEvent(Constants.STAFF_SMUGGLER_PAGE_CLOSE);
  };

  const handleModalCancel = () => {
    setModal(false);
  }

  const handleModalOk = () => {
    setLoading(true);
    emitEvent(Constants.STAFF_SMUGGLER_PAGE_SAVE, record.id, record.model, record.dimension, record.posX, record.posY, record.posZ,
      record.rotR, record.rotP, record.rotY, record.value, record.cooldownQuantityLimit, record.cooldownMinutes, record.allowedCharacters);
  };

  const goto = (id: string) => {
    emitEvent(Constants.STAFF_SMUGGLER_PAGE_GO_TO, id);
  }

  const getPosition = () => {
    setRecord({ ...record, posX: playerPosition.x, posY: playerPosition.y, posZ: playerPosition.z, dimension: playerPosition.dimension });
  };

  const getRotation = () => {
    setRecord({ ...record, rotR: playerRotation.x, rotP: playerRotation.y, rotY: playerRotation.z });
  };

  useEffect(() => {
    if (search == '') {
      setItems(originalItems);
      return;
    }

    const newSearch = removeAccents(search);
    const filteredItems = originalItems.filter(x =>
      removeAccents(x.model).includes(newSearch) || removeAccents(x.cellphone.toString()).includes(newSearch)
    );
    setItems(filteredItems);
  }, [search, originalItems]);

  const columns: ColumnsType<StaffSmuggler> = [
    {
      title: t('number'),
      dataIndex: 'cellphone',
      key: 'cellphone',
    },
    {
      title: t('model'),
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: t('dimension'),
      dataIndex: 'dimension',
      key: 'dimension',
    },
    {
      title: t('position'),
      dataIndex: 'position',
      key: 'position',
      render: (_, record: StaffSmuggler) => `X: ${record.posX} | Y: ${record.posY} | Z: ${record.posZ}`,
    },
    {
      title: t('rotation'),
      dataIndex: 'rotation',
      key: 'rotation',
      render: (_, record: StaffSmuggler) => `X: ${record.rotR} | Y: ${record.rotP} | Z: ${record.rotY}`,
    },
    {
      title: t('value'),
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => `$${formatValue(value)}`,
    },
    {
      title: t('cooldownQuantityLimit'),
      dataIndex: 'cooldownQuantityLimit',
      key: 'cooldownQuantityLimit',
      render: (cooldownQuantityLimit: number) => formatValue(cooldownQuantityLimit),
    },
    {
      title: t('cooldownMinutes'),
      dataIndex: 'cooldownMinutes',
      key: 'cooldownMinutes',
      render: (cooldownMinutes: number) => formatValue(cooldownMinutes),
    },
    {
      title: t('quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number) => formatValue(quantity),
    },
    {
      title: t('cooldownDate'),
      dataIndex: 'cooldownDate',
      key: 'cooldownDate',
      render: (cooldownDate: Date) => formatDateTime(cooldownDate),
    },
    {
      title: t('allowedCharacters'),
      dataIndex: 'allowedCharacters',
      key: 'allowedCharacters',
      render: (allowedCharacters: string[]) => allowedCharacters.join(', '),
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (id: string, record: StaffSmuggler) => <Flex justify='space-evenly'>
        <Button size='small' onClick={() => goto(record.id)}>{t('goto')}</Button>
        <Button size='small' onClick={() => edit(record)}>{t('edit')}</Button>
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

  return <Modal open={true} title={t('smugglers')} onCancel={handleCancel} footer={null} width={'90%'}>
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

    {record && <Modal open={modal} title={(record.id != '' ? t('edit') : t('add')) + ' ' + t('smuggler')} onOk={handleModalOk} onCancel={handleModalCancel} confirmLoading={loading}
      cancelText={t('close')} okText={t('save')} >
      <Form layout='vertical'>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('model')}>
              <Input value={record.model} onChange={(e) => setRecord({ ...record, model: e.target.value })} style={{ width: '100%' }} />
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
          <Col span={24}>
            <Form.Item>
              <Button onClick={getRotation}>{t('getRotation')}</Button>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label={t('rotationX')}>
              <InputNumber value={record.rotR} onChange={(value) => setRecord({ ...record, rotR: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('rotationY')}>
              <InputNumber value={record.rotP} onChange={(value) => setRecord({ ...record, rotP: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('rotationZ')}>
              <InputNumber value={record.rotY} onChange={(value) => setRecord({ ...record, rotY: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('value')}>
              <InputNumber value={record.value} onChange={(value) => setRecord({ ...record, value: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('cooldownQuantityLimit')}>
              <InputNumber value={record.cooldownQuantityLimit} onChange={(value) => setRecord({ ...record, cooldownQuantityLimit: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('cooldownMinutes')}>
              <InputNumber value={record.cooldownMinutes} onChange={(value) => setRecord({ ...record, cooldownMinutes: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('allowedCharacters')}>
              <Select mode='tags' value={record.allowedCharacters} onChange={(value) => setRecord({ ...record, allowedCharacters: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>}
  </Modal>
};

export default StaffSmugglerPage;