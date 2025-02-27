import { Button, Col, Form, Input, InputNumber, Modal, Row, Table } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { ColumnsType } from 'antd/es/table';
import { configureEvent, emitEvent, formatValue, removeAccents } from '../../services/util';
import CompanyItem from '../../types/CompanyItem';
import { CompanyFlag } from '../../types/CompanyFlag';

const CompanyItemsPage = () => {
  const [loading, setLoading] = useState(true);
  const [originalItems, setOriginalItems] = useState<CompanyItem[]>([]);
  const [items, setItems] = useState<CompanyItem[]>([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [record, setRecord] = useState<CompanyItem>();
  const [flags, setFlags] = useState<CompanyFlag[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    configureEvent(Constants.COMPANY_ITEMS_PAGE_SHOW, (companyName: string, flagsJson: string, itemsJson: string) => {
      setOriginalItems(JSON.parse(itemsJson));
      handleModalCancel();
      setTitle(companyName);
      setFlags(JSON.parse(flagsJson));
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.COMPANY_ITEMS_PAGE_SHOW);
  }, []);

  const edit = (record: CompanyItem) => {
    setModal(true);
    setRecord(record);
  }

  const handleCancel = () => {
    emitEvent(Constants.COMPANY_ITEMS_PAGE_CLOSE);
  };

  const handleModalCancel = () => {
    setModal(false);
  }

  const handleModalOk = () => {
    setLoading(true);
    emitEvent(Constants.COMPANY_ITEMS_PAGE_SAVE, record.id, record.sellPrice);
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

  const columns: ColumnsType<CompanyItem> = [
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
      hidden: !flags.includes(CompanyFlag.ManageItems),
      render: (_, record: CompanyItem) => <Button size='small' onClick={() => edit(record)}>{t('edit')}</Button>,
    },
  ];

  return <Modal open={true} title={title} onCancel={handleCancel} footer={null} width={'60%'}>
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

    {record && <Modal open={modal} title={t('edit') + ' ' + t('item')}
      onOk={handleModalOk} onCancel={handleModalCancel} confirmLoading={loading}
      cancelText={t('close')} okText={t('save')} >
      <Form layout='vertical'>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('item')}>
              <Input value={record.itemTemplateName} disabled style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('costPrice')}>
              <InputNumber value={record.costPrice} disabled style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('sellPrice')}>
              <InputNumber value={record.sellPrice} onChange={(value) => setRecord({ ...record, sellPrice: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>}
  </Modal>
};

export default CompanyItemsPage;