import { Button, Col, Flex, Form, Input, Modal, Popconfirm, Row, Table } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { ColumnsType } from 'antd/es/table';
import { configureEvent, emitEvent, formatValue, removeAccents } from '../../services/util';

interface StaffObject {
  id: string;
  model: string;
  posX: number;
  posY: number;
  posZ: number;
  rotR: number;
  rotP: number;
  rotY: number;
};

const StaffObjectPage = () => {
  const [loading, setLoading] = useState(true);
  const [originalItems, setOriginalItems] = useState<StaffObject[]>([]);
  const [items, setItems] = useState<StaffObject[]>([]);
  const [search, setSearch] = useState('');
  const [isAdd, setIsAdd] = useState(false);
  const [model, setModel] = useState('');

  useEffect(() => {
    configureEvent(Constants.STAFF_OBJECT_PAGE_SHOW, (itemsJson: string) => {
      setOriginalItems(JSON.parse(itemsJson));
      handleModalCancel();
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.STAFF_OBJECT_PAGE_SHOW);
  }, []);

  const add = () => {
    setIsAdd(true);
  };

  const edit = (id: string) => {
    setLoading(true);
    emitEvent(Constants.STAFF_OBJECT_PAGE_EDIT, id);
  }

  const remove = (id: string) => {
    setLoading(true);
    emitEvent(Constants.STAFF_OBJECT_PAGE_REMOVE, id);
  }

  const handleCancel = () => {
    emitEvent(Constants.STAFF_OBJECT_PAGE_CLOSE);
  };

  const handleModalCancel = () => {
    setIsAdd(false);
    setModel('');
  }

  const handleModalOk = () => {
    setLoading(true);
    emitEvent(Constants.STAFF_OBJECT_PAGE_ADD, model);
  };

  const goto = (id: string) => {
    emitEvent(Constants.STAFF_OBJECT_PAGE_GO_TO, id);
  }

  useEffect(() => {
    if (search == '') {
      setItems(originalItems);
      return;
    }

    const newSearch = removeAccents(search);
    const filteredItems = originalItems.filter(x =>
      removeAccents(x.model).includes(newSearch)
    );
    setItems(filteredItems);
  }, [search, originalItems]);

  const columns: ColumnsType<StaffObject> = [
    {
      title: t('model'),
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: t('dimension'),
      dataIndex: 'dimension',
      key: 'dimension',
      render: (dimension: number) => formatValue(dimension),
    },
    {
      title: t('position'),
      dataIndex: 'position',
      key: 'position',
      render: (_, record: StaffObject) => `X: ${record.posX} | Y: ${record.posY} | Z: ${record.posZ}`,
    },
    {
      title: t('rotation'),
      dataIndex: 'rotation',
      key: 'rotation',
      render: (_, record: StaffObject) => `X: ${record.rotR} | Y: ${record.rotP} | Z: ${record.rotY}`,
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (id: string) => <Flex justify='space-evenly'>
        <Button size='small' onClick={() => goto(id)}>{t('goto')}</Button>
        <Button size='small' onClick={() => edit(id)}>{t('edit')}</Button>
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

  return <Modal open={true} title={t('objects')} onCancel={handleCancel} footer={null} width={'50%'}>
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
          style={{ marginTop: '10px', maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}
        />
      </Col>
    </Row>

    {isAdd && <Modal open={true} title={t('add') + ' ' + t('object')}
      onOk={handleModalOk} onCancel={handleModalCancel} confirmLoading={loading}
      cancelText={t('close')} okText={t('save')} >
      <Form layout='vertical'>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('model')}>
              <Input value={model} onChange={(e) => setModel(e.target.value)} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>}
  </Modal>
};

export default StaffObjectPage;