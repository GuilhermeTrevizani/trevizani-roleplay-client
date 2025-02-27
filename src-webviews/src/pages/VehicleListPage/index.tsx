import { Button, Flex, Input, Modal, Popconfirm, Table, Tag } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { ColumnsType } from 'antd/es/table';
import { configureEvent, emitEvent, formatDateTime, formatValue } from '../../services/util';
import { stringFormat } from '../../i18n';

interface Vehicle {
  id: string;
  model: string;
  plate: string;
  sessionId?: number;
  seizedValue: number;
  seizedDismantling: boolean;
  seizedDate?: Date;
  protectionLevel: number;
  plateChanges: number;
  sellPrice: number;
  insurance: string;
};

const VehicleListPage = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Vehicle[]>([]);
  const [title, setTitle] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [plate, setPlate] = useState('');

  useEffect(() => {
    configureEvent(Constants.VEHICLE_LIST_PAGE_SHOW, (title: string, itemsJson: string) => {
      setTitle(title);
      setItems(JSON.parse(itemsJson));
      setVehicleId('');
      setPlate('');
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.VEHICLE_LIST_PAGE_SHOW);
  }, []);

  const spawn = (id: string) => {
    setLoading(true);
    emitEvent(Constants.VEHICLE_LIST_PAGE_SPAWN, id);
  }

  const release = (id: string) => {
    setLoading(true);
    emitEvent(Constants.VEHICLE_LIST_PAGE_RELEASE, id);
  }

  const track = (id: string) => {
    setLoading(true);
    emitEvent(Constants.VEHICLE_LIST_PAGE_TRACK, id);
  }

  const sell = (id: string) => {
    setLoading(true);
    emitEvent(Constants.VEHICLE_LIST_PAGE_SELL, id);
  }

  const handleCancel = () => {
    emitEvent(Constants.VEHICLE_LIST_PAGE_CLOSE);
  };

  const handleChangePlateOk = () => {
    setLoading(true);
    emitEvent(Constants.VEHICLE_LIST_PAGE_CHANGE_PLATE, vehicleId, plate);
  };

  const handleChangePlateCancel = () => {
    setVehicleId('');
    setPlate('');
  };

  const columns: ColumnsType<Vehicle> = [
    {
      title: t('model'),
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: t('plate'),
      dataIndex: 'plate',
      key: 'plate',
    },
    {
      title: t('spawned'),
      dataIndex: 'sessionId',
      key: 'sessionId',
      align: 'center',
      render: (sessionId?: number) => {
        if (sessionId !== null)
          return <Tag color={'green'}>{t('yes')} ({t('id').toUpperCase()}: {sessionId})</Tag>;

        return <Tag color={'red'}>{t('no')}</Tag>;
      },
    },
    {
      title: t('insurance'),
      dataIndex: 'insurance',
      key: 'insurance',
      align: 'center',
      render: (insurance: string) => {
        if (insurance === t('no'))
          return <Tag color={'red'}>{t('no')}</Tag>;

        return <Tag color={'green'}>{insurance}</Tag>;
      },
    },
    {
      title: t('seized'),
      dataIndex: 'seizedValue',
      key: 'seizedValue',
      align: 'center',
      render: (seizedValue: number, record: Vehicle) => {
        if (seizedValue > 0)
          return <Tag color={'green'}>{t('yes')} (${formatValue(seizedValue)}) ({t('until')} {formatDateTime(record.seizedDate)}) {record.seizedDismantling ? `(${t('dismantle')})` : ''}</Tag>;

        return <Tag color={'red'}>{t('no')}</Tag>;
      },
    },
    {
      title: t('options'),
      dataIndex: 'model',
      key: 'options',
      align: 'center',
      render: (_, vehicle: Vehicle) => {
        return <Flex justify='space-evenly'>
          {vehicle.sessionId === null && vehicle.seizedValue == 0 && <Button size='small' type='primary' loading={loading} onClick={() => spawn(vehicle.id)}>{t('spawn')}</Button>}
          {(vehicle.seizedValue > 0) && <Button size='small' loading={loading} onClick={() => release(vehicle.id)}>{t('release')}</Button>}
          {vehicle.protectionLevel > 0 && vehicle.sessionId !== null && <Button size='small' loading={loading} onClick={() => track(vehicle.id)}>{t('track')}</Button>}
          {vehicle.plateChanges > 0 && vehicle.sessionId === null && <Button size='small' loading={loading} onClick={() => setVehicleId(vehicle.id)}>{t('changePlate')}</Button>}
          {vehicle.sessionId === null && vehicle.sellPrice > 0 && <Popconfirm
            title={t('sell')}
            description={stringFormat(t('sellVehicleConfirm'), vehicle.model, formatValue(vehicle.sellPrice))}
            onConfirm={() => sell(vehicle.id)}
            okText={t('yes')}
            cancelText={t('no')}
          >
            <Button size='small' loading={loading}>{t('sell')}</Button>
          </Popconfirm>}
        </Flex>;
      },
    },
  ];

  return <Modal open={true} title={title} onCancel={handleCancel} footer={null} width={'90%'}>
    <Table
      columns={columns}
      dataSource={items}
      loading={loading}
      pagination={false}
      locale={{ emptyText: t('noVehicles') }}
      style={{ marginTop: '10px', maxHeight: '60vh', overflowY: 'auto' }}
    />
    <Modal open={vehicleId != ''} title={t('changePlate')} onOk={handleChangePlateOk} onCancel={handleChangePlateCancel}
      okText={t('changePlate')} cancelText={t('close')} confirmLoading={loading}>
      <Input value={plate} onChange={(e) => setPlate(e.target.value)} minLength={1} maxLength={8} />
    </Modal>
  </Modal>
};

export default VehicleListPage;