import { Button, Checkbox, Col, Flex, Form, Input, InputNumber, Modal, Popconfirm, Row, Table } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { ColumnsType } from 'antd/es/table';
import { configureEvent, emitEvent, formatDateTime, removeAccents } from '../../services/util';
import Info from '../../types/Info';

const InfoPage = () => {
  const [loading, setLoading] = useState(true);
  const [originalItems, setOriginalItems] = useState<Info[]>([]);
  const [items, setItems] = useState<Info[]>([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [record, setRecord] = useState<Info>();

  useEffect(() => {
    configureEvent(Constants.INFO_PAGE_SHOW, (itemsJson: string) => {
      setOriginalItems(JSON.parse(itemsJson));
      handleModalCancel();
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.INFO_PAGE_SHOW);
  }, []);

  const add = () => {
    setModal(true);
    setRecord({
      id: '',
      expirationDate: new Date(),
      message: '',
      registerDate: new Date(),
      days: 0,
      image: false,
    })
  };

  const remove = (id: string) => {
    setLoading(true);
    emitEvent(Constants.INFO_PAGE_REMOVE, id);
  }

  const handleCancel = () => {
    emitEvent(Constants.INFO_PAGE_CLOSE);
  };

  const handleModalCancel = () => {
    setModal(false);
  }

  const handleModalOk = () => {
    setLoading(true);
    emitEvent(Constants.INFO_PAGE_SAVE, record.days, record.message, record.image);
  };

  useEffect(() => {
    if (search == '') {
      setItems(originalItems);
      return;
    }

    const newSearch = removeAccents(search);
    const filteredItems = originalItems.filter(x =>
      removeAccents(x.message).includes(newSearch)
    );
    setItems(filteredItems);
  }, [search, originalItems]);

  const columns: ColumnsType<Info> = [
    {
      title: t('date'),
      dataIndex: 'registerDate',
      key: 'registerDate',
      render: (registerDate: Date) => formatDateTime(registerDate),
    },
    {
      title: t('expiration'),
      dataIndex: 'expirationDate',
      key: 'expirationDate',
      render: (expirationDate: Date) => formatDateTime(expirationDate),
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
      render: (image: boolean) => image ? t('yes') : t('no'),
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (id: string) => <Flex justify='space-evenly'>
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
      <Col span={20}>
        <Input placeholder={t('searchHere')} value={search} onChange={(e) => setSearch(e.target.value)} />
      </Col>
      <Col span={4}>
        <Button style={{ width: '100%' }} onClick={add}>{t('add')}</Button>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={24}>
        <Table
          columns={columns}
          dataSource={items}
          loading={loading}
        />
      </Col>
    </Row>

    {record && <Modal open={modal} title={t('add') + ' ' + t('info')} onOk={handleModalOk} onCancel={handleModalCancel} confirmLoading={loading}
      cancelText={t('close')} okText={t('save')} >
      <Form layout='vertical'>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('days')}>
              <InputNumber value={record.days} onChange={(value) => setRecord({ ...record, days: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('message')}>
              <Input value={record.message} onChange={(e) => setRecord({ ...record, message: e.target.value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Checkbox checked={record.image} onChange={(e) => setRecord({ ...record, image: e.target.checked })}>{t('image')}</Checkbox>
          </Col>
        </Row>
      </Form>
    </Modal>}
  </Modal>
};

export default InfoPage;