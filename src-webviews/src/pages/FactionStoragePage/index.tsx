import { Button, Modal, Table } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { ColumnsType } from 'antd/es/table';
import { configureEvent, emitEvent, formatValue } from '../../services/util';
import FactionStorageItem from '../../types/FactionStorageItem';

const FactionStoragePage = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<FactionStorageItem[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    configureEvent(Constants.FACTION_STORAGE_PAGE_SHOW, (itemsJson: string, factionName: string) => {
      setItems(JSON.parse(itemsJson));
      setTitle(factionName);
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.FACTION_STORAGE_PAGE_SHOW);
  }, []);

  const equip = (id: string) => {
    setLoading(true);
    emitEvent(Constants.FACTION_STORAGE_PAGE_EQUIP_ITEM, id);
  }

  const handleCancel = () => {
    emitEvent(Constants.FACTION_STORAGE_PAGE_CLOSE);
  };

  const columns: ColumnsType<FactionStorageItem> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number) => formatValue(quantity),
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
      render: (id: string) => <Button size='small' onClick={() => equip(id)}>{t('equip')}</Button>,
    },
  ];

  return <Modal open={true} title={title} footer={null} onCancel={handleCancel} width={'50%'}>
    <Table
      columns={columns}
      dataSource={items}
      loading={loading}
      pagination={false}
      style={{ marginTop: '10px', maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}
    />
  </Modal>
};

export default FactionStoragePage;