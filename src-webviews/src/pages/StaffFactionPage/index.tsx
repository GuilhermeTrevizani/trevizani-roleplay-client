import { Button, Col, Flex, Form, Input, InputNumber, Modal, Row, Select, Table } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { ColumnsType } from 'antd/es/table';
import { configureEvent, emitEvent, removeAccents } from '../../services/util';
import StaffFaction from '../../types/StaffFaction';
import SelectOption from '../../types/SelectOption';

const StaffFactionPage = () => {
  const [loading, setLoading] = useState(true);
  const [originalItems, setOriginalItems] = useState<StaffFaction[]>([]);
  const [items, setItems] = useState<StaffFaction[]>([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [record, setRecord] = useState<StaffFaction>();
  const [types, setTypes] = useState<SelectOption[]>([]);

  useEffect(() => {
    configureEvent(Constants.STAFF_FACTION_PAGE_SHOW, (itemsJson: string) => {
      setOriginalItems(JSON.parse(itemsJson));
      handleModalCancel();
      setLoading(false);
    });

    configureEvent(Constants.STAFF_FACTION_PAGE_LOAD_TYPES, (typesJson: string) => {
      setTypes(JSON.parse(typesJson));
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.STAFF_FACTION_PAGE_SHOW);
  }, []);

  const add = () => {
    setModal(true);
    setRecord({
      id: '',
      name: '',
      type: 1,
      typeDisplay: '',
      slots: 0,
      shortName: '',
    })
  };

  const edit = (record: StaffFaction) => {
    setModal(true);
    setRecord(record);
  }

  const handleCancel = () => {
    emitEvent(Constants.STAFF_FACTION_PAGE_CLOSE);
  };

  const handleModalCancel = () => {
    setModal(false);
  }

  const handleModalOk = () => {
    setLoading(true);
    emitEvent(Constants.STAFF_FACTION_PAGE_SAVE, record.id, record.name, record.type, record.slots, record.leader, record.shortName);
  };

  const showMembers = (id: string) => {
    setLoading(true);
    emitEvent(Constants.STAFF_FACTION_PAGE_SHOW_MEMBERS, id);
  }

  const showRanks = (id: string) => {
    setLoading(true);
    emitEvent(Constants.STAFF_FACTION_PAGE_SHOW_RANKS, id);
  }

  const showFrequencies = (id: string) => {
    setLoading(true);
    emitEvent(Constants.STAFF_FACTION_PAGE_SHOW_FREQUENCIES, id);
  }

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

  const columns: ColumnsType<StaffFaction> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('shortName'),
      dataIndex: 'shortName',
      key: 'shortName',
    },
    {
      title: t('type'),
      dataIndex: 'typeDisplay',
      key: 'typeDisplay',
    },
    {
      title: t('slots'),
      dataIndex: 'slots',
      key: 'slots',
    },
    {
      title: t('leader'),
      dataIndex: 'leader',
      key: 'leader',
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (id: string, record: StaffFaction) => <Flex justify='space-evenly'>
        <Button size='small' onClick={() => edit(record)}>{t('edit')}</Button>
        <Button size='small' onClick={() => showRanks(record.id)}>{t('ranks')}</Button>
        <Button size='small' onClick={() => showMembers(record.id)}>{t('members')}</Button>
        <Button size='small' onClick={() => showFrequencies(record.id)}>{t('frequencies')}</Button>
      </Flex>,
    },
  ];

  return <Modal open={true} title={t('factions')} onCancel={handleCancel} footer={null} width={'60%'}>
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

    {record && <Modal open={modal} title={(record.id != '' ? t('edit') : t('add')) + ' ' + t('faction')} onOk={handleModalOk} onCancel={handleModalCancel} confirmLoading={loading}
      cancelText={t('close')} okText={t('save')} >
      <Form layout='vertical'>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('name')}>
              <Input value={record.name} onChange={(e) => setRecord({ ...record, name: e.target.value })} style={{ width: '100%' }} maxLength={50} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('shortName')}>
              <Input value={record.shortName} onChange={(e) => setRecord({ ...record, shortName: e.target.value })} style={{ width: '100%' }} maxLength={10} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('type')}>
              <Select value={record.type} options={types} onChange={(value) => setRecord({ ...record, type: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('slots')}>
              <InputNumber value={record.slots} onChange={(value) => setRecord({ ...record, slots: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('leader')}>
              <Input value={record.leader} onChange={(e) => setRecord({ ...record, leader: e.target.value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>}
  </Modal>
};

export default StaffFactionPage;