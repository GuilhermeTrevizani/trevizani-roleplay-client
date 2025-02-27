import { Button, Modal, Table } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { ColumnsType } from 'antd/es/table';
import PriceItem from '../../types/PriceItem';
import { configureEvent, emitEvent, formatValue } from '../../services/util';

const PropertyUpgradePage = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<PriceItem[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    configureEvent(Constants.PROPERTY_UPGRADE_PAGE_SHOW, (title: string, itemsJson: string) => {
      setTitle(title);
      setItems(JSON.parse(itemsJson));
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });
  }, []);

  const buy = (item: string) => {
    emitEvent(Constants.PROPERTY_UPGRADE_PAGE_CONFIRM, item);
  }

  const handleCancel = () => {
    emitEvent(Constants.PROPERTY_UPGRADE_PAGE_CLOSE);
  };

  const columns: ColumnsType<PriceItem> = [
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
      dataIndex: 'name',
      key: 'options',
      align: 'center',
      render: (name: string) => <Button size='small' onClick={() => buy(name)}>{t('buy')}</Button>,
    },
  ];

  return <Modal open={true} title={title} onCancel={handleCancel} footer={null}>
    <Table
      columns={columns}
      dataSource={items}
      loading={loading}
      pagination={false}
    />
  </Modal>
};

export default PropertyUpgradePage;