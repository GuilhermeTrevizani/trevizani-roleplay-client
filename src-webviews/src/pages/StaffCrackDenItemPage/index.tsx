import { Button, Col, Flex, Form, Input, InputNumber, Modal, Popconfirm, Row, Select, Table } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { ColumnsType } from 'antd/es/table';
import { configureEvent, emitEvent, formatValue, removeAccents } from '../../services/util';
import StaffCrackDenItem from '../../types/StaffCrackDenItem';
import ItemTemplate from '../../types/ItemTemplate';

const StaffCrackDenItemPage = () => {
  const [loading, setLoading] = useState(true);
  const [originalItems, setOriginalItems] = useState<StaffCrackDenItem[]>([]);
  const [items, setItems] = useState<StaffCrackDenItem[]>([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [record, setRecord] = useState<StaffCrackDenItem>();
  const [templates, setTemplates] = useState<ItemTemplate[]>([]);

  useEffect(() => {
    configureEvent(Constants.STAFF_CRACK_DEN_ITEM_PAGE_SHOW, (itemsJson: string) => {
      setOriginalItems(JSON.parse(itemsJson));
      handleModalCancel();
      setLoading(false);
    });

    configureEvent(Constants.STAFF_CRACK_DEN_ITEM_PAGE_LOAD_TEMPLATES, (templatesJson: string) => {
      setTemplates(JSON.parse(templatesJson));
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.STAFF_CRACK_DEN_ITEM_PAGE_SHOW);
  }, []);

  const add = () => {
    setModal(true);
    setRecord({
      id: '',
      itemTemplateId: '',
      itemTemplateName: '',
      value: 0,
    })
  };

  const edit = (record: StaffCrackDenItem) => {
    setModal(true);
    setRecord(record);
  }

  const remove = (id: string) => {
    setLoading(true);
    emitEvent(Constants.STAFF_CRACK_DEN_ITEM_PAGE_REMOVE, id);
  }

  const handleCancel = () => {
    emitEvent(Constants.STAFF_CRACK_DEN_ITEM_PAGE_CLOSE);
  };

  const handleModalCancel = () => {
    setModal(false);
  }

  const handleModalOk = () => {
    setLoading(true);
    emitEvent(Constants.STAFF_CRACK_DEN_ITEM_PAGE_SAVE, record.id, record.itemTemplateId, record.value);
  };

  useEffect(() => {
    if (search == '') {
      setItems(originalItems);
      return;
    }

    const newSearch = removeAccents(search);
    const filteredItems = originalItems.filter(x =>
      removeAccents(x.itemTemplateName).includes(newSearch)
    );
    setItems(filteredItems);
  }, [search, originalItems]);

  const columns: ColumnsType<StaffCrackDenItem> = [
    {
      title: t('item'),
      dataIndex: 'itemTemplateName',
      key: 'itemTemplateName',
    },
    {
      title: t('value'),
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => `$${formatValue(value)}`,
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (id: string, record: StaffCrackDenItem) => <Flex justify='space-evenly'>
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

  return <Modal open={true} title={t('crackDenItems')} onCancel={handleCancel} footer={null} width={'60%'}
    style={{ maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}>
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
          style={{ marginTop: '10px' }}
        />
      </Col>
    </Row>

    {record && <Modal open={modal} title={(record.id != '' ? t('edit') : t('add')) + ' ' + t('crackDenItem')} onOk={handleModalOk} onCancel={handleModalCancel} confirmLoading={loading}
      cancelText={t('close')} okText={t('save')} >
      <Form layout='vertical'>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('item')}>
              <Select value={record.itemTemplateId} options={templates.map(x => ({ value: x.id, label: x.name }))}
                onChange={(value) => setRecord({ ...record, itemTemplateId: value })} style={{ width: '100%' }} />
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
      </Form>
    </Modal>}
  </Modal>
};

export default StaffCrackDenItemPage;