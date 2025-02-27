import { Button, Flex, Modal, Popconfirm } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { configureEvent, emitEvent, formatValue, removeAccents } from '../../services/util';
import Table, { ColumnsType } from 'antd/es/table';
import { t } from 'i18next';
import { stringFormat } from '../../i18n';

interface PropertyBuilding {
  id: string;
  formatedAddress: string;
  value: number;
  canBuy: boolean;
  canAccess: boolean;
  isOwner: boolean;
};

const PropertyBuildingPage = () => {
  const [loading, setLoading] = useState(true);
  const [originalItems, setOriginalItems] = useState<PropertyBuilding[]>([]);
  const [items, setItems] = useState<PropertyBuilding[]>([]);
  const [title, setTitle] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    configureEvent(Constants.PROPERTY_BUILDING_PAGE_SHOW, (name: string, itemsJson: string) => {
      setTitle(name);
      setOriginalItems(JSON.parse(itemsJson));
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.PROPERTY_BUILDING_PAGE_SHOW);
  }, []);

  const enter = (id: string) => {
    setLoading(true);
    emitEvent(Constants.PROPERTY_BUILDING_PAGE_ENTER, id);
  }

  const lockUnlock = (id: string) => {
    setLoading(true);
    emitEvent(Constants.PROPERTY_BUILDING_PAGE_LOCK_UNLOCK, id);
  }

  const release = (id: string) => {
    setLoading(true);
    emitEvent(Constants.PROPERTY_BUILDING_PAGE_RELEASE, id);
  };

  const breakIn = (id: string) => {
    setLoading(true);
    emitEvent(Constants.PROPERTY_BUILDING_PAGE_BREAK_IN, id);
  };

  const buy = (id: string) => {
    setLoading(true);
    emitEvent(Constants.PROPERTY_BUILDING_PAGE_BUY, id);
  };

  const handleCancel = () => {
    emitEvent(Constants.PROPERTY_BUILDING_PAGE_CLOSE);
  };

  useEffect(() => {
    if (search == '') {
      setItems(originalItems);
      return;
    }

    const newSearch = removeAccents(search);
    const filteredItems = originalItems.filter(x =>
      removeAccents(x.formatedAddress).includes(newSearch)
    );
    setItems(filteredItems);
  }, [search, originalItems]);

  const columns: ColumnsType<PropertyBuilding> = [
    {
      title: t('address'),
      dataIndex: 'formatedAddress',
      key: 'formatedAddress',
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (id: string, record: PropertyBuilding) => <Flex justify='space-evenly'>
        <Button size='small' onClick={() => enter(id)}>{t('enter')}</Button>
        {record.canBuy && <Popconfirm
          title={t('buyProperty')}
          description={stringFormat(t('buyPropertyConfirm'), formatValue(record.value))}
          onConfirm={() => buy(id)}
          okText={t('yes')}
          cancelText={t('no')}
        >
          <Button size='small'>{t('buy')} (${formatValue(record.value)})</Button>
        </Popconfirm>}
        {record.canAccess && <Button size='small' onClick={() => lockUnlock(id)}>{t('lockUnlock')}</Button>}
        {record.isOwner && <Button size='small' onClick={() => release(id)}>{t('release')}</Button>}
        <Button size='small' onClick={() => breakIn(id)}>{t('breakIn')}</Button>
      </Flex>
    },
  ];

  return <Modal open={true} title={title} onCancel={handleCancel} footer={null} width={'40%'}>
    <Table
      columns={columns}
      dataSource={items}
      loading={loading}
      style={{ maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}
    />
  </Modal>
};

export default PropertyBuildingPage;