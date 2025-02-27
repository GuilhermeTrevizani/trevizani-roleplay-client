import { Button, Checkbox, Col, Flex, Form, Input, Modal, Popconfirm, Row, Table } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { ColumnsType } from 'antd/es/table';
import { configureEvent, emitEvent, removeAccents } from '../../services/util';
import StaffFactionEquipment from '../../types/StaffFactionEquipment';

const StaffFactionEquipmentPage = () => {
  const [loading, setLoading] = useState(true);
  const [originalItems, setOriginalItems] = useState<StaffFactionEquipment[]>([]);
  const [items, setItems] = useState<StaffFactionEquipment[]>([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [record, setRecord] = useState<StaffFactionEquipment>();

  useEffect(() => {
    configureEvent(Constants.STAFF_FACTION_EQUIPMENT_PAGE_SHOW, (itemsJson: string) => {
      setOriginalItems(JSON.parse(itemsJson));
      handleModalCancel();
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.STAFF_FACTION_EQUIPMENT_PAGE_SHOW);
  }, []);

  const add = () => {
    setModal(true);
    setRecord({
      id: '',
      factionName: '',
      name: '',
      propertyOrVehicle: false,
      swat: false,
      upr: false,
    })
  };

  const edit = (record: StaffFactionEquipment) => {
    setModal(true);
    setRecord(record);
  }

  const remove = (id: string) => {
    setLoading(true);
    emitEvent(Constants.STAFF_FACTION_EQUIPMENT_PAGE_REMOVE, id);
  }

  const handleCancel = () => {
    emitEvent(Constants.STAFF_FACTION_EQUIPMENT_PAGE_CLOSE);
  };

  const handleModalCancel = () => {
    setModal(false);
  }

  const handleModalOk = () => {
    setLoading(true);
    emitEvent(Constants.STAFF_FACTION_EQUIPMENT_PAGE_SAVE, record.id, record.name, record.factionName, record.propertyOrVehicle, record.swat, record.upr);
  };

  const showItems = (id: string) => {
    setLoading(true);
    emitEvent(Constants.STAFF_FACTION_EQUIPMENT_PAGE_SHOW_ITEMS, id);
  }

  useEffect(() => {
    if (search == '') {
      setItems(originalItems);
      return;
    }

    const newSearch = removeAccents(search);
    const filteredItems = originalItems.filter(x =>
      removeAccents(x.name).includes(newSearch) || removeAccents(x.factionName).includes(newSearch)
    );
    setItems(filteredItems);
  }, [search, originalItems]);

  const columns: ColumnsType<StaffFactionEquipment> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('faction'),
      dataIndex: 'factionName',
      key: 'factionName',
    },
    {
      title: t('propertyOrVehicle'),
      dataIndex: 'propertyOrVehicle',
      key: 'propertyOrVehicle',
      render: (propertyOrVehicle: boolean) => t(propertyOrVehicle ? 'yes' : 'no'),
    },
    {
      title: t('swat'),
      dataIndex: 'swat',
      key: 'swat',
      render: (swat: boolean) => t(swat ? 'yes' : 'no'),
    },
    {
      title: t('upr'),
      dataIndex: 'upr',
      key: 'upr',
      render: (upr: boolean) => t(upr ? 'yes' : 'no'),
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (id: string, record: StaffFactionEquipment) => <Flex justify='space-evenly'>
        <Button size='small' onClick={() => edit(record)}>{t('edit')}</Button>
        <Button size='small' onClick={() => showItems(record.id)}>{t('items')}</Button>
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

  return <Modal open={true} title={t('equipments')} onCancel={handleCancel} footer={null} width={'60%'}>
    <Row gutter={16}>
      <Col span={20}>
        <Input placeholder={t('searchHere')} value={search} onChange={(e) => setSearch(e.target.value)} />
      </Col>
      <Col span={4}>
        <Button style={{ width: '100%' }} onClick={add} loading={loading}>{t('add')}</Button>
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

    {record && <Modal open={modal} title={(record.id != '' ? t('edit') : t('add')) + ' ' + t('equipment')}
      onOk={handleModalOk} onCancel={handleModalCancel} confirmLoading={loading}
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
            <Form.Item label={t('faction')}>
              <Input value={record.factionName} onChange={(e) => setRecord({ ...record, factionName: e.target.value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Checkbox checked={record.propertyOrVehicle} onChange={(e) => setRecord({ ...record, propertyOrVehicle: e.target.checked })}>{t('propertyOrVehicle')}</Checkbox>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Checkbox checked={record.swat} onChange={(e) => setRecord({ ...record, swat: e.target.checked })}>{t('swat')}</Checkbox>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Checkbox checked={record.upr} onChange={(e) => setRecord({ ...record, upr: e.target.checked })}>{t('upr')}</Checkbox>
          </Col>
        </Row>
      </Form>
    </Modal>}
  </Modal>
};

export default StaffFactionEquipmentPage;