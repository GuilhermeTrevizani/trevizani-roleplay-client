import { Button, Col, Flex, Form, Input, InputNumber, Modal, Popconfirm, Row, Table } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { ColumnsType } from 'antd/es/table';
import { configureEvent, emitEvent, removeAccents } from '../../services/util';
import PlayerPosition from '../../types/PlayerPosition';
import StaffDealership from '../../types/StaffDealership';
import PlayerRotation from '../../types/PlayerRotation';

const StaffDealershipPage = () => {
  const [loading, setLoading] = useState(true);
  const [originalItems, setOriginalItems] = useState<StaffDealership[]>([]);
  const [items, setItems] = useState<StaffDealership[]>([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [record, setRecord] = useState<StaffDealership>();
  const [playerPosition, setPlayerPosition] = useState<PlayerPosition>();
  const [playerRotation, setPlayerRotation] = useState<PlayerRotation>();

  useEffect(() => {
    configureEvent(Constants.STAFF_DEALERSHIP_PAGE_SHOW, (itemsJson: string, playerPositionJson: string, playerRotationJson: string) => {
      setOriginalItems(JSON.parse(itemsJson));
      handleModalCancel();
      setPlayerPosition(JSON.parse(playerPositionJson));
      setPlayerRotation(JSON.parse(playerRotationJson));
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.STAFF_DEALERSHIP_PAGE_SHOW);
  }, []);

  const add = () => {
    setModal(true);
    setRecord({
      id: '',
      name: '',
      posX: 0,
      posY: 0,
      posZ: 0,
      vehiclePosX: 0,
      vehiclePosY: 0,
      vehiclePosZ: 0,
      vehicleRotR: 0,
      vehicleRotP: 0,
      vehicleRotY: 0,
    })
  };

  const edit = (record: StaffDealership) => {
    setModal(true);
    setRecord(record);
  }

  const remove = (id: string) => {
    setLoading(true);
    emitEvent(Constants.STAFF_DEALERSHIP_PAGE_REMOVE, id);
  }

  const handleCancel = () => {
    emitEvent(Constants.STAFF_DEALERSHIP_PAGE_CLOSE);
  };

  const handleModalCancel = () => {
    setModal(false);
  }

  const handleModalOk = () => {
    setLoading(true);
    emitEvent(Constants.STAFF_DEALERSHIP_PAGE_SAVE, record.id, record.name, record.posX, record.posY, record.posZ,
      record.vehiclePosX, record.vehiclePosY, record.vehiclePosZ,
      record.vehicleRotR, record.vehicleRotP, record.vehicleRotY
    );
  };

  const goto = (id: string) => {
    emitEvent(Constants.STAFF_DEALERSHIP_PAGE_GO_TO, id);
  }

  const showVehicles = (id: string) => {
    setLoading(true);
    emitEvent(Constants.STAFF_DEALERSHIP_PAGE_SHOW_VEHICLES, id);
  }

  const getPosition = () => {
    setRecord({ ...record, posX: playerPosition.x, posY: playerPosition.y, posZ: playerPosition.z });
  };

  const getVehiclePosition = () => {
    setRecord({ ...record, vehiclePosX: playerPosition.x, vehiclePosY: playerPosition.y, vehiclePosZ: playerPosition.z });
  };

  const getVehicleRotation = () => {
    setRecord({ ...record, vehicleRotR: playerRotation.x, vehicleRotP: playerRotation.y, vehicleRotY: playerRotation.z });
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

  const columns: ColumnsType<StaffDealership> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('position'),
      dataIndex: 'position',
      key: 'position',
      render: (_, record: StaffDealership) => `X: ${record.posX} | Y: ${record.posY} | Z: ${record.posZ}`,
    },
    {
      title: t('vehiclePosition'),
      dataIndex: 'vehiclePosition',
      key: 'vehiclePosition',
      render: (_, record: StaffDealership) => `X: ${record.vehiclePosX} | Y: ${record.vehiclePosY} | Z: ${record.vehiclePosZ}`,
    },
    {
      title: t('vehicleRotation'),
      dataIndex: 'vehicleRotation',
      key: 'vehicleRotation',
      render: (_, record: StaffDealership) => `R: ${record.vehicleRotR} | P: ${record.vehicleRotP} | Y: ${record.vehicleRotY}`,
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (id: string, record: StaffDealership) => <Flex justify='space-evenly'>
        <Button size='small' onClick={() => goto(record.id)}>{t('goto')}</Button>
        <Button size='small' onClick={() => edit(record)}>{t('edit')}</Button>
        <Button size='small' onClick={() => showVehicles(record.id)}>{t('vehicles')}</Button>
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

  return <Modal open={true} title={t('dealerships')} onCancel={handleCancel} footer={null} width={'60%'}>
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

    {record && <Modal open={modal} title={(record.id != '' ? t('edit') : t('add')) + ' ' + t('dealership')} onOk={handleModalOk} onCancel={handleModalCancel} confirmLoading={loading}
      cancelText={t('close')} okText={t('save')} >
      <Form layout='vertical'>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('name')}>
              <Input value={record.name} onChange={(e) => setRecord({ ...record, name: e.target.value })} maxLength={50} />
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
            <Form.Item>
              <Button onClick={getVehiclePosition}>{t('getPosition')}</Button>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label={t('vehiclePositionX')}>
              <InputNumber value={record.vehiclePosX} onChange={(value) => setRecord({ ...record, vehiclePosX: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('vehiclePositionY')}>
              <InputNumber value={record.vehiclePosY} onChange={(value) => setRecord({ ...record, vehiclePosY: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('vehiclePositionZ')}>
              <InputNumber value={record.vehiclePosZ} onChange={(value) => setRecord({ ...record, vehiclePosZ: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item>
              <Button onClick={getVehicleRotation}>{t('getRotation')}</Button>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label={t('vehicleRotationX')}>
              <InputNumber value={record.vehicleRotR} onChange={(value) => setRecord({ ...record, vehicleRotR: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('vehicleRotationY')}>
              <InputNumber value={record.vehicleRotP} onChange={(value) => setRecord({ ...record, vehicleRotP: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('vehicleRotationZ')}>
              <InputNumber value={record.vehicleRotY} onChange={(value) => setRecord({ ...record, vehicleRotY: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>}
  </Modal>
};

export default StaffDealershipPage;