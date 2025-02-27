import { Button, Col, Flex, Form, Input, InputNumber, Modal, Popconfirm, Row, Select, Table } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { ColumnsType } from 'antd/es/table';
import { configureEvent, emitEvent, formatDateTime, formatValue, removeAccents } from '../../services/util';
import PlayerPosition from '../../types/PlayerPosition';
import SelectOption from '../../types/SelectOption';

interface StaffCompany {
  id: string;
  name: string;
  posX: number;
  posY: number;
  posZ: number;
  weekRentValue: number;
  rentPaymentDate?: Date;
  owner: string;
  typeDisplay: string;
  type: number;
  safe: number;
  blipType: number;
  blipColor: number;
  currentEmployeeOnDuty: string;
};

const StaffCompanyPage = () => {
  const [loading, setLoading] = useState(true);
  const [originalItems, setOriginalItems] = useState<StaffCompany[]>([]);
  const [items, setItems] = useState<StaffCompany[]>([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [record, setRecord] = useState<StaffCompany>();
  const [playerPosition, setPlayerPosition] = useState<PlayerPosition>();
  const [types, setTypes] = useState<SelectOption[]>();

  useEffect(() => {
    configureEvent(Constants.STAFF_COMPANY_PAGE_SHOW, (itemsJson: string, playerPositionJson: string) => {
      setOriginalItems(JSON.parse(itemsJson));
      handleModalCancel();
      setPlayerPosition(JSON.parse(playerPositionJson));
      setLoading(false);
    });

    configureEvent(Constants.STAFF_COMPANY_PAGE_LOAD_TYPES, (typesJson: string) => {
      setTypes(JSON.parse(typesJson));
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.STAFF_COMPANY_PAGE_SHOW);
  }, []);

  const add = () => {
    setModal(true);
    setRecord({
      id: '',
      name: '',
      posX: 0,
      posY: 0,
      posZ: 0,
      owner: '',
      weekRentValue: 0,
      type: 1,
      typeDisplay: '',
      safe: 0,
      blipType: 0,
      blipColor: 0,
      currentEmployeeOnDuty: '',
    })
  };

  const edit = (record: StaffCompany) => {
    setModal(true);
    setRecord(record);
  }

  const handleCancel = () => {
    emitEvent(Constants.STAFF_COMPANY_PAGE_CLOSE);
  };

  const handleModalCancel = () => {
    setModal(false);
  }

  const handleModalOk = () => {
    setLoading(true);
    emitEvent(Constants.STAFF_COMPANY_PAGE_SAVE, record.id, record.name, record.posX, record.posY, record.posZ, record.weekRentValue, record.type,
      record.blipType, record.blipColor);
  };

  const goto = (id: string) => {
    emitEvent(Constants.STAFF_COMPANY_PAGE_GO_TO, id);
  }

  const removeOwner = (id: string) => {
    setLoading(true);
    emitEvent(Constants.STAFF_COMPANY_PAGE_REMOVE_OWNER, id);
  }

  const remove = (id: string) => {
    setLoading(true);
    emitEvent(Constants.STAFF_COMPANY_PAGE_REMOVE, id);
  }

  const getPosition = () => {
    setRecord({ ...record, posX: playerPosition.x, posY: playerPosition.y, posZ: playerPosition.z });
  };

  const showItems = (id: string) => {
    setLoading(true);
    emitEvent(Constants.STAFF_COMPANY_PAGE_SHOW_ITEMS, id);
  }

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

  const columns: ColumnsType<StaffCompany> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('type'),
      dataIndex: 'typeDisplay',
      key: 'typeDisplay',
    },
    {
      title: t('position'),
      dataIndex: 'position',
      key: 'position',
      render: (_, record: StaffCompany) => `X: ${record.posX} | Y: ${record.posY} | Z: ${record.posZ}`,
    },
    {
      title: t('weekRent'),
      dataIndex: 'weekRentValue',
      key: 'weekRentValue',
      render: (weekRentValue: number) => `$${formatValue(weekRentValue)}`,
    },
    {
      title: t('nextRent'),
      dataIndex: 'rentPaymentDate',
      key: 'rentPaymentDate',
      render: (rentPaymentDate: Date) => rentPaymentDate && formatDateTime(rentPaymentDate),
    },
    {
      title: t('owner'),
      dataIndex: 'owner',
      key: 'owner',
    },
    {
      title: t('safe'),
      dataIndex: 'safe',
      key: 'safe',
      render: (safe: number) => `$${formatValue(safe)}`,
    },
    {
      title: t('employeeOnDuty'),
      dataIndex: 'employeeOnDuty',
      key: 'employeeOnDuty',
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (id: string, record: StaffCompany) => <Flex justify='space-evenly'>
        <Button size='small' onClick={() => goto(record.id)}>{t('goto')}</Button>
        <Button size='small' onClick={() => showItems(record.id)}>{t('items')}</Button>
        <Button size='small' onClick={() => edit(record)}>{t('edit')}</Button>
        <Popconfirm
          title={t('deleteRecord')}
          description={t('deleteRecordConfirm')}
          onConfirm={() => remove(id)}
          okText={t('yes')}
          cancelText={t('no')}
        >
          <Button size='small' danger>{t('delete')}</Button>
        </Popconfirm>
        {record.owner != 'N/A' && <Popconfirm
          title={t('removeOwner')}
          description={t('removeOwnerConfirm')}
          onConfirm={() => removeOwner(id)}
          okText={t('yes')}
          cancelText={t('no')}
        >
          <Button size='small' danger>{t('removeOwner')}</Button>
        </Popconfirm>}
      </Flex>,
    },
  ];

  return <Modal open={true} title={t('companies')} onCancel={handleCancel} footer={null} width={'70%'}>
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

    {record && <Modal open={modal} title={(record.id != '' ? t('edit') : t('add')) + ' ' + t('company')} onOk={handleModalOk} onCancel={handleModalCancel} confirmLoading={loading}
      cancelText={t('close')} okText={t('save')} >
      <Form layout='vertical'>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('name')}>
              <Input value={record.name} onChange={(e) => setRecord({ ...record, name: e.target.value })} maxLength={100} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('type')}>
              <Select value={record.type} options={types} onChange={(value) => setRecord({ ...record, type: value })} style={{ width: '100%' }} />
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
          <Col span={8}>
            <Form.Item label={t('weekRent')}>
              <InputNumber value={record.weekRentValue} onChange={(value) => setRecord({ ...record, weekRentValue: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('blipType')}>
              <InputNumber value={record.blipType} onChange={(value) => setRecord({ ...record, blipType: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('blipColor')}>
              <InputNumber value={record.blipColor} onChange={(value) => setRecord({ ...record, blipColor: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>}
  </Modal>
};

export default StaffCompanyPage;