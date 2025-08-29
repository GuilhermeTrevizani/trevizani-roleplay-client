import { Button, Col, Divider, Flex, Form, Input, Modal, Popconfirm, Row, Select, Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import { Constants } from '../../../../src/base/constants';
import { t } from 'i18next';
import { configureEvent, emitEvent } from '../../services/util';
import SelectOption from '../../types/SelectOption';
import { ColumnsType } from 'antd/es/table';

enum ForensicTestItemType {
  Blood = 1,
  BulletShell = 2,
};

interface ForensicTestItem {
  type: ForensicTestItemType;
  originConfiscationItemId: string;
  targetConfiscationItemId?: string;
  firstItem: string;
  secondItem?: string;
  identifier: string;
  firstConfiscation?: string;
  secondConfiscation?: string;
  firstConfiscationItems: SelectOption[];
  secondConfiscationItems: SelectOption[];
};

const ForensicLaboratoryPage = () => {
  const [loading, setLoading] = useState(true);
  const [identifier, setIdentifier] = useState('');
  const [types, setTypes] = useState<SelectOption[]>([]);
  const [selectedItems, setSelectedItems] = useState<ForensicTestItem[]>([]);
  const [item, setItem] = useState<ForensicTestItem>();

  useEffect(() => {
    configureEvent(Constants.FORENSIC_LABORATORY_PAGE_SHOW, (typesJson: string) => {
      setTypes(JSON.parse(typesJson));
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    configureEvent(Constants.FORENSIC_LABORATORY_PAGE_SEARCH_CONFISCATION, (first: boolean, itemsJson: string) => {
      setItem(old => {
        if (first) {
          old.firstItem = null;
          old.originConfiscationItemId = '';
          old.firstConfiscationItems = JSON.parse(itemsJson);
        } else {
          old.secondItem = null;
          old.targetConfiscationItemId = null;
          old.secondConfiscationItems = JSON.parse(itemsJson);
        }
        return old;
      })
      setLoading(false);
    })

    emitEvent(Constants.FORENSIC_LABORATORY_PAGE_SHOW);
  }, []);

  const back = () => {
    setLoading(true);
    emitEvent(Constants.FORENSIC_LABORATORY_PAGE_CLOSE);
  };

  const submit = () => {
    setLoading(true);
    emitEvent(Constants.FORENSIC_LABORATORY_PAGE_SAVE, identifier, JSON.stringify(selectedItems));
  };

  const remove = (identifier: string) => {
    setSelectedItems(old => old.filter(x => x.identifier !== identifier));
  };

  const add = () => {
    setItem({
      type: ForensicTestItemType.Blood,
      firstItem: '',
      identifier: '',
      originConfiscationItemId: '',
      firstConfiscationItems: [],
      secondConfiscationItems: [],
    });
  };

  const edit = (record: ForensicTestItem) => {
    setItem(record);
  };

  const confirmAdd = () => {
    let currentItem = selectedItems.find(x => x.identifier.toLowerCase() === item.identifier.toLowerCase());
    currentItem = item;

    setSelectedItems(old => [
      ...old.filter(x => x.identifier.toLowerCase() !== item.identifier.toLowerCase()),
      currentItem
    ]);

    setItem(undefined);
  };

  const cancelAdd = () => {
    setItem(undefined);
  };

  const searchFirstConfiscation = () => {
    setLoading(true);
    emitEvent(Constants.FORENSIC_LABORATORY_PAGE_SEARCH_CONFISCATION, true, item.type, item.firstConfiscation);
  };

  const searchSecondConfiscation = () => {
    setLoading(true);
    emitEvent(Constants.FORENSIC_LABORATORY_PAGE_SEARCH_CONFISCATION, false, item.type, item.secondConfiscation);
  };

  const columns: ColumnsType<ForensicTestItem> = [
    {
      title: t('type'),
      dataIndex: 'type',
      key: 'type',
      render: (type: ForensicTestItemType) => t(type === ForensicTestItemType.Blood ? 'blood' : 'bulletShell'),
    },
    {
      title: t('identifier'),
      dataIndex: 'identifier',
      key: 'identifier',
    },
    {
      title: t('firstItem'),
      dataIndex: 'firstItem',
      key: 'firstItem',
    },
    {
      title: t('secondItem'),
      dataIndex: 'secondItem',
      key: 'secondItem',
    },
    {
      title: t('options'),
      dataIndex: 'identifier',
      key: 'options',
      align: 'center',
      render: (identifier: string, record: ForensicTestItem) => <Flex justify='space-evenly'>
        <Button size='small' onClick={() => edit(record)}>{t('edit')}</Button>
        <Popconfirm
          title={t('deleteRecord')}
          description={t('deleteRecordConfirm')}
          onConfirm={() => remove(identifier)}
          okText={t('yes')}
          cancelText={t('no')}
        >
          <Button danger size='small'>{t('delete')}</Button>
        </Popconfirm>
      </Flex>
    },
  ];

  return <Modal open={true} title={t('forensicLaboratory')} onOk={submit} onCancel={back} confirmLoading={loading}
    cancelText={t('close')} okText={t('save')} width={'70%'}>
    <Form layout='vertical'>
      <Form.Item label={t('identifier')}>
        <Input value={identifier}
          onChange={(e) => setIdentifier(e.target.value)} maxLength={50}
        />
      </Form.Item>
    </Form>
    <Row gutter={16}>
      <Col span={20}>
      </Col>
      <Col span={4}>
        <Button style={{ width: '100%' }} onClick={add}>{t('add')}</Button>
      </Col>
    </Row>
    <Table
      columns={columns}
      dataSource={selectedItems}
      loading={loading}
      pagination={false}
      style={{ marginTop: '10px', maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}
    />

    {item && <Modal open={true} title={t('item')} onOk={confirmAdd} onCancel={cancelAdd} confirmLoading={loading}
      cancelText={t('close')} okText={t('save')}>
      <Form layout='vertical'
        style={{ marginTop: '10px', maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('type')}>
              <Select value={item.type.toString()}
                options={types}
                onChange={(value) => setItem({
                  ...item,
                  type: Number(value),
                  firstItem: null,
                  secondItem: null,
                  originConfiscationItemId: '',
                  targetConfiscationItemId: null,
                })}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('identifier')}>
              <Input value={item.identifier}
                onChange={(e) => setItem({ ...item, identifier: e.target.value })} maxLength={50}
              />
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('confiscation')}>
              <Space.Compact style={{ width: '100%' }}>
                <Input value={item.firstConfiscation}
                  onChange={(e) => setItem({ ...item, firstConfiscation: e.target.value })}
                />
                <Button onClick={searchFirstConfiscation} loading={loading}>{t('search')}</Button>
              </Space.Compact>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('firstItem')}>
              <Select value={item.originConfiscationItemId}
                options={item.firstConfiscationItems}
                onChange={(value) =>
                  setItem({
                    ...item,
                    originConfiscationItemId: value,
                    firstItem: item.firstConfiscationItems.find(x => x.value === value).label
                  })}
              />
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('confiscation')}>
              <Space.Compact style={{ width: '100%' }}>
                <Input value={item.secondConfiscation}
                  onChange={(e) => setItem({ ...item, secondConfiscation: e.target.value })}
                />
                <Button onClick={searchSecondConfiscation} loading={loading}>{t('search')}</Button>
              </Space.Compact>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('secondItem')}>
              <Select value={item.targetConfiscationItemId}
                options={item.secondConfiscationItems}
                allowClear
                onChange={(value) =>
                  setItem({
                    ...item,
                    targetConfiscationItemId: value,
                    secondItem: item.secondConfiscationItems.find(x => x.value === value)?.label
                  })}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>}
  </Modal>
}

export default ForensicLaboratoryPage;