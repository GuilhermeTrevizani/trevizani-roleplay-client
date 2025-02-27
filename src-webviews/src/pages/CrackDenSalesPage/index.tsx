import { Modal, Table } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import CrackDenSale from '../../types/CrackDenSale';
import { ColumnsType } from 'antd/es/table';
import { t } from 'i18next';
import { configureEvent, emitEvent, formatDateTime } from '../../services/util';

const CrackDenSalesPage = () => {
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [sales, setSales] = useState<CrackDenSale[]>([]);

  useEffect(() => {
    configureEvent(Constants.CRACK_DEN_SALES_PAGE_SHOW, (title: string, salesJson: string) => {
      setTitle(title);
      setSales(JSON.parse(salesJson));
      setLoading(false);
    });
  }, []);

  const columns: ColumnsType<CrackDenSale> = [
    {
      title: t('date'),
      dataIndex: 'date',
      key: 'date',
      render: (date: Date) => formatDateTime(date),
    },
    {
      title: t('character'),
      dataIndex: 'character',
      key: 'character',
    },
    {
      title: t('item'),
      dataIndex: 'item',
      key: 'item',
    },
    {
      title: t('quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: t('unitValue'),
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: t('total'),
      dataIndex: 'total',
      key: 'total',
    },
  ];

  const handleCancel = () => {
    emitEvent(Constants.CRACK_DEN_SALES_PAGE_CLOSE);
  };

  return <Modal open={true} title={title} onCancel={handleCancel} footer={null} width={'70%'}>
    <Table
      columns={columns}
      dataSource={sales}
      loading={loading}
      pagination={false}
    />
  </Modal>;
};

export default CrackDenSalesPage;