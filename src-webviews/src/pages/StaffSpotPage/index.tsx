import { Button, Col, Flex, Form, Input, InputNumber, Modal, Row, Select, Table } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { ColumnsType } from 'antd/es/table';
import { configureEvent, emitEvent, removeAccents } from '../../services/util';
import PlayerPosition from '../../types/PlayerPosition';
import SelectOption from '../../types/SelectOption';

interface StaffSpot {
  id: string;
  type: number;
  typeDisplay: string;
  posX: number;
  posY: number;
  posZ: number;
  dimension: number;
};

const StaffSpotPage = () => {
  const [loading, setLoading] = useState(true);
  const [originalItems, setOriginalItems] = useState<StaffSpot[]>([]);
  const [items, setItems] = useState<StaffSpot[]>([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [record, setRecord] = useState<StaffSpot>();
  const [playerPosition, setPlayerPosition] = useState<PlayerPosition>();
  const [types, setTypes] = useState<SelectOption[]>([]);

  useEffect(() => {
    configureEvent(Constants.STAFF_SPOT_PAGE_SHOW, (itemsJson: string, playerPositionJson: string) => {
      setOriginalItems(JSON.parse(itemsJson));
      handleModalCancel();
      setPlayerPosition(JSON.parse(playerPositionJson));
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    configureEvent(Constants.STAFF_SPOT_PAGE_LOAD_TYPES, (typesJson: string) => {
      setTypes(JSON.parse(typesJson));
    });

    emitEvent(Constants.STAFF_SPOT_PAGE_SHOW);
  }, []);

  const add = () => {
    setModal(true);
    setRecord({
      id: '',
      posX: 0,
      posY: 0,
      posZ: 0,
      type: 1,
      typeDisplay: '',
      dimension: 0,
    })
  };

  const edit = (record: StaffSpot) => {
    setModal(true);
    setRecord(record);
  }

  const handleCancel = () => {
    emitEvent(Constants.STAFF_SPOT_PAGE_CLOSE);
  };

  const handleModalCancel = () => {
    setModal(false);
  }

  const handleModalOk = () => {
    setLoading(true);
    emitEvent(Constants.STAFF_SPOT_PAGE_SAVE, record.id, record.type, record.posX, record.posY, record.posZ, record.dimension);
  };

  const goto = (id: string) => {
    emitEvent(Constants.STAFF_SPOT_PAGE_GO_TO, id);
  }

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
      removeAccents(x.typeDisplay).includes(newSearch)
    );
    setItems(filteredItems);
  }, [search, originalItems]);

  const columns: ColumnsType<StaffSpot> = [
    {
      title: t('type'),
      dataIndex: 'typeDisplay',
      key: 'typeDisplay',
    },
    {
      title: t('position'),
      dataIndex: 'position',
      key: 'position',
      render: (_, record: StaffSpot) => `X: ${record.posX} | Y: ${record.posY} | Z: ${record.posZ}`,
    },
    {
      title: t('dimension'),
      dataIndex: 'dimension',
      key: 'dimension',
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (id: string, record: StaffSpot) => <Flex justify='space-evenly'>
        <Button size='small' onClick={() => goto(record.id)}>{t('goto')}</Button>
        <Button size='small' onClick={() => edit(record)}>{t('edit')}</Button>
      </Flex>,
    },
  ];

  return <Modal open={true} title={t('spots')} onCancel={handleCancel} footer={null} width={'60%'}>
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

    {record && <Modal open={modal} title={(record.id != '' ? t('edit') : t('add')) + ' ' + t('spot')} onOk={handleModalOk} onCancel={handleModalCancel} confirmLoading={loading}
      cancelText={t('close')} okText={t('save')} >
      <Form layout='vertical'>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('type')}>
              <Select options={types} value={record.type} onChange={(value) => setRecord({ ...record, type: value })} style={{ width: '100%' }} />
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
      </Form>
    </Modal>}
  </Modal>
};

export default StaffSpotPage;