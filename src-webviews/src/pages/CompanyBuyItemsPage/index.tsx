import { Button, Modal, Table } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { ColumnsType } from 'antd/es/table';
import BuyCompanyItem from '../../types/BuyCompanyItem';
import { configureEvent, emitEvent, formatValue } from '../../services/util';

const CompanyBuyItemsPage = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<BuyCompanyItem[]>([]);
  const [title, setTitle] = useState('');
  const [buy, setBuy] = useState(true);

  useEffect(() => {
    configureEvent(Constants.COMPANY_BUY_ITEMS_PAGE_SHOW, (companyName: string, itemsJson: string, buy: boolean) => {
      setItems(JSON.parse(itemsJson));
      setTitle(companyName);
      setBuy(buy);
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });
  }, []);

  const buyItem = (id: string) => {
    emitEvent(Constants.COMPANY_BUY_ITEMS_PAGE_BUY, id);
  }

  const handleCancel = () => {
    emitEvent(Constants.COMPANY_BUY_ITEMS_PAGE_CLOSE);
  };

  const columns: ColumnsType<BuyCompanyItem> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('price'),
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => <>${formatValue(price)}</>,
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (id: string) => <Button size='small' onClick={() => buyItem(id)}>{t(buy ? 'buy' : 'sell')}</Button>,
    },
  ];

  return <Modal open={true} title={title} onCancel={handleCancel} footer={null}>
    <Table
      columns={columns}
      dataSource={items}
      loading={loading}
      pagination={false}
      style={{ marginTop: '10px', maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}
    />
  </Modal>
};

export default CompanyBuyItemsPage;