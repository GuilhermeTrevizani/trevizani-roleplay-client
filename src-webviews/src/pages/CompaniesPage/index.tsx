import { Button, Col, ColorPicker, Flex, Form, Input, InputNumber, Modal, Row, Table, Tag } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { ColumnsType } from 'antd/es/table';
import { configureEvent, emitEvent, formatDateTime, formatValue } from '../../services/util';
import Company from '../../types/Company';

const CompaniesPage = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Company[]>([]);
  const [announceId, setAnnounceId] = useState('');
  const [announceText, setAnnounceText] = useState('');
  const [editId, setEditId] = useState('');
  const [editColor, setEditColor] = useState('');
  const [editBlipType, setEditBlipType] = useState(0);
  const [editBlipColor, setEditBlipColor] = useState(0);
  const [safeId, setSafeId] = useState('');
  const [safeValue, setSafeValue] = useState(0);

  useEffect(() => {
    configureEvent(Constants.COMPANIES_PAGE_SHOW, (itemsJson: string) => {
      setItems(JSON.parse(itemsJson));
      setAnnounceId('');
      setAnnounceText('');
      setEditId('');
      setEditColor('');
      setEditBlipType(0);
      setEditBlipColor(0);
      setSafeId('');
      setSafeValue(0);
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });
  }, []);

  const edit = (company: Company) => {
    setEditId(company.id);
    setEditColor(company.color);
    setEditBlipType(company.blipType);
    setEditBlipColor(company.blipColor);
  };

  const confirmEdit = () => {
    setLoading(true);
    emitEvent(Constants.COMPANIES_PAGE_SAVE, editId, editColor, editBlipType, editBlipColor);
  };

  const cancelEdit = () => {
    setEditId('');
    setEditColor('');
    setEditBlipType(0);
    setEditBlipColor(0);
  };

  const announce = (id: string) => {
    setAnnounceId(id);
  };

  const confirmAnnounce = () => {
    setLoading(true);
    emitEvent(Constants.COMPANIES_PAGE_ANNOUNCE, announceId, announceText);
  };

  const cancelAnnounce = () => {
    setAnnounceId('');
    setAnnounceText('');
  };

  const employees = (id: string) => {
    setLoading(true);
    emitEvent(Constants.COMPANIES_PAGE_EMPLOYEES, id);
  };

  const openClose = (id: string) => {
    setLoading(true);
    emitEvent(Constants.COMPANIES_PAGE_OPEN_CLOSE, id);
  };

  const handleCancel = () => {
    emitEvent(Constants.COMPANIES_PAGE_CLOSE);
  };

  const showItems = (id: string) => {
    setLoading(true);
    emitEvent(Constants.COMPANIES_PAGE_SHOW_ITEMS, id);
  };

  const viewSafe = (company: Company) => {
    setSafeId(company.id);
    setSafeValue(company.safe);
  };

  const confirmSafe = () => {
    setLoading(true);
    emitEvent(Constants.COMPANIES_PAGE_WITHDRAW_SAFE, safeId, safeValue);
  };

  const cancelSafe = () => {
    setSafeId('');
    setSafeValue(0);
  };

  const columns: ColumnsType<Company> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('weekRent'),
      dataIndex: 'weekRentValue',
      key: 'weekRentValue',
      render: (weekRentValue: number) => <>${formatValue(weekRentValue)}</>,
    },
    {
      title: t('nextRent'),
      dataIndex: 'rentPaymentDate',
      key: 'rentPaymentDate',
      render: (rentPaymentDate: Date) => formatDateTime(rentPaymentDate),
    },
    {
      title: t('color'),
      dataIndex: 'color',
      key: 'color',
      render: (color: string) => <Tag color={`#${color}`}>#{color}</Tag>,
    },
    {
      title: t('blipType'),
      dataIndex: 'blipType',
      key: 'blipType',
    },
    {
      title: t('blipColor'),
      dataIndex: 'blipColor',
      key: 'blipColor',
    },
    {
      title: t('opened'),
      dataIndex: 'isOpen',
      key: 'open',
      render: (isOpen: boolean) => isOpen ? t('yes') : t('no'),
      align: 'center',
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (id: string, company: Company) => <Flex justify='space-evenly'>
        {company.isOwner && <Button size='small' onClick={() => edit(company)}>{t('edit')}</Button>}
        <Button size='small' onClick={() => employees(id)}>{t('employees')}</Button>
        <Button size='small' onClick={() => showItems(id)}>{t('items')}</Button>
        {company.canOpen && <Button size='small' onClick={() => openClose(id)}>{company.isOpen ? t('close') : t('open')}</Button>}
        {company.canOpen && company.isOpen && <Button size='small' onClick={() => announce(id)}>{t('announce')}</Button>}
        {company.canUseSafe && <Button size='small' onClick={() => viewSafe(company)}>{t('safe')}</Button>}
      </Flex>,
    },
  ];

  return <Modal open={true} title={t('companies')} onCancel={handleCancel} footer={null} width={'90%'}>
    <Table
      columns={columns}
      dataSource={items}
      loading={loading}
      pagination={false}
      style={{ marginTop: '10px', maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}
    />

    <Modal open={announceId != ''} title={t('announce')} onOk={confirmAnnounce} onCancel={cancelAnnounce} confirmLoading={loading}
      cancelText={t('close')} okText={t('announce')}>
      <Input value={announceText} onChange={(e) => setAnnounceText(e.target.value)} />
    </Modal>

    <Modal open={editId != ''} title={t('edit')} onOk={confirmEdit} onCancel={cancelEdit} confirmLoading={loading}
      cancelText={t('close')} okText={t('edit')} >
      <Form layout='vertical'>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label={t('color')}>
              <ColorPicker size='large' disabledAlpha value={editColor} onChange={(e) => setEditColor(e.toHexString())} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('blipType')}>
              <InputNumber value={editBlipType} onChange={(value) => setEditBlipType(value)} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('blipColor')}>
              <InputNumber value={editBlipColor} onChange={(value) => setEditBlipColor(value)} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>

    <Modal open={safeId != ''} title={t('safe')} onOk={confirmSafe} onCancel={cancelSafe} confirmLoading={loading}
      cancelText={t('close')} okText={t('withdraw')}>
      <InputNumber value={safeValue} onChange={(value) => setSafeValue(value)} style={{ width: '100%' }} />
    </Modal>
  </Modal>
};

export default CompaniesPage;