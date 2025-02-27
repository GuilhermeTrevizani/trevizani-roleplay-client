import { Button, Col, Form, Input, InputNumber, Modal, Row, Table } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { ColumnsType } from 'antd/es/table';
import { configureEvent, emitEvent, formatValue, removeAccents } from '../../services/util';
import { CompanyFlag } from '../../types/CompanyFlag';
import StaffCompanyTuningPrice from '../../types/StaffCompanyTuningPrice';

const CompanyTuningPricesPage = () => {
  const [loading, setLoading] = useState(true);
  const [originalItems, setOriginalItems] = useState<StaffCompanyTuningPrice[]>([]);
  const [items, setItems] = useState<StaffCompanyTuningPrice[]>([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [record, setRecord] = useState<StaffCompanyTuningPrice>();
  const [flags, setFlags] = useState<CompanyFlag[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    configureEvent(Constants.COMPANY_TUNING_PRICES_PAGE_SHOW, (companyName: string, flagsJson: string, itemsJson: string) => {
      setOriginalItems(JSON.parse(itemsJson));
      handleModalCancel();
      setTitle(companyName);
      setFlags(JSON.parse(flagsJson));
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.COMPANY_TUNING_PRICES_PAGE_SHOW);
  }, []);

  const edit = (record: StaffCompanyTuningPrice) => {
    setModal(true);
    setRecord(record);
  }

  const handleCancel = () => {
    emitEvent(Constants.COMPANY_TUNING_PRICES_PAGE_CLOSE);
  };

  const handleModalCancel = () => {
    setModal(false);
  }

  const handleModalOk = () => {
    setLoading(true);
    emitEvent(Constants.COMPANY_TUNING_PRICES_PAGE_SAVE, record.id, record.sellPercentagePrice);
  };

  useEffect(() => {
    if (search == '') {
      setItems(originalItems);
      return;
    }

    const newSearch = removeAccents(search);
    const filteredItems = originalItems.filter(x =>
      removeAccents(x.type).includes(newSearch)
    );
    setItems(filteredItems);
  }, [search, originalItems]);

  const columns: ColumnsType<StaffCompanyTuningPrice> = [
    {
      title: t('type'),
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: t('costPercentagePrice'),
      dataIndex: 'costPercentagePrice',
      key: 'costPercentagePrice',
      render: (costPercentagePrice: number) => `${formatValue(costPercentagePrice, 1)}%`,
    },
    {
      title: t('sellPercentagePrice'),
      dataIndex: 'sellPercentagePrice',
      key: 'sellPercentagePrice',
      render: (sellPercentagePrice: number) => `${formatValue(sellPercentagePrice, 1)}%`,
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      hidden: !flags.includes(CompanyFlag.ManageItems),
      render: (_, record: StaffCompanyTuningPrice) => <Button size='small' onClick={() => edit(record)}>{t('edit')}</Button>,
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
            <Form.Item label={t('type')}>
              <Input value={record.type} disabled style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('costPercentagePrice')}>
              <InputNumber value={record.costPercentagePrice} disabled style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('sellPercentagePrice')}>
              <InputNumber value={record.sellPercentagePrice}
                onChange={(value) => setRecord({ ...record, sellPercentagePrice: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>}
  </Modal>
};

export default CompanyTuningPricesPage;