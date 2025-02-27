import { Button, Col, Flex, Form, Input, InputNumber, Modal, Popconfirm, Row, Table } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { ColumnsType } from 'antd/es/table';
import { configureEvent, emitEvent, formatDateTime, formatValue, removeAccents } from '../../services/util';
import PlayerPosition from '../../types/PlayerPosition';
import StaffCrackDen from '../../types/StaffCrackDen';

const StaffCrackDenPage = () => {
  const [loading, setLoading] = useState(true);
  const [originalItems, setOriginalItems] = useState<StaffCrackDen[]>([]);
  const [items, setItems] = useState<StaffCrackDen[]>([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [record, setRecord] = useState<StaffCrackDen>();
  const [playerPosition, setPlayerPosition] = useState<PlayerPosition>();

  useEffect(() => {
    configureEvent(Constants.STAFF_CRACK_DEN_PAGE_SHOW, (itemsJson: string, playerPositionJson: string) => {
      setOriginalItems(JSON.parse(itemsJson));
      handleModalCancel();
      setPlayerPosition(JSON.parse(playerPositionJson));
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.STAFF_CRACK_DEN_PAGE_SHOW);
  }, []);

  const add = () => {
    setModal(true);
    setRecord({
      id: '',
      posX: 0,
      posY: 0,
      posZ: 0,
      cooldownDate: new Date(),
      cooldownHours: 0,
      cooldownQuantityLimit: 0,
      dimension: 0,
      onlinePoliceOfficers: 0,
      quantity: 0,
    })
  };

  const edit = (record: StaffCrackDen) => {
    setModal(true);
    setRecord(record);
  }

  const remove = (id: string) => {
    setLoading(true);
    emitEvent(Constants.STAFF_CRACK_DEN_PAGE_REMOVE, id);
  }

  const handleCancel = () => {
    emitEvent(Constants.STAFF_CRACK_DEN_PAGE_CLOSE);
  };

  const handleModalCancel = () => {
    setModal(false);
  }

  const handleModalOk = () => {
    setLoading(true);
    emitEvent(Constants.STAFF_CRACK_DEN_PAGE_SAVE, record.id, record.posX, record.posY, record.posZ, record.dimension, record.onlinePoliceOfficers, record.cooldownQuantityLimit, record.cooldownHours);
  };

  const goto = (id: string) => {
    emitEvent(Constants.STAFF_CRACK_DEN_PAGE_GO_TO, id);
  }

  const showItems = (id: string) => {
    setLoading(true);
    emitEvent(Constants.STAFF_CRACK_DEN_PAGE_SHOW_ITEMS, id);
  }

  const revokeCooldown = (id: string) => {
    setLoading(true);
    emitEvent(Constants.STAFF_CRACK_DEN_PAGE_REVOKE_COOLDOWN, id);
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
      removeAccents(x.id).includes(newSearch)
    );
    setItems(filteredItems);
  }, [search, originalItems]);

  const columns: ColumnsType<StaffCrackDen> = [
    {
      title: t('position'),
      dataIndex: 'position',
      key: 'position',
      render: (_, record: StaffCrackDen) => `X: ${record.posX} | Y: ${record.posY} | Z: ${record.posZ}`,
    },
    {
      title: t('dimension'),
      dataIndex: 'dimension',
      key: 'dimension',
      render: (dimension: number) => formatValue(dimension),
    },
    {
      title: t('onlinePoliceOfficers'),
      dataIndex: 'onlinePoliceOfficers',
      key: 'onlinePoliceOfficers',
      render: (onlinePoliceOfficers: number) => formatValue(onlinePoliceOfficers),
    },
    {
      title: t('cooldownQuantityLimit'),
      dataIndex: 'cooldownQuantityLimit',
      key: 'cooldownQuantityLimit',
      render: (cooldownQuantityLimit: number) => formatValue(cooldownQuantityLimit),
    },
    {
      title: t('cooldownHours'),
      dataIndex: 'cooldownHours',
      key: 'cooldownHours',
      render: (cooldownHours: number) => formatValue(cooldownHours),
    },
    {
      title: t('cooldownDate'),
      dataIndex: 'cooldownDate',
      key: 'cooldownDate',
      render: (cooldownDate: Date) => formatDateTime(cooldownDate),
    },
    {
      title: t('quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number) => formatValue(quantity),
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (id: string, record: StaffCrackDen) => <Flex justify='space-evenly'>
        <Button size='small' onClick={() => goto(record.id)}>{t('goto')}</Button>
        <Button size='small' onClick={() => edit(record)}>{t('edit')}</Button>
        <Button size='small' onClick={() => showItems(record.id)}>{t('items')}</Button>
        <Popconfirm
          title={t('revokeCooldown')}
          description={t('revokeCooldownConfirm')}
          onConfirm={() => revokeCooldown(id)}
          okText={t('yes')}
          cancelText={t('no')}
        >
          <Button size='small'>{t('revokeCooldown')}</Button>
        </Popconfirm>
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

  return <Modal open={true} title={t('crackDens')} onCancel={handleCancel} footer={null} width={'60%'}>
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
        />
      </Col>
    </Row>

    {record && <Modal open={modal} title={(record.id != '' ? t('edit') : t('add')) + ' ' + t('crackDen')} onOk={handleModalOk} onCancel={handleModalCancel} confirmLoading={loading}
      cancelText={t('close')} okText={t('save')} >
      <Form layout='vertical'>
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
            <Form.Item label={t('onlinePoliceOfficers')}>
              <InputNumber value={record.onlinePoliceOfficers} onChange={(value) => setRecord({ ...record, onlinePoliceOfficers: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={t('cooldownQuantityLimit')}>
              <InputNumber value={record.cooldownQuantityLimit} onChange={(value) => setRecord({ ...record, cooldownQuantityLimit: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('cooldownHours')}>
              <InputNumber value={record.cooldownHours} onChange={(value) => setRecord({ ...record, cooldownHours: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>}
  </Modal>
};

export default StaffCrackDenPage;