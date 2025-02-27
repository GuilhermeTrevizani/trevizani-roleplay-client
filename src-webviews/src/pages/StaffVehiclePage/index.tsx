import { Button, Col, Flex, Form, Input, Modal, Popconfirm, Row, Table } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { ColumnsType } from 'antd/es/table';
import { configureEvent, emitEvent, removeAccents } from '../../services/util';

interface StaffVehicle {
  id: string;
  model: string;
  plate: string;
  description: string;
  faction: string;
};

const StaffVehiclePage = () => {
  const [loading, setLoading] = useState(true);
  const [originalItems, setOriginalItems] = useState<StaffVehicle[]>([]);
  const [items, setItems] = useState<StaffVehicle[]>([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [record, setRecord] = useState<StaffVehicle>();
  const [models, setModels] = useState<string[]>([]);
  const [modelsModal, setModelsModal] = useState(false);

  useEffect(() => {
    configureEvent(Constants.STAFF_VEHICLE_PAGE_SHOW, (itemsJson: string, modelsJson: string) => {
      setOriginalItems(JSON.parse(itemsJson));
      setModels(JSON.parse(modelsJson));
      handleModalCancel();
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.STAFF_VEHICLE_PAGE_SHOW);
  }, []);

  const add = () => {
    setModal(true);
    setRecord({
      id: '',
      model: '',
      plate: '',
      description: '',
      faction: '',
    })
  };

  const remove = (id: string) => {
    setLoading(true);
    emitEvent(Constants.STAFF_VEHICLE_PAGE_REMOVE, id);
  }

  const handleCancel = () => {
    emitEvent(Constants.STAFF_VEHICLE_PAGE_CLOSE);
  };

  const handleModalCancel = () => {
    setModal(false);
  }

  const handleModalOk = () => {
    setLoading(true);
    emitEvent(Constants.STAFF_VEHICLE_PAGE_SAVE, record.model, record.faction);
  };

  useEffect(() => {
    if (search == '') {
      setItems(originalItems);
      return;
    }

    const newSearch = removeAccents(search);
    const filteredItems = originalItems.filter(x =>
      removeAccents(x.model).includes(newSearch) || removeAccents(x.faction).includes(newSearch)
      || removeAccents(x.plate).includes(newSearch) || removeAccents(x.description).includes(newSearch)
    );
    setItems(filteredItems);
  }, [search, originalItems]);

  const columns: ColumnsType<StaffVehicle> = [
    {
      title: t('model'),
      dataIndex: 'model',
      key: 'model',
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
      title: t('faction'),
      dataIndex: 'faction',
      key: 'faction',
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

  return <Modal open={true} title={t('vehicles')} onCancel={handleCancel} footer={null} width={'60%'}>
    <Row gutter={16}>
      <Col span={4}>
        <Button style={{ width: '100%' }} onClick={() => setModelsModal(true)}>{t('serverMods')}</Button>
      </Col>
      <Col span={16}>
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

    {record && <Modal open={modal} title={t('add') + ' ' + t('vehicle')}
      onOk={handleModalOk} onCancel={handleModalCancel} confirmLoading={loading}
      cancelText={t('close')} okText={t('save')} >
      <Form layout='vertical'>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('model')}>
              <Input value={record.model} onChange={(e) => setRecord({ ...record, model: e.target.value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('faction')}>
              <Input value={record.faction} onChange={(e) => setRecord({ ...record, faction: e.target.value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>}

    {modelsModal && <Modal open={true} title={t('serverMods')} onCancel={() => setModelsModal(false)} footer={null}>
      {models.join(', ')}
    </Modal>}
  </Modal>
};

export default StaffVehiclePage;