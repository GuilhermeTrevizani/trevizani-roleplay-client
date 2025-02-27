import { Button, Col, Flex, Form, Input, InputNumber, Modal, Popconfirm, Row, Select, Table } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { ColumnsType } from 'antd/es/table';
import { configureEvent, emitEvent, formatValue, removeAccents } from '../../services/util';
import StaffTruckerLocation from '../../types/StaffTruckerLocation';
import PlayerPosition from '../../types/PlayerPosition';

const StaffTruckerLocationPage = () => {
  const [loading, setLoading] = useState(true);
  const [originalItems, setOriginalItems] = useState<StaffTruckerLocation[]>([]);
  const [items, setItems] = useState<StaffTruckerLocation[]>([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [record, setRecord] = useState<StaffTruckerLocation>();
  const [playerPosition, setPlayerPosition] = useState<PlayerPosition>();

  useEffect(() => {
    configureEvent(Constants.STAFF_TRUCKER_LOCATION_PAGE_SHOW, (itemsJson: string, playerPositionJson: string) => {
      setOriginalItems(JSON.parse(itemsJson));
      handleModalCancel();
      setPlayerPosition(JSON.parse(playerPositionJson));
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.STAFF_TRUCKER_LOCATION_PAGE_SHOW);
  }, []);

  const add = () => {
    setModal(true);
    setRecord({
      id: '',
      posX: 0,
      posY: 0,
      posZ: 0,
      allowedVehicles: [],
      deliveryValue: 0,
      loadWaitTime: 0,
      name: '',
      unloadWaitTime: 0,
    })
  };

  const edit = (record: StaffTruckerLocation) => {
    setModal(true);
    setRecord(record);
  }

  const remove = (id: string) => {
    setLoading(true);
    emitEvent(Constants.STAFF_TRUCKER_LOCATION_PAGE_REMOVE, id);
  }

  const handleCancel = () => {
    emitEvent(Constants.STAFF_TRUCKER_LOCATION_PAGE_CLOSE);
  };

  const handleModalCancel = () => {
    setModal(false);
  }

  const handleModalOk = () => {
    setLoading(true);
    emitEvent(Constants.STAFF_TRUCKER_LOCATION_PAGE_SAVE, record.id, record.name, record.posX, record.posY, record.posZ,
      record.deliveryValue, record.loadWaitTime, record.unloadWaitTime, record.allowedVehicles);
  };

  const goto = (id: string) => {
    emitEvent(Constants.STAFF_TRUCKER_LOCATION_PAGE_GO_TO, id);
  }

  const showDeliveries = (id: string) => {
    setLoading(true);
    emitEvent(Constants.STAFF_TRUCKER_LOCATION_PAGE_SHOW_DELIVERIES, id);
  }

  const getPosition = () => {
    setRecord({ ...record, posX: playerPosition.x, posY: playerPosition.y, posZ: playerPosition.z });
  };

  useEffect(() => {
    if (search == '') {
      setItems(originalItems);
      return;
    }

    const newSearch = removeAccents(search);
    const filteredItems = originalItems.filter(x =>
      removeAccents(x.name).includes(newSearch)
    );
    setItems(filteredItems);
  }, [search, originalItems]);

  const columns: ColumnsType<StaffTruckerLocation> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('position'),
      dataIndex: 'position',
      key: 'position',
      render: (_, record: StaffTruckerLocation) => `X: ${record.posX} | Y: ${record.posY} | Z: ${record.posZ}`,
    },
    {
      title: t('deliveryValue'),
      dataIndex: 'deliveryValue',
      key: 'deliveryValue',
      render: (deliveryValue: number) => `$${formatValue(deliveryValue)}`,
    },
    {
      title: t('loadWaitTime'),
      dataIndex: 'loadWaitTime',
      key: 'loadWaitTime',
      render: (loadWaitTime: number) => formatValue(loadWaitTime),
    },
    {
      title: t('unloadWaitTime'),
      dataIndex: 'unloadWaitTime',
      key: 'unloadWaitTime',
      render: (unloadWaitTime: number) => formatValue(unloadWaitTime),
    },
    {
      title: t('allowedVehicles'),
      dataIndex: 'allowedVehicles',
      key: 'allowedVehicles',
      render: (allowedVehicles: string[]) => allowedVehicles.join(', '),
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (id: string, record: StaffTruckerLocation) => <Flex justify='space-evenly'>
        <Button size='small' onClick={() => goto(record.id)}>{t('goto')}</Button>
        <Button size='small' onClick={() => edit(record)}>{t('edit')}</Button>
        <Button size='small' onClick={() => showDeliveries(record.id)}>{t('deliveries')}</Button>
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

  return <Modal open={true} title={t('truckerLocations')} onCancel={handleCancel} footer={null} width={'60%'}>
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

    {record && <Modal open={modal} title={(record.id != '' ? t('edit') : t('add')) + ' ' + t('truckerLocation')} onOk={handleModalOk} onCancel={handleModalCancel} confirmLoading={loading}
      cancelText={t('close')} okText={t('save')} >
      <Form layout='vertical'>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('name')}>
              <Input value={record.name} onChange={(e) => setRecord({ ...record, name: e.target.value })} style={{ width: '100%' }} />
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
          <Col span={8}>
            <Form.Item label={t('positionX')}>
              <InputNumber value={record.posX} onChange={(value) => setRecord({ ...record, posX: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('positionY')}>
              <InputNumber value={record.posY} onChange={(value) => setRecord({ ...record, posY: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('positionZ')}>
              <InputNumber value={record.posZ} onChange={(value) => setRecord({ ...record, posZ: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('deliveryValue')}>
              <InputNumber value={record.deliveryValue} onChange={(value) => setRecord({ ...record, deliveryValue: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('loadWaitTime')}>
              <InputNumber value={record.loadWaitTime} onChange={(value) => setRecord({ ...record, loadWaitTime: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('unloadWaitTime')}>
              <InputNumber value={record.unloadWaitTime} onChange={(value) => setRecord({ ...record, unloadWaitTime: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('allowedVehicles')}>
              <Select mode='tags' value={record.allowedVehicles} onChange={(value) => setRecord({ ...record, allowedVehicles: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>}
  </Modal>
};

export default StaffTruckerLocationPage;