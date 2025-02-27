import { Button, Col, Flex, Form, Input, InputNumber, Modal, Popconfirm, Row, Select, Table } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { ColumnsType } from 'antd/es/table';
import { configureEvent, emitEvent, formatValue, removeAccents } from '../../services/util';
import ItemTemplate from '../../types/ItemTemplate';
import StaffCompanyItem from '../../types/StaffCompanyItem';

const StaffCompanyItemPage = () => {
  const [loading, setLoading] = useState(true);
  const [originalItems, setOriginalItems] = useState<StaffCompanyItem[]>([]);
  const [items, setItems] = useState<StaffCompanyItem[]>([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [record, setRecord] = useState<StaffCompanyItem>();
  const [templates, setTemplates] = useState<ItemTemplate[]>([]);

  useEffect(() => {
    configureEvent(Constants.STAFF_COMPANY_ITEM_PAGE_SHOW, (itemsJson: string) => {
      setOriginalItems(JSON.parse(itemsJson));
      handleModalCancel();
      setLoading(false);
    });

    configureEvent(Constants.STAFF_COMPANY_ITEM_PAGE_LOAD_TEMPLATES, (templatesJson: string) => {
      setTemplates(JSON.parse(templatesJson));
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.STAFF_COMPANY_ITEM_PAGE_SHOW);
  }, []);

  const add = () => {
    setModal(true);
    setRecord({
      id: '',
      itemTemplateId: '',
      itemTemplateName: '',
      costPrice: 0,
      sellPrice: 0,
    })
  };

  const edit = (record: StaffCompanyItem) => {
    setModal(true);
    setRecord(record);
  }

  const remove = (id: string) => {
    setLoading(true);
    emitEvent(Constants.STAFF_COMPANY_ITEM_PAGE_REMOVE, id);
  }

  const handleCancel = () => {
    emitEvent(Constants.STAFF_COMPANY_ITEM_PAGE_CLOSE);
  };

  const handleModalCancel = () => {
    setModal(false);
  }

  const handleModalOk = () => {
    setLoading(true);
    emitEvent(Constants.STAFF_COMPANY_ITEM_PAGE_SAVE, record.id, record.itemTemplateId, record.costPrice);
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

  const columns: ColumnsType<StaffCompanyItem> = [
    {
      title: t('item'),
      dataIndex: 'itemTemplateName',
      key: 'itemTemplateName',
    },
    {
      title: t('costPrice'),
      dataIndex: 'costPrice',
      key: 'costPrice',
      render: (costPrice: number) => `$${formatValue(costPrice)}`,
    },
    {
      title: t('sellPrice'),
      dataIndex: 'sellPrice',
      key: 'sellPrice',
      render: (sellPrice: number) => `$${formatValue(sellPrice)}`,
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (id: string, record: StaffCompanyItem) => <Flex justify='space-evenly'>
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

  return <Modal open={true} title={t('items')} onCancel={handleCancel} footer={null} width={'70%'}>
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

    {record && <Modal open={modal} title={(record.id != '' ? t('edit') : t('add')) + ' ' + t('item')}
      onOk={handleModalOk} onCancel={handleModalCancel} confirmLoading={loading}
      cancelText={t('close')} okText={t('save')} >
      <Form layout='vertical'>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('item')}>
              <Select value={record.itemTemplateId} options={templates.map(x => ({ value: x.id, label: x.name }))}
                onChange={(value) => setRecord({ ...record, itemTemplateId: value })} style={{ width: '100%' }}
                showSearch optionFilterProp='label' />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('costPrice')}>
              <InputNumber value={record.costPrice} onChange={(value) => setRecord({ ...record, costPrice: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('sellPrice')}>
              <InputNumber value={record.sellPrice} disabled style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>}
  </Modal>
};

export default StaffCompanyItemPage;