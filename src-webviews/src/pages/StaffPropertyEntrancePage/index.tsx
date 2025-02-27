import { Button, Col, Flex, Form, Input, InputNumber, Modal, Popconfirm, Row, Table } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { ColumnsType } from 'antd/es/table';
import { configureEvent, emitEvent, removeAccents } from '../../services/util';
import PlayerPosition from '../../types/PlayerPosition';
import PlayerRotation from '../../types/PlayerRotation';

interface StaffPropertyEntrance {
  id: string;
  entrancePosX: number;
  entrancePosY: number;
  entrancePosZ: number;
  exitPosX: number;
  exitPosY: number;
  exitPosZ: number;
  entranceRotR: number;
  entranceRotP: number;
  entranceRotY: number;
  exitRotR: number;
  exitRotP: number;
  exitRotY: number;
};

const StaffPropertyEntrancePage = () => {
  const [loading, setLoading] = useState(true);
  const [originalItems, setOriginalItems] = useState<StaffPropertyEntrance[]>([]);
  const [items, setItems] = useState<StaffPropertyEntrance[]>([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [record, setRecord] = useState<StaffPropertyEntrance>();
  const [playerPosition, setPlayerPosition] = useState<PlayerPosition>();
  const [playerRotation, setPlayerRotation] = useState<PlayerRotation>();

  useEffect(() => {
    configureEvent(Constants.STAFF_PROPERTY_ENTRANCE_PAGE_SHOW, (itemsJson: string, playerPositionJson: string, playerRotationJson: string) => {
      setOriginalItems(JSON.parse(itemsJson));
      handleModalCancel();
      setPlayerPosition(JSON.parse(playerPositionJson));
      setPlayerRotation(JSON.parse(playerRotationJson));
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.STAFF_PROPERTY_ENTRANCE_PAGE_SHOW);
  }, []);

  const add = () => {
    setModal(true);
    setRecord({
      id: '',
      entrancePosX: 0,
      entrancePosY: 0,
      entrancePosZ: 0,
      exitPosX: 0,
      exitPosY: 0,
      exitPosZ: 0,
      entranceRotR: 0,
      entranceRotP: 0,
      entranceRotY: 0,
      exitRotR: 0,
      exitRotP: 0,
      exitRotY: 0,
    });
  };

  const edit = (record: StaffPropertyEntrance) => {
    setModal(true);
    setRecord(record);
  }

  const remove = (id: string) => {
    setLoading(true);
    emitEvent(Constants.STAFF_PROPERTY_ENTRANCE_PAGE_REMOVE, id);
  }

  const handleCancel = () => {
    emitEvent(Constants.STAFF_PROPERTY_ENTRANCE_PAGE_CLOSE);
  };

  const handleModalCancel = () => {
    setModal(false);
  }

  const handleModalOk = () => {
    setLoading(true);
    emitEvent(Constants.STAFF_PROPERTY_ENTRANCE_PAGE_SAVE, record.id,
      record.entrancePosX, record.entrancePosY, record.entrancePosZ,
      record.exitPosX, record.exitPosY, record.exitPosZ,
      record.entranceRotR, record.entranceRotP, record.entranceRotY,
      record.exitRotR, record.exitRotP, record.exitRotY);
  };

  const goto = (id: string) => {
    emitEvent(Constants.STAFF_PROPERTY_ENTRANCE_PAGE_GO_TO, id);
  }

  const getEntrancePosition = () => {
    setRecord({ ...record, entrancePosX: playerPosition.x, entrancePosY: playerPosition.y, entrancePosZ: playerPosition.z });
  };

  const getExitPosition = () => {
    setRecord({ ...record, exitPosX: playerPosition.x, exitPosY: playerPosition.y, exitPosZ: playerPosition.z });
  };

  const getEntranceRotation = () => {
    setRecord({ ...record, entranceRotR: playerRotation.x, entranceRotP: playerRotation.y, entranceRotY: playerRotation.z });
  };

  const getExitRotation = () => {
    setRecord({ ...record, exitRotR: playerRotation.x, exitRotP: playerRotation.y, exitRotY: playerRotation.z });
  };

  useEffect(() => {
    if (search == '') {
      setItems(originalItems);
      return;
    }

    const newSearch = removeAccents(search);
    const filteredItems = originalItems.filter(x =>
      removeAccents(x.id).includes(newSearch)
    );
    setItems(filteredItems);
  }, [search, originalItems]);

  const columns: ColumnsType<StaffPropertyEntrance> = [
    {
      title: t('entrancePosition'),
      dataIndex: 'entrancePosition',
      key: 'entrancePosition',
      render: (_, record: StaffPropertyEntrance) => `X: ${record.entrancePosX} | Y: ${record.entrancePosY} | Z: ${record.entrancePosZ}`,
    },
    {
      title: t('exitPosition'),
      dataIndex: 'exitPosition',
      key: 'exitPosition',
      render: (_, record: StaffPropertyEntrance) => `X: ${record.exitPosX} | Y: ${record.exitPosY} | Z: ${record.exitPosZ}`,
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (id: string, record: StaffPropertyEntrance) => <Flex justify='space-evenly'>
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

  return <Modal open={true} title={t('entrances')} onCancel={handleCancel} footer={null} width={'40%'}>
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

    {record && <Modal open={modal} title={(record.id != '' ? t('edit') : t('add')) + ' ' + t('entrance')} onOk={handleModalOk} onCancel={handleModalCancel} confirmLoading={loading}
      cancelText={t('close')} okText={t('save')} width={'40%'}>
      <Form layout='vertical'>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item>
              <Button onClick={getEntrancePosition}>{t('getEntrancePosition')}</Button>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label={t('entrancePositionX')}>
              <InputNumber value={record.entrancePosX} onChange={(value) => setRecord({ ...record, entrancePosX: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('entrancePositionY')}>
              <InputNumber value={record.entrancePosY} onChange={(value) => setRecord({ ...record, entrancePosY: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('entrancePositionZ')}>
              <InputNumber value={record.entrancePosZ} onChange={(value) => setRecord({ ...record, entrancePosZ: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item>
              <Button onClick={getEntranceRotation}>{t('getEntranceRotation')}</Button>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label={t('entranceRotationX')}>
              <InputNumber value={record.entranceRotR} onChange={(value) => setRecord({ ...record, entranceRotR: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('entranceRotationY')}>
              <InputNumber value={record.entranceRotP} onChange={(value) => setRecord({ ...record, entranceRotP: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('entranceRotationZ')}>
              <InputNumber value={record.entranceRotY} onChange={(value) => setRecord({ ...record, entranceRotY: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item>
              <Button onClick={getExitPosition}>{t('getExitPosition')}</Button>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label={t('exitPositionX')}>
              <InputNumber value={record.exitPosX} onChange={(value) => setRecord({ ...record, entrancePosX: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('exitPositionY')}>
              <InputNumber value={record.exitPosY} onChange={(value) => setRecord({ ...record, entrancePosY: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('exitPositionZ')}>
              <InputNumber value={record.exitPosZ} onChange={(value) => setRecord({ ...record, entrancePosZ: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item>
              <Button onClick={getExitRotation}>{t('getExitRotation')}</Button>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label={t('exitRotationX')}>
              <InputNumber value={record.exitRotR} onChange={(value) => setRecord({ ...record, exitRotR: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('exitRotationY')}>
              <InputNumber value={record.exitRotP} onChange={(value) => setRecord({ ...record, exitRotP: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('exitRotationZ')}>
              <InputNumber value={record.exitRotY} onChange={(value) => setRecord({ ...record, exitRotY: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>}
  </Modal>
};

export default StaffPropertyEntrancePage;