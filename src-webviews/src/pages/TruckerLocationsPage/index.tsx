import { Button, Modal, Table } from 'antd';
import { Constants } from '../../../../src/base/constants';
import TruckerLocation from '../../types/TruckerLocation';
import { useEffect, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { t } from 'i18next';
import { configureEvent, emitEvent } from '../../services/util';

const TruckerLocationsPage = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<TruckerLocation[]>([]);

  useEffect(() => {
    configureEvent(Constants.TRUCKER_LOCATIONS_PAGE_SHOW, (itemsJson: string) => {
      setItems(JSON.parse(itemsJson));
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });
  }, []);

  const track = (truckerLocation: TruckerLocation) => {
    emitEvent(Constants.TRUCKER_LOCATIONS_PAGE_TRACK, truckerLocation.posX, truckerLocation.posY);
  }

  const handleCancel = () => {
    emitEvent(Constants.TRUCKER_LOCATIONS_PAGE_CLOSE);
  };

  const columns: ColumnsType<TruckerLocation> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('deliveryValue'),
      dataIndex: 'deliveryValue',
      key: 'deliveryValue',
    },
    {
      title: t('allowedVehicles'),
      dataIndex: 'allowedVehicles',
      key: 'allowedVehicles',
    },
    {
      title: t('options'),
      dataIndex: 'name',
      key: 'options',
      align: 'center',
      render: (_, truckerLocation: TruckerLocation) => <Button size='small' onClick={() => track(truckerLocation)}>{t('track')}</Button>,
    },
  ];

  return <Modal open={true} title={t('truckerLocations')} onCancel={handleCancel} footer={null} width={'50%'}>
    <Table
      columns={columns}
      dataSource={items}
      loading={loading}
      pagination={false}
    />
  </Modal>
};

export default TruckerLocationsPage;