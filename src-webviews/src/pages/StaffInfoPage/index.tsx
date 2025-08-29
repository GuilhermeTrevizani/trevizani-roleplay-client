import { Button, Col, Flex, Input, Modal, Popconfirm, Row, Table } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { ColumnsType } from 'antd/es/table';
import { configureEvent, emitEvent, formatDateTime, formatValue, removeAccents } from '../../services/util';

interface StaffInfo {
  id: string;
  registerDate: Date;
  character: string;
  posX: number;
  posY: number;
  posZ: number;
  dimension: number;
  message: string;
  image?: string;
};

const StaffInfoPage = () => {
  const [loading, setLoading] = useState(true);
  const [originalItems, setOriginalItems] = useState<StaffInfo[]>([]);
  const [items, setItems] = useState<StaffInfo[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    configureEvent(Constants.STAFF_INFO_PAGE_SHOW, (itemsJson: string) => {
      setOriginalItems(JSON.parse(itemsJson));
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.STAFF_INFO_PAGE_SHOW);
  }, []);

  const remove = (id: string) => {
    setLoading(true);
    emitEvent(Constants.STAFF_INFO_PAGE_REMOVE, id);
  }

  const handleCancel = () => {
    emitEvent(Constants.STAFF_INFO_PAGE_CLOSE);
  };

  const goto = (id: string) => {
    emitEvent(Constants.STAFF_INFO_PAGE_GO_TO, id);
  }

  useEffect(() => {
    if (search == '') {
      setItems(originalItems);
      return;
    }

    const newSearch = removeAccents(search);
    const filteredItems = originalItems.filter(x =>
      removeAccents(x.message).includes(newSearch) || removeAccents(x.character).includes(newSearch)
    );
    setItems(filteredItems);
  }, [search, originalItems]);

  const columns: ColumnsType<StaffInfo> = [
    {
      title: t('date'),
      dataIndex: 'registerDate',
      key: 'registerDate',
      render: (registerDate: Date) => formatDateTime(registerDate),
    },
    {
      title: t('character'),
      dataIndex: 'character',
      key: 'character',
    },
    {
      title: t('position'),
      dataIndex: 'position',
      key: 'position',
      render: (_, record: StaffInfo) => `X: ${record.posX} | Y: ${record.posY} | Z: ${record.posZ}`,
    },
    {
      title: t('dimension'),
      dataIndex: 'dimension',
      key: 'dimension',
      render: (dimension: number) => formatValue(dimension),
    },
    {
      title: t('message'),
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: t('image'),
      dataIndex: 'image',
      key: 'image',
      render: (image?: string) => image ? t('yes') : t('no'),
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (id: string, record: StaffInfo) => <Flex justify='space-evenly'>
        <Button size='small' onClick={() => goto(record.id)}>{t('goto')}</Button>
        <Popconfirm
          title={t('deleteRecord')}
          description={t('deleteRecordConfirm')}
          onConfirm={() => remove(id)}
          okText={t('yes')}
          cancelText={t('no')}
        >
          <Button danger size='small'>{t('delete')}</Button>
        </Popconfirm>
      </Flex>,
    },
  ];

  return <Modal open={true} title={t('infos')} onCancel={handleCancel} footer={null} width={'60%'}>
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

export default StaffInfoPage;