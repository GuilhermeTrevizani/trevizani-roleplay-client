import { Button, Col, Form, Input, InputNumber, Modal, Row, Table } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { ColumnsType } from 'antd/es/table';
import { configureEvent, emitEvent, formatValue, removeAccents } from '../../services/util';
import StaffJob from '../../types/StaffJob';
import PlayerPosition from '../../types/PlayerPosition';
import PlayerRotation from '../../types/PlayerRotation';

const StaffJobPage = () => {
  const [loading, setLoading] = useState(true);
  const [originalItems, setOriginalItems] = useState<StaffJob[]>([]);
  const [items, setItems] = useState<StaffJob[]>([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [record, setRecord] = useState<StaffJob>();
  const [playerPosition, setPlayerPosition] = useState<PlayerPosition>();
  const [playerRotation, setPlayerRotation] = useState<PlayerRotation>();

  useEffect(() => {
    configureEvent(Constants.STAFF_JOB_PAGE_SHOW, (itemsJson: string, playerPositionJson: string, playerRotationJson: string) => {
      setOriginalItems(JSON.parse(itemsJson));
      handleModalCancel();
      setPlayerPosition(JSON.parse(playerPositionJson));
      setPlayerRotation(JSON.parse(playerRotationJson));
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.STAFF_JOB_PAGE_SHOW);
  }, []);

  const edit = (record: StaffJob) => {
    setModal(true);
    setRecord(record);
  }

  const handleCancel = () => {
    emitEvent(Constants.STAFF_JOB_PAGE_CLOSE);
  };

  const handleModalCancel = () => {
    setModal(false);
  }

  const handleModalOk = () => {
    setLoading(true);
    emitEvent(Constants.STAFF_JOB_PAGE_SAVE, JSON.stringify(record));
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

  const getPosition = () => {
    setRecord({ ...record, posX: playerPosition.x, posY: playerPosition.y, posZ: playerPosition.z });
  };

  const getVehiclePosition = () => {
    setRecord({ ...record, vehicleRentPosX: playerPosition.x, vehicleRentPosY: playerPosition.y, vehicleRentPosZ: playerPosition.z });
  };

  const getVehicleRotation = () => {
    setRecord({ ...record, vehicleRentRotR: playerRotation.x, vehicleRentRotP: playerRotation.y, vehicleRentRotY: playerRotation.z });
  };

  const columns: ColumnsType<StaffJob> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('salary'),
      dataIndex: 'salary',
      key: 'salary',
      render: (salary: number) => `$${formatValue(salary)}`,
    },
    {
      title: t('blipType'),
      dataIndex: 'blipType',
      key: 'blipType',
    },
    {
      title: t('blipColor'),
      dataIndex: 'blipColor',
      key: 'blipColor',
    },
    {
      title: t('blipName'),
      dataIndex: 'blipName',
      key: 'blipName',
    },
    {
      title: t('position'),
      dataIndex: 'position',
      key: 'position',
      render: (_, record: StaffJob) => `X: ${record.posX} | Y: ${record.posY} | Z: ${record.posZ}`,
    },
    {
      title: t('vehicleRentModel'),
      dataIndex: 'vehicleRentModel',
      key: 'vehicleRentModel',
    },
    {
      title: t('vehicleRentValue'),
      dataIndex: 'vehicleRentValue',
      key: 'vehicleRentValue',
      render: (vehicleRentValue: number) => `$${formatValue(vehicleRentValue)}`,
    },
    {
      title: t('vehiclePosition'),
      dataIndex: 'vehiclePosition',
      key: 'vehiclePosition',
      render: (_, record: StaffJob) => `X: ${record.vehicleRentPosX} | Y: ${record.vehicleRentPosY} | Z: ${record.vehicleRentPosZ}`,
    },
    {
      title: t('vehicleRotation'),
      dataIndex: 'vehicleRotation',
      key: 'vehicleRotation',
      render: (_, record: StaffJob) => `R: ${record.vehicleRentRotR} | P: ${record.vehicleRentRotP} | Y: ${record.vehicleRentRotY}`,
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (_, record: StaffJob) => <Button size='small' onClick={() => edit(record)}>{t('edit')}</Button>,
    },
  ];

  return <Modal open={true} title={t('jobs')} onCancel={handleCancel} footer={null} width={'90%'}>
    <Row gutter={16}>
      <Col span={24}>
        <Input placeholder={t('searchHere')} value={search} onChange={(e) => setSearch(e.target.value)} />
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

    {record && <Modal open={modal} title={record.name} onOk={handleModalOk} onCancel={handleModalCancel} confirmLoading={loading}
      cancelText={t('close')} okText={t('save')} >
      <Form layout='vertical' style={{ maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('salary')}>
              <InputNumber value={record.salary} onChange={(value) => setRecord({ ...record, salary: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label={t('blipType')}>
              <InputNumber value={record.blipType} onChange={(value) => setRecord({ ...record, blipType: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('blipColor')}>
              <InputNumber value={record.blipColor} onChange={(value) => setRecord({ ...record, blipColor: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('blipName')}>
              <Input value={record.blipName} onChange={(e) => setRecord({ ...record, blipName: e.target.value })} style={{ width: '100%' }} maxLength={100} />
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
          <Col span={12}>
            <Form.Item label={t('vehicleRentModel')}>
              <Input value={record.vehicleRentModel} onChange={(e) => setRecord({ ...record, vehicleRentModel: e.target.value })} style={{ width: '100%' }} maxLength={25} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('vehicleRentValue')}>
              <InputNumber value={record.vehicleRentValue} onChange={(value) => setRecord({ ...record, vehicleRentValue: value })} style={{ width: '100%' }} />
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
              <InputNumber value={record.vehicleRentPosX} onChange={(value) => setRecord({ ...record, vehicleRentPosX: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('vehiclePositionY')}>
              <InputNumber value={record.vehicleRentPosY} onChange={(value) => setRecord({ ...record, vehicleRentPosY: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('vehiclePositionZ')}>
              <InputNumber value={record.vehicleRentPosZ} onChange={(value) => setRecord({ ...record, vehicleRentPosZ: value })} style={{ width: '100%' }} />
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
              <InputNumber value={record.vehicleRentRotR} onChange={(value) => setRecord({ ...record, vehicleRentRotR: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('vehicleRotationY')}>
              <InputNumber value={record.vehicleRentRotP} onChange={(value) => setRecord({ ...record, vehicleRentRotP: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('vehicleRotationZ')}>
              <InputNumber value={record.vehicleRentRotY} onChange={(value) => setRecord({ ...record, vehicleRentRotY: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>}
  </Modal>
};

export default StaffJobPage;