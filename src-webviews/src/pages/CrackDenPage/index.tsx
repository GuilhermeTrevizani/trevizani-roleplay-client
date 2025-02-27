import { Button, InputNumber, Modal, Table } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { ColumnsType } from 'antd/es/table';
import { configureEvent, emitEvent, formatValue } from '../../services/util';
import CrackDenItem from '../../types/CrackDenItem';

const CrackDenPage = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<CrackDenItem[]>([]);
  const [sellId, setSellId] = useState('');
  const [sellTitle, setSellTitle] = useState('');
  const [sellQuantity, setSellQuantity] = useState(0);

  useEffect(() => {
    configureEvent(Constants.CRACK_DEN_PAGE_SHOW, (itemsJson: string) => {
      setItems(JSON.parse(itemsJson));
      setSellId('');
      setSellTitle('');
      setSellQuantity(0);
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });
  }, []);

  const sell = (item: CrackDenItem) => {
    setSellId(item.id);
    setSellTitle(`${t('sell')} ${item.name}`);
    setSellQuantity(0);
  }

  const handleCancel = () => {
    emitEvent(Constants.CRACK_DEN_PAGE_CLOSE);
  };

  const viewSales = () => {
    setLoading(true);
    emitEvent(Constants.CRACK_DEN_PAGE_VIEW_SALES);
  };

  const confirmSell = () => {
    setLoading(true);
    emitEvent(Constants.CRACK_DEN_PAGE_SELL_ITEM, sellId, sellQuantity);
  };

  const cancelSell = () => {
    setSellId('');
    setSellTitle('');
    setSellQuantity(0);
  };

  const columns: ColumnsType<CrackDenItem> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('price'),
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${formatValue(price)}`,
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (_, item: CrackDenItem) => <Button size='small' onClick={() => sell(item)}>{t('sell')}</Button>,
    },
  ];

  return <Modal open={true} title={t('crackDen')} onOk={viewSales} onCancel={handleCancel} confirmLoading={loading}
    cancelText={t('close')} okText={t('viewSales')}>
    <Table
      columns={columns}
      dataSource={items}
      loading={loading}
      pagination={false}
    />

    <Modal open={sellId != ''} title={sellTitle} onOk={confirmSell} onCancel={cancelSell} confirmLoading={loading}
      cancelText={t('close')} okText={t('sell')}>
      <InputNumber value={sellQuantity} onChange={(value) => setSellQuantity(value)} min={1} style={{ width: '100%' }} />
    </Modal>
  </Modal>
};

export default CrackDenPage;