import { useEffect, useState } from 'react';
import { Constants } from '../../../../src/base/constants';
import { Button, Modal, Table, Tabs, TabsProps } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { t } from 'i18next';
import { configureEvent, emitEvent, formatDateTime } from '../../services/util';
import Announcement from '../../types/Announcement';

const AnnouncementsPage = () => {
  const [loading, setLoading] = useState(true);
  const [personAnnouncements, setPersonAnnouncements] = useState<Announcement[]>([]);
  const [companyAnnouncements, setCompanyAnnouncements] = useState<Announcement[]>([]);
  const [governmentAnnouncements, setGovernmentAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    configureEvent(Constants.ANNOUNCEMENTS_PAGE_SHOW, (announcementsJson: string) => {
      const announcements = JSON.parse(announcementsJson);
      setPersonAnnouncements(announcements.filter(x => x.type === 1));
      setCompanyAnnouncements(announcements.filter(x => x.type === 2));
      setGovernmentAnnouncements(announcements.filter(x => x.type === 3));
      setLoading(false);
    });
  }, []);

  const handleCancel = () => {
    emitEvent(Constants.ANNOUNCEMENTS_PAGE_CLOSE);
  };

  const setPosition = (record: Announcement) => {
    emitEvent(Constants.ANNOUNCEMENTS_PAGE_SET_POSITION, record.positionX, record.positionY);
  };

  const columns: ColumnsType<Announcement> = [
    {
      title: t('date'),
      dataIndex: 'date',
      key: 'date',
      render: (date: Date) => formatDateTime(date),
    },
    {
      title: t('sender'),
      dataIndex: 'sender',
      key: 'sender',
    },
    {
      title: t('message'),
      dataIndex: 'message',
      key: 'message',
    },
  ];

  const companyAnnouncementsColumns: ColumnsType<Announcement> = [
    {
      title: t('date'),
      dataIndex: 'date',
      key: 'date',
      render: (date: Date) => formatDateTime(date),
    },
    {
      title: t('sender'),
      dataIndex: 'sender',
      key: 'sender',
    },
    {
      title: t('message'),
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (_, record: Announcement) => <Button size='small' onClick={() => setPosition(record)}>{t('markGPS')}</Button>
    },
  ];

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: t('personal'),
      children: <Table
        columns={columns}
        dataSource={personAnnouncements}
        pagination={false}
        loading={loading}
        style={{ maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}
        />,
    },
    {
      key: '2',
      label: t('company'),
      children: <Table
        columns={companyAnnouncementsColumns}
        dataSource={companyAnnouncements}
        pagination={false}
        loading={loading}
        style={{ maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}
        />,
    },
    {
      key: '3',
      label: t('government'),
      children: <Table
        columns={columns}
        dataSource={governmentAnnouncements}
        pagination={false}
        loading={loading}
        style={{ maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}
      />,
    },
  ];

  return <Modal open={true} title={t('announcements')} onCancel={handleCancel} footer={null} width={'90%'}>
    <Tabs defaultActiveKey="1" items={items} />
  </Modal>;
};

export default AnnouncementsPage;