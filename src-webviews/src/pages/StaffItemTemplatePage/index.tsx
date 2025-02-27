import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Table } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { ColumnsType } from 'antd/es/table';
import { configureEvent, emitEvent, removeAccents } from '../../services/util';

interface StaffItemTemplate {
  id: string,
  category?: number;
  categoryDisplay: string;
  type: string;
  name: string;
  weight: number;
  image: string;
  objectModel: string;
};

interface StaffItemCategory {
  id: number;
  name: string;
  hasType: boolean;
};

const StaffItemTemplatePage = () => {
  const [loading, setLoading] = useState(true);
  const [originalItems, setOriginalItems] = useState<StaffItemTemplate[]>([]);
  const [items, setItems] = useState<StaffItemTemplate[]>([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [record, setRecord] = useState<StaffItemTemplate>();
  const [categories, setCategories] = useState<StaffItemCategory[]>([]);

  useEffect(() => {
    configureEvent(Constants.STAFF_ITEM_TEMPLATE_PAGE_SHOW, (categoriesJson: string, itemsJson: string) => {
      setCategories(JSON.parse(categoriesJson));
      setOriginalItems(JSON.parse(itemsJson));
      handleModalCancel();
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.STAFF_ITEM_TEMPLATE_PAGE_SHOW);
  }, []);

  const add = () => {
    setModal(true);
    setRecord({
      id: '',
      categoryDisplay: '',
      image: '',
      name: '',
      objectModel: '',
      type: '',
      weight: 0,
    })
  };

  const edit = (record: StaffItemTemplate) => {
    setModal(true);
    setRecord(record);
  }

  const handleCancel = () => {
    emitEvent(Constants.STAFF_ITEM_TEMPLATE_PAGE_CLOSE);
  };

  const handleModalCancel = () => {
    setModal(false);
  }

  const handleModalOk = () => {
    setLoading(true);
    emitEvent(Constants.STAFF_ITEM_TEMPLATE_PAGE_SAVE, record.id, record.category ?? 0, record.type, record.name,
      record.weight, record.image, record.objectModel);
  };

  useEffect(() => {
    if (search == '') {
      setItems(originalItems);
      return;
    }

    const newSearch = removeAccents(search);
    const filteredItems = originalItems.filter(x =>
      removeAccents(x.name).includes(newSearch) || removeAccents(x.categoryDisplay).includes(newSearch)
    );
    setItems(filteredItems);
  }, [search, originalItems]);

  const columns: ColumnsType<StaffItemTemplate> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('category'),
      dataIndex: 'categoryDisplay',
      key: 'categoryDisplay',
    },
    {
      title: t('type'),
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: t('weight'),
      dataIndex: 'weight',
      key: 'weight',
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (_, record: StaffItemTemplate) => <Button size='small' onClick={() => edit(record)}>{t('edit')}</Button>,
    },
  ];

  const getCategory = () => {
    return categories.find(x => x.id === record.category);
  };

  useEffect(() => {
    if (!record)
      return;

    if (!(getCategory()?.hasType))
      setRecord({ ...record, type: '' });

  }, [record?.category]);

  return <Modal open={true} title={t('items')} onCancel={handleCancel} footer={null} width={'60%'}>
    <Row gutter={16}>
      <Col span={20}>
        <Input placeholder={t('searchHere')} value={search} onChange={(e) => setSearch(e.target.value)} />
      </Col>
      <Col span={4}>
        <Button style={{ width: '100%' }} onClick={add} loading={loading}>{t('add')}</Button>
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

    {record && <Modal open={modal} title={(record.id != '' ? t('edit') : t('add')) + ' ' + t('item')}
      onOk={handleModalOk} onCancel={handleModalCancel} confirmLoading={loading}
      cancelText={t('close')} okText={t('save')} >
      <Form layout='vertical'>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('name')}>
              <Input value={record.name} onChange={(e) => setRecord({ ...record, name: e.target.value })} style={{ width: '100%' }} maxLength={50} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('category')}>
              <Select disabled={record.id != ''} value={record.category} options={categories.map(x => ({ value: x.id, label: x.name }))}
                onChange={(value) => setRecord({ ...record, category: value })} style={{ width: '100%' }} showSearch optionFilterProp='label' />
            </Form.Item>
          </Col>
        </Row>
        {getCategory()?.hasType && <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('type')}>
              <Input value={record.type} onChange={(e) => setRecord({ ...record, type: e.target.value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('weight')}>
              <InputNumber value={record.weight} onChange={(value) => setRecord({ ...record, weight: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('image')}>
              <Input value={record.image} onChange={(e) => setRecord({ ...record, image: e.target.value })} style={{ width: '100%' }} maxLength={50} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('object')}>
              <Input value={record.objectModel} onChange={(e) => setRecord({ ...record, objectModel: e.target.value })} style={{ width: '100%' }} maxLength={50} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>}
  </Modal>
};

export default StaffItemTemplatePage;