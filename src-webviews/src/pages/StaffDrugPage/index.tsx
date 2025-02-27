import { Button, Col, Form, Input, InputNumber, Modal, Row, Table } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { ColumnsType } from 'antd/es/table';
import { configureEvent, emitEvent, formatValue, removeAccents } from '../../services/util';

interface StaffDrug {
  id: string;
  name: string;
  thresoldDeath: number;
  health: number;
  garbageCollectorMultiplier: number;
  truckerMultiplier: number;
  minutesDuration: number;
  warn: string;
  shakeGameplayCamName: string;
  shakeGameplayCamIntensity: number;
  timecycModifier: string;
  animpostFXName: string;
};

const StaffDrugPage = () => {
  const [loading, setLoading] = useState(true);
  const [originalItems, setOriginalItems] = useState<StaffDrug[]>([]);
  const [items, setItems] = useState<StaffDrug[]>([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [record, setRecord] = useState<StaffDrug>();

  useEffect(() => {
    // setItems([{
    //   name: 'Maconha',
    //   animpostFXName: 'anim',
    //   garbageCollectorMultiplier: 1,
    //   health: 12,
    //   id: '1',
    //   minutesDuration: 12,
    //   shakeGameplayCamIntensity: 1.4,
    //   shakeGameplayCamName: 'cam name',
    //   thresoldDeath: 22,
    //   timecycModifier: 'eae',
    //   truckerMultiplier: 32,
    //   warn: 'warn'
    // }])
    // setLoading(false);
    configureEvent(Constants.STAFF_DRUG_PAGE_SHOW, (itemsJson: string) => {
      setOriginalItems(JSON.parse(itemsJson));
      handleModalCancel();
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.STAFF_DRUG_PAGE_SHOW);
  }, []);


  const edit = (record: StaffDrug) => {
    setModal(true);
    setRecord(record);
  }

  const handleCancel = () => {
    emitEvent(Constants.STAFF_DRUG_PAGE_CLOSE);
  };

  const handleModalCancel = () => {
    setModal(false);
  }

  const handleModalOk = () => {
    setLoading(true);
    emitEvent(Constants.STAFF_DRUG_PAGE_SAVE, JSON.stringify(record));
  };

  const preview = () => {
    emitEvent(Constants.STAFF_DRUG_PAGE_PREVIEW,
      record.shakeGameplayCamName, record.shakeGameplayCamIntensity,
      record.timecycModifier, record.animpostFXName);
  };

  const stopPreview = () => {
    emitEvent(Constants.STAFF_DRUG_PAGE_STOP_PREVIEW);
  };

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

  const columns: ColumnsType<StaffDrug> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('thresoldDeath'),
      dataIndex: 'thresoldDeath',
      key: 'thresoldDeath',
      render: (value: number) => formatValue(value),
    },
    {
      title: t('health'),
      dataIndex: 'health',
      key: 'health',
      render: (value: number) => formatValue(value),
    },
    {
      title: t('minutesDuration'),
      dataIndex: 'minutesDuration',
      key: 'minutesDuration',
      render: (value: number) => formatValue(value),
    },
    {
      title: t('garbageCollectorMultiplier'),
      dataIndex: 'garbageCollectorMultiplier',
      key: 'garbageCollectorMultiplier',
      render: (value: number) => formatValue(value, 1),
    },
    {
      title: t('truckerMultiplier'),
      dataIndex: 'truckerMultiplier',
      key: 'truckerMultiplier',
      render: (value: number) => formatValue(value, 1),
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (id: string, record: StaffDrug) => <Button size='small' onClick={() => edit(record)}>{t('edit')}</Button>,
    },
  ];

  return <Modal open={true} title={t('drugs')} onCancel={handleCancel} footer={null} width={'80%'}>
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

    {record && <Modal open={modal} title={record.name} width={'40%'}
      onOk={handleModalOk} onCancel={handleModalCancel} confirmLoading={loading}
      cancelText={t('close')} okText={t('save')} >
      <Form layout='vertical' style={{ maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label={t('thresoldDeath')}>
              <InputNumber value={record.thresoldDeath}
                onChange={(value) => setRecord({ ...record, thresoldDeath: value })}
                style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('health')}>
              <InputNumber value={record.health}
                onChange={(value) => setRecord({ ...record, health: value })}
                style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('minutesDuration')}>
              <InputNumber value={record.minutesDuration}
                onChange={(value) => setRecord({ ...record, minutesDuration: value })}
                style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={t('garbageCollectorMultiplier')}>
              <InputNumber value={record.garbageCollectorMultiplier}
                onChange={(value) => setRecord({ ...record, garbageCollectorMultiplier: value })}
                style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('truckerMultiplier')}>
              <InputNumber value={record.truckerMultiplier}
                onChange={(value) => setRecord({ ...record, truckerMultiplier: value })}
                style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={t('shakeGameplayCamName')}>
              <Input value={record.shakeGameplayCamName}
                onChange={(e) => setRecord({ ...record, shakeGameplayCamName: e.target.value })}
                style={{ width: '100%' }} maxLength={100} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('shakeGameplayCamIntensity')}>
              <InputNumber value={record.shakeGameplayCamIntensity}
                onChange={(value) => setRecord({ ...record, shakeGameplayCamIntensity: value })}
                style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={t('timecycModifier')}>
              <Input value={record.timecycModifier}
                onChange={(e) => setRecord({ ...record, timecycModifier: e.target.value })}
                style={{ width: '100%' }} maxLength={100} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('animpostFXName')}>
              <Input value={record.animpostFXName}
                onChange={(e) => setRecord({ ...record, animpostFXName: e.target.value })}
                style={{ width: '100%' }} maxLength={100} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('warn')}>
              <Input value={record.warn}
                onChange={(e) => setRecord({ ...record, warn: e.target.value })}
                style={{ width: '100%' }} maxLength={300} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Button onClick={preview} style={{ width: '100%' }}>{t('preview')}</Button>
          </Col>
          <Col span={12}>
            <Button onClick={stopPreview} style={{ width: '100%' }}>{t('stopPreview')}</Button>
          </Col>
        </Row>
      </Form>
    </Modal>}
  </Modal>
};

export default StaffDrugPage;