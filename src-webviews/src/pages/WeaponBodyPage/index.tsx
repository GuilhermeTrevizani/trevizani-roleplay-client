import { Col, Form, InputNumber, Modal, Row, Slider } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { configureEvent, emitEvent } from '../../services/util';
import { t } from 'i18next';
import WeaponBody from '../../types/WeaponBody';

const WeaponBodyPage = () => {
  const [loading, setLoading] = useState(true);
  const [weaponBody, setWeaponBody] = useState<WeaponBody>({
    posX: 0,
    posY: 0,
    posZ: 0,
    rotR: 0,
    rotP: 0,
    rotY: 0,
  });
  const minPosValue = -0.5;
  const maxPosValue = 0.5;
  const minRotValue = -180;
  const maxRotValue = 180;
  const stepPos = 0.01;
  const stepRot = 0.5;

  useEffect(() => {
    configureEvent(Constants.WEAPON_BODY_PAGE_SHOW, (weaponBodyJson: string) => {
      setWeaponBody(JSON.parse(weaponBodyJson));
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.WEAPON_BODY_PAGE_SHOW);
  }, []);

  const handleOk = () => {
    setLoading(true);
    emitEvent(Constants.WEAPON_BODY_PAGE_SAVE, JSON.stringify(weaponBody));
  };

  const handleCancel = () => {
    emitEvent(Constants.WEAPON_BODY_PAGE_CLOSE);
  };

  useEffect(() => {
    emitEvent(Constants.WEAPON_BODY_PAGE_SET, JSON.stringify(weaponBody));
  }, [weaponBody]);

  return <Modal open={true} title={t('settings')} onCancel={handleCancel} width={'30%'}
    cancelText={t('close')} okText={t('save')} onOk={handleOk} loading={loading} confirmLoading={loading} maskClosable={false}
    style={{ maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden', position: 'fixed', right: '10px', top: '10px' }}>
    <Form layout='vertical'>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label={t('positionX')}>
            <InputNumber value={weaponBody.posX} min={minPosValue} max={maxPosValue}
              onChange={(value) => setWeaponBody({ ...weaponBody, posX: value })} />
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item label={' '}>
            <Slider value={weaponBody.posX} min={minPosValue} max={maxPosValue} step={stepPos}
              onChange={(value: number) => setWeaponBody({ ...weaponBody, posX: value })}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label={t('positionY')}>
            <InputNumber value={weaponBody.posY} min={minPosValue} max={maxPosValue}
              onChange={(value) => setWeaponBody({ ...weaponBody, posY: value })} />
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item label={' '}>
            <Slider value={weaponBody.posY} min={minPosValue} max={maxPosValue} step={stepPos}
              onChange={(value: number) => setWeaponBody({ ...weaponBody, posY: value })}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label={t('positionZ')}>
            <InputNumber value={weaponBody.posZ} min={minPosValue} max={maxPosValue}
              onChange={(value) => setWeaponBody({ ...weaponBody, posZ: value })} />
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item label={' '}>
            <Slider value={weaponBody.posZ} min={minPosValue} max={maxPosValue} step={stepPos}
              onChange={(value: number) => setWeaponBody({ ...weaponBody, posZ: value })}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label={t('rotationX')}>
            <InputNumber value={weaponBody.rotR} min={minRotValue} max={maxRotValue}
              onChange={(value) => setWeaponBody({ ...weaponBody, rotR: value })} />
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item label={' '}>
            <Slider value={weaponBody.rotR} min={minRotValue} max={maxRotValue} step={stepRot}
              onChange={(value: number) => setWeaponBody({ ...weaponBody, rotR: value })}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label={t('rotationY')}>
            <InputNumber value={weaponBody.rotP} min={minRotValue} max={maxRotValue}
              onChange={(value) => setWeaponBody({ ...weaponBody, rotP: value })} />
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item label={' '}>
            <Slider value={weaponBody.rotP} min={minRotValue} max={maxRotValue} step={stepRot}
              onChange={(value: number) => setWeaponBody({ ...weaponBody, rotP: value })}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label={t('rotationZ')}>
            <InputNumber value={weaponBody.rotY} min={minRotValue} max={maxRotValue}
              onChange={(value) => setWeaponBody({ ...weaponBody, rotY: value })} />
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item label={' '}>
            <Slider value={weaponBody.rotY} min={minRotValue} max={maxRotValue} step={stepRot}
              onChange={(value: number) => setWeaponBody({ ...weaponBody, rotY: value })}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  </Modal>
};

export default WeaponBodyPage;