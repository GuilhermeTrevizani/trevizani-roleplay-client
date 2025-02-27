import { Button, Col, Form, Input, InputNumber, Modal, Row, Select } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { configureEvent, emitEvent } from '../../services/util';
import PlayerPosition from '../../types/PlayerPosition';
import SelectOption from '../../types/SelectOption';
import PlayerRotation from '../../types/PlayerRotation';

interface StaffProperty {
  id: string;
  number: number;
  interior: number;
  interiorDisplay: string;
  address: string;
  value: number;
  entranceDimension: number;
  entrancePosX: number;
  entrancePosY: number;
  entrancePosZ: number;
  hasOwner: boolean;
  factionName: string;
  name?: string;
  exitPosX: number;
  exitPosY: number;
  exitPosZ: number;
  parentPropertyNumber?: number;
  entranceRotR: number;
  entranceRotP: number;
  entranceRotY: number;
  exitRotR: number;
  exitRotP: number;
  exitRotY: number;
  companyName: string;
};

const StaffPropertyPage = () => {
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState<StaffProperty>();
  const [playerPosition, setPlayerPosition] = useState<PlayerPosition>();
  const [interiors, setInteriors] = useState<SelectOption[]>([]);
  const [playerRotation, setPlayerRotation] = useState<PlayerRotation>();

  useEffect(() => {
    // setRecord({
    //   id: '',
    //   address: '',
    //   entranceDimension: 0,
    //   entrancePosX: 0,
    //   entrancePosY: 0,
    //   entrancePosZ: 0,
    //   interior: 1,
    //   interiorDisplay: '',
    //   value: 0,
    //   number: 0,
    //   hasOwner: false,
    //   factionName: '',
    //   name: '',
    //   exitPosX: 0,
    //   exitPosY: 0,
    //   exitPosZ: 0,
    //   entranceRotR: 0,
    //   entranceRotP: 0,
    //   entranceRotY: 0,
    //   exitRotR: 0,
    //   exitRotP: 0,
    //   exitRotY: 0,
    //   companyName: '',
    // })
    // setLoading(false)
    configureEvent(Constants.STAFF_PROPERTY_PAGE_SHOW, (propertyJson: string, playerPositionJson: string, playerRotationJson: string, interiorsJson: string) => {
      setRecord(JSON.parse(propertyJson));
      setPlayerPosition(JSON.parse(playerPositionJson));
      setPlayerRotation(JSON.parse(playerRotationJson));
      setInteriors(JSON.parse(interiorsJson));
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.STAFF_PROPERTY_PAGE_SHOW);
  }, []);

  const handleCancel = () => {
    emitEvent(Constants.STAFF_PROPERTY_PAGE_CLOSE);
  };

  const handleModalOk = () => {
    setLoading(true);
    emitEvent(Constants.STAFF_PROPERTY_PAGE_SAVE, record.id, record.interior, record.value,
      record.entranceDimension, record.entrancePosX, record.entrancePosY, record.entrancePosZ,
      record.factionName, record.name, record.exitPosX, record.exitPosY, record.exitPosZ,
      record.entranceRotR, record.entranceRotP, record.entranceRotY,
      record.exitRotR, record.exitRotP, record.exitRotY, record.companyName,
      record.parentPropertyNumber);
  };

  const getEntrancePosition = () => {
    setRecord({ ...record, entrancePosX: playerPosition.x, entrancePosY: playerPosition.y, entrancePosZ: playerPosition.z, entranceDimension: playerPosition.dimension });
  };

  const getExitPosition = () => {
    setRecord({ ...record, exitPosX: playerPosition.x, exitPosY: playerPosition.y, exitPosZ: playerPosition.z });
  };

  const getEntranceRotation = () => {
    setRecord({ ...record, entranceRotR: playerRotation.x, entranceRotP: playerRotation.y, entranceRotY: playerRotation.z });
  };

  const getExitRotation = () => {
    setRecord({ ...record, exitRotR: playerRotation.x, exitRotP: playerRotation.y, exitRotY: playerRotation.z });
  };

  if (!record)
    return <></>

  return <Modal open={true} title={t('edit') + ' ' + t('property')}
    onOk={handleModalOk} onCancel={handleCancel} confirmLoading={loading}
    cancelText={t('close')} okText={t('save')} width={'60%'}>
    <Form layout='vertical' style={{ maxHeight: '80vh', overflowY: 'auto', overflowX: 'hidden' }}>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label={t('interior')}>
            <Select options={interiors} value={record.interior} showSearch optionFilterProp='label'
              onChange={(value) => setRecord({ ...record, interior: value })} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={t('value')}>
            <InputNumber value={record.value} onChange={(value) => setRecord({ ...record, value: value })} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={t('parentPropertyNumber')}>
            <InputNumber value={record.parentPropertyNumber} onChange={(value) => setRecord({ ...record, parentPropertyNumber: value })} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label={t('faction')}>
            <Input disabled={record.hasOwner} value={record.factionName} onChange={(e) => setRecord({ ...record, factionName: e.target.value })} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={t('company')}>
            <Input disabled={record.hasOwner} value={record.companyName} onChange={(e) => setRecord({ ...record, companyName: e.target.value })} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={t('name')}>
            <Input value={record.name} onChange={(e) => setRecord({ ...record, name: e.target.value })} style={{ width: '100%' }} maxLength={50} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item>
            <Button onClick={getEntrancePosition}>{t('getEntrancePosition')}</Button>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item label={t('entrancePositionX')}>
            <InputNumber value={record.entrancePosX} onChange={(value) => setRecord({ ...record, entrancePosX: value })} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label={t('entrancePositionY')}>
            <InputNumber value={record.entrancePosY} onChange={(value) => setRecord({ ...record, entrancePosY: value })} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label={t('entrancePositionZ')}>
            <InputNumber value={record.entrancePosZ} onChange={(value) => setRecord({ ...record, entrancePosZ: value })} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label={t('dimension')}>
            <InputNumber value={record.entranceDimension} onChange={(value) => setRecord({ ...record, entranceDimension: value })} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item>
            <Button onClick={getEntranceRotation}>{t('getEntranceRotation')}</Button>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label={t('entranceRotationX')}>
            <InputNumber value={record.entranceRotR} onChange={(value) => setRecord({ ...record, entranceRotR: value })} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={t('entranceRotationY')}>
            <InputNumber value={record.entranceRotP} onChange={(value) => setRecord({ ...record, entranceRotP: value })} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={t('entranceRotationZ')}>
            <InputNumber value={record.entranceRotY} onChange={(value) => setRecord({ ...record, entranceRotY: value })} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item>
            <Button onClick={getExitPosition}>{t('getExitPosition')}</Button>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label={t('exitPositionX')}>
            <InputNumber value={record.exitPosX} onChange={(value) => setRecord({ ...record, exitPosX: value })} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={t('exitPositionY')}>
            <InputNumber value={record.exitPosY} onChange={(value) => setRecord({ ...record, exitPosY: value })} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={t('exitPositionZ')}>
            <InputNumber value={record.exitPosZ} onChange={(value) => setRecord({ ...record, exitPosZ: value })} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item>
            <Button onClick={getExitRotation}>{t('getExitRotation')}</Button>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label={t('exitRotationX')}>
            <InputNumber value={record.exitRotR} onChange={(value) => setRecord({ ...record, exitRotR: value })} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={t('exitRotationY')}>
            <InputNumber value={record.exitRotP} onChange={(value) => setRecord({ ...record, exitRotP: value })} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={t('exitRotationZ')}>
            <InputNumber value={record.exitRotY} onChange={(value) => setRecord({ ...record, exitRotY: value })} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  </Modal>
};

export default StaffPropertyPage;