import { Button, Col, Input, Modal, Row, Table } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { ColumnsType } from 'antd/es/table';
import { configureEvent, emitEvent, formatDateTime, removeAccents } from '../../services/util';
import MorgueBody from '../../types/MorgueBody';

const MorguePage = () => {
  const [loading, setLoading] = useState(true);
  const [originalItems, setOriginalItems] = useState<MorgueBody[]>([]);
  const [items, setItems] = useState<MorgueBody[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    configureEvent(Constants.MORGUE_PAGE_SHOW, (itemsJson: string) => {
      setOriginalItems(JSON.parse(itemsJson));
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.MORGUE_PAGE_SHOW);
  }, []);

  const handleCancel = () => {
    emitEvent(Constants.MORGUE_PAGE_CLOSE);
  };

  const view = (id: string) => {
    setLoading(true);
    emitEvent(Constants.MORGUE_PAGE_VIEW_BODY, id);
  }

  useEffect(() => {
    if (search == '') {
      setItems(originalItems);
      return;
    }

    const newSearch = removeAccents(search);
    const filteredItems = originalItems.filter(x =>
      removeAccents(x.name).includes(newSearch) || removeAccents(x.placeOfDeath).includes(newSearch)
    );
    setItems(filteredItems);
  }, [search, originalItems]);

  const columns: ColumnsType<MorgueBody> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: MorgueBody) => record.isInformationAvailable ? name : t('processing'),
    },
    {
      title: t('deathDate'),
      dataIndex: 'registerDate',
      key: 'registerDate',
      render: (registerDate: Date, record: MorgueBody) => record.isInformationAvailable ? formatDateTime(registerDate) : t('processing'),
    },
    {
      title: t('placeOfDeath'),
      dataIndex: 'placeOfDeath',
      key: 'placeOfDeath',
    },
    {
      title: t('morgueDate'),
      dataIndex: 'morgueDate',
      key: 'morgueDate',
      render: (morgueDate: Date) => formatDateTime(morgueDate),
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (id: string) => <Button size='small' onClick={() => view(id)}>{t('view')}</Button>,
    },
  ];

  return <Modal open={true} title={t('bodies')} onCancel={handleCancel} footer={null} width={'50%'}>
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
  </Modal>
};

export default MorguePage;