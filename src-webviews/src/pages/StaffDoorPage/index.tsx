import { Button, Checkbox, Col, Flex, Form, Input, InputNumber, Modal, Popconfirm, Row, Table } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { ColumnsType } from 'antd/es/table';
import { configureEvent, emitEvent, removeAccents } from '../../services/util';
import PlayerPosition from '../../types/PlayerPosition';

interface StaffDoor {
  id: string;
  name: string;
  hash: number;
  posX: number;
  posY: number;
  posZ: number;
  factionName: string;
  companyName: string;
  locked: boolean;
};

const StaffDoorPage = () => {
  const [loading, setLoading] = useState(true);
  const [originalItems, setOriginalItems] = useState<StaffDoor[]>([]);
  const [items, setItems] = useState<StaffDoor[]>([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [record, setRecord] = useState<StaffDoor>();
  const [objectHash, setObjectHash] = useState(0);
  const [objectPosition, setObjectPosition] = useState<PlayerPosition>({
    x: 0,
    y: 0,
    z: 0,
    dimension: 0,
  });

  useEffect(() => {
    configureEvent(Constants.STAFF_DOOR_PAGE_SHOW, (itemsJson: string, objectHash: number, objectPositionJson: string) => {
      setOriginalItems(JSON.parse(itemsJson));
      handleModalCancel();
      setObjectHash(objectHash);
      setObjectPosition(JSON.parse(objectPositionJson));
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.STAFF_DOOR_PAGE_SHOW);
  }, []);

  const add = () => {
    setModal(true);
    setRecord({
      id: '',
      posX: 0,
      posY: 0,
      posZ: 0,
      hash: 0,
      name: '',
      locked: false,
      factionName: '',
      companyName: '',
    })
  };

  const edit = (record: StaffDoor) => {
    setModal(true);
    setRecord(record);
  }

  const remove = (id: string) => {
    setLoading(true);
    emitEvent(Constants.STAFF_DOOR_PAGE_REMOVE, id);
  }

  const handleCancel = () => {
    emitEvent(Constants.STAFF_DOOR_PAGE_CLOSE);
  };

  const handleModalCancel = () => {
    setModal(false);
  }

  const handleModalOk = () => {
    setLoading(true);
    emitEvent(Constants.STAFF_DOOR_PAGE_SAVE, record.id, record.name, record.hash, record.posX, record.posY, record.posZ,
      record.factionName, record.companyName, record.locked);
  };

  const goto = (id: string) => {
    emitEvent(Constants.STAFF_DOOR_PAGE_GO_TO, id);
  }

  const getPosition = () => {
    setRecord({ ...record, hash: objectHash, posX: objectPosition.x, posY: objectPosition.y, posZ: objectPosition.z });
  };

  useEffect(() => {
    if (search == '') {
      setItems(originalItems);
      return;
    }

    const newSearch = removeAccents(search);
    const filteredItems = originalItems.filter(x =>
      removeAccents(x.name).includes(newSearch) || removeAccents(x.hash.toString()).includes(newSearch)
      || removeAccents(x.factionName).includes(newSearch) || removeAccents(x.companyName).includes(newSearch)
    );
    setItems(filteredItems);
  }, [search, originalItems]);

  const columns: ColumnsType<StaffDoor> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('hash'),
      dataIndex: 'hash',
      key: 'hash',
    },
    {
      title: t('position'),
      dataIndex: 'position',
      key: 'position',
      render: (_, record: StaffDoor) => `X: ${record.posX} | Y: ${record.posY} | Z: ${record.posZ}`,
    },
    {
      title: t('faction'),
      dataIndex: 'factionName',
      key: 'factionName',
    },
    {
      title: t('company'),
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: t('locked'),
      dataIndex: 'locked',
      key: 'locked',
      align: 'center',
      render: (locked: boolean) => t(locked ? 'yes' : 'no'),
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (id: string, record: StaffDoor) => <Flex justify='space-evenly'>
        <Button size='small' onClick={() => goto(record.id)}>{t('goto')}</Button>
        <Button size='small' onClick={() => edit(record)}>{t('edit')}</Button>
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

  return <Modal open={true} title={t('doors')} onCancel={handleCancel} footer={null} width={'60%'}>
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

    {record && <Modal open={modal} title={(record.id != '' ? t('edit') : t('add')) + ' ' + t('door')} onOk={handleModalOk} onCancel={handleModalCancel} confirmLoading={loading}
      cancelText={t('close')} okText={t('save')} >
      <Form layout='vertical'>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('name')}>
              <Input value={record.name} onChange={(e) => setRecord({ ...record, name: e.target.value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('hash')}>
              <InputNumber value={record.hash} onChange={(value) => setRecord({ ...record, hash: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item>
              <Button onClick={getPosition}>{t('getPosition')}</Button>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label={t('positionX')}>
              <InputNumber value={record.posX} onChange={(value) => setRecord({ ...record, posX: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('positionY')}>
              <InputNumber value={record.posY} onChange={(value) => setRecord({ ...record, posY: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('positionZ')}>
              <InputNumber value={record.posZ} onChange={(value) => setRecord({ ...record, posZ: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={t('faction')}>
              <Input value={record.factionName} onChange={(e) => setRecord({ ...record, factionName: e.target.value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('company')}>
              <Input value={record.companyName} onChange={(e) => setRecord({ ...record, companyName: e.target.value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Checkbox checked={record.locked} onChange={(e) => setRecord({ ...record, locked: e.target.checked })}>{t('locked')}</Checkbox>
          </Col>
        </Row>
      </Form>
    </Modal>}
  </Modal>
};

export default StaffDoorPage;