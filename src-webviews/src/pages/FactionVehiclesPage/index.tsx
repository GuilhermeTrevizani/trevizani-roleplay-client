import { Button, Col, Input, Modal, Row, Table } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { ColumnsType } from 'antd/es/table';
import { configureEvent, emitEvent, removeAccents } from '../../services/util';

interface FactionVehicle {
  id: string;
  model: string;
  name: string;
  plate: string;
  inChargeCharacterName: string;
  description: string;
  sessionId?: string;
};

const FactionVehiclesPage = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<FactionVehicle[]>([]);
  const [title, setTitle] = useState('');
  const [search, setSearch] = useState('');
  const [originalItems, setOriginalItems] = useState<FactionVehicle[]>([]);

  useEffect(() => {
    configureEvent(Constants.FACTION_VEHICLES_PAGE_SHOW, (title: string, itemsJson: string) => {
      setTitle(title);
      setOriginalItems(JSON.parse(itemsJson));
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.FACTION_VEHICLES_PAGE_SHOW);
  }, []);

  const spawn = (id: string) => {
    setLoading(true);
    emitEvent(Constants.FACTION_VEHICLES_PAGE_SPAWN, id);
  }

  const handleCancel = () => {
    emitEvent(Constants.FACTION_VEHICLES_PAGE_CLOSE);
  };

  useEffect(() => {
    if (search == '') {
      setItems(originalItems);
      return;
    }

    const newSearch = removeAccents(search);
    const filteredItems = originalItems.filter(x =>
      removeAccents(x.model).includes(newSearch) || removeAccents(x.name).includes(newSearch)
      || removeAccents(x.plate).includes(newSearch) || removeAccents(x.description).includes(newSearch)
      || removeAccents(x.inChargeCharacterName).includes(newSearch)
    );
    setItems(filteredItems);
  }, [search, originalItems]);

  const columns: ColumnsType<FactionVehicle> = [
    {
      title: t('model'),
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('plate'),
      dataIndex: 'plate',
      key: 'plate',
    },
    {
      title: t('description'),
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: t('inCharge'),
      dataIndex: 'inChargeCharacterName',
      key: 'inCharge',
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (_, record: FactionVehicle) =>
        record.sessionId ?
          <>{t('id')}: {record.sessionId}</>
          :
          <Button size='small' onClick={() => spawn(record.id)}>{t('spawn')}</Button>,
    },
  ];

  return <Modal open={true} title={title} onCancel={handleCancel} footer={null} width={'60%'}>
    <Row gutter={16}>
      <Col span={24}>
        <Input placeholder={t('searchHere')} value={search} onChange={(e) => setSearch(e.target.value)} />
      </Col>
    </Row>
    <Table
      columns={columns}
      dataSource={items}
      loading={loading}
      pagination={false}
      style={{ marginTop: '10px', maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}
    />
  </Modal>
};

export default FactionVehiclesPage;