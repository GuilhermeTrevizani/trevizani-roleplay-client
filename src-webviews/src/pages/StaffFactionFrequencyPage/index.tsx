import { Button, Col, Flex, Form, Input, InputNumber, Modal, Popconfirm, Row, Table } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { ColumnsType } from 'antd/es/table';
import { configureEvent, emitEvent, removeAccents } from '../../services/util';
import StaffFactionFrequency from '../../types/StaffFactionFrequency';

const StaffFactionFrequencyPage = () => {
  const [loading, setLoading] = useState(true);
  const [originalItems, setOriginalItems] = useState<StaffFactionFrequency[]>([]);
  const [items, setItems] = useState<StaffFactionFrequency[]>([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [record, setRecord] = useState<StaffFactionFrequency>();
  const [factionName, setFactionName] = useState('');

  useEffect(() => {
    configureEvent(Constants.STAFF_FACTION_FREQUENCY_PAGE_SHOW, (itemsJson: string) => {
      setOriginalItems(JSON.parse(itemsJson));
      handleModalCancel();
      setLoading(false);
    });

    configureEvent(Constants.STAFF_FACTION_FREQUENCY_PAGE_LOAD_FACTION_NAME, (factionName: string) => {
      setFactionName(factionName);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.STAFF_FACTION_FREQUENCY_PAGE_SHOW);
  }, []);

  const add = () => {
    setModal(true);
    setRecord({
      id: '',
      name: '',
      frequency: 0,
    })
  };

  const edit = (record: StaffFactionFrequency) => {
    setModal(true);
    setRecord(record);
  }

  const remove = (id: string) => {
    setLoading(true);
    emitEvent(Constants.STAFF_FACTION_FREQUENCY_PAGE_REMOVE, id);
  }

  const handleCancel = () => {
    emitEvent(Constants.STAFF_FACTION_FREQUENCY_PAGE_CLOSE);
  };

  const handleModalCancel = () => {
    setModal(false);
  }

  const handleModalOk = () => {
    setLoading(true);
    emitEvent(Constants.STAFF_FACTION_FREQUENCY_PAGE_SAVE, record.id, record.frequency, record.name);
  };

  useEffect(() => {
    if (search == '') {
      setItems(originalItems);
      return;
    }

    const newSearch = removeAccents(search);
    const filteredItems = originalItems.filter(x =>
      removeAccents(x.name).includes(newSearch) || x.frequency.toString().includes(newSearch)
    );
    setItems(filteredItems);
  }, [search, originalItems]);

  const columns: ColumnsType<StaffFactionFrequency> = [
    {
      title: t('frequency'),
      dataIndex: 'frequency',
      key: 'frequency',
    },
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (id: string, record: StaffFactionFrequency) => <Flex justify='space-evenly'>
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

  return <Modal open={true} title={factionName} onCancel={handleCancel} footer={null} width={'60%'}>
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
          pagination={false}
          style={{ marginTop: '10px', maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}
        />
      </Col>
    </Row>

    {record && <Modal open={modal} title={(record.id != '' ? t('edit') : t('add')) + ' ' + t('frequency')} onOk={handleModalOk} onCancel={handleModalCancel} confirmLoading={loading}
      cancelText={t('close')} okText={t('save')} >
      <Form layout='vertical'>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('frequency')}>
              <InputNumber value={record.frequency} onChange={(value) => setRecord({ ...record, frequency: value })} style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('name')}>
              <Input value={record.name} onChange={(e) => setRecord({ ...record, name: e.target.value })} maxLength={10} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>}
  </Modal>
};

export default StaffFactionFrequencyPage;