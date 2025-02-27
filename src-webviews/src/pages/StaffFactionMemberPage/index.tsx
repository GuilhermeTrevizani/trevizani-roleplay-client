import { Col, Input, Modal, Row, Table, Tag } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { ColumnsType } from 'antd/es/table';
import { configureEvent, emitEvent, formatDateTime, removeAccents } from '../../services/util';
import StaffFactionMember from '../../types/StaffFactionMember';

const StaffFactionMemberPage = () => {
  const [loading, setLoading] = useState(true);
  const [originalItems, setOriginalItems] = useState<StaffFactionMember[]>([]);
  const [items, setItems] = useState<StaffFactionMember[]>([]);
  const [search, setSearch] = useState('');
  const [factionName, setFactionName] = useState('');

  useEffect(() => {
    configureEvent(Constants.STAFF_FACTION_MEMBER_PAGE_SHOW, (itemsJson: string, factionName: string) => {
      setOriginalItems(JSON.parse(itemsJson));
      setFactionName(factionName);
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.STAFF_FACTION_MEMBER_PAGE_SHOW);
  }, []);

  const handleCancel = () => {
    emitEvent(Constants.STAFF_FACTION_MEMBER_PAGE_CLOSE);
  };

  useEffect(() => {
    if (search == '') {
      setItems(originalItems);
      return;
    }

    const newSearch = removeAccents(search);
    const filteredItems = originalItems.filter(x =>
      removeAccents(x.name).includes(newSearch)
    );
    setItems(filteredItems);
  }, [search, originalItems]);

  const columns: ColumnsType<StaffFactionMember> = [
    {
      title: t('rank'),
      dataIndex: 'rankName',
      key: 'rankName',
    },
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: StaffFactionMember) =>
        <>{name} <Tag color={record.isOnline ? 'green' : 'red'}>{record.isOnline ? 'online' : 'offline'}</Tag></>,
    },
    {
      title: t('user'),
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: t('lastAccess'),
      dataIndex: 'lastAccessDate',
      key: 'lastAccessDate',
      render: (lastAccessDate: Date) => formatDateTime(lastAccessDate),
    },
  ];

  return <Modal open={true} title={factionName} onCancel={handleCancel} footer={null} width={'60%'}>
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
          pagination={false}
          style={{ marginTop: '10px', maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}
        />
      </Col>
    </Row>
  </Modal>
};

export default StaffFactionMemberPage;