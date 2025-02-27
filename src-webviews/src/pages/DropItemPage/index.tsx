import { Col, Row, Tag } from 'antd';
import Text from 'antd/es/typography/Text';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { configureEvent, emitEvent, formatValue } from '../../services/util';
import { Constants } from '../../../../src/base/constants';
import PlayerRotation from '../../types/PlayerRotation';

const DropItemPage = () => {
  const [usingPosition, setUsingPosition] = useState(true);
  const [position, setPosition] = useState<PlayerRotation>({
    x: 0,
    y: 0,
    z: 0,
  });
  const [rotation, setRotation] = useState<PlayerRotation>({
    x: 0,
    y: 0,
    z: 0,
  });
  const [velocity, setVelocity] = useState(0);

  useEffect(() => {
    configureEvent(Constants.DROP_ITEM_PAGE_SHOW, (usingPosition: boolean) => {
      setUsingPosition(usingPosition);
    });

    configureEvent(Constants.DROP_ITEM_PAGE_UPDATE_POSITION, (positionJson: string) => {
      setPosition(JSON.parse(positionJson));
    });

    configureEvent(Constants.DROP_ITEM_PAGE_UPDATE_ROTATION, (rotationJson: string) => {
      setRotation(JSON.parse(rotationJson));
    });

    configureEvent(Constants.DROP_ITEM_PAGE_UPDATE_VELOCITY, (velocity: number) => {
      setVelocity(velocity);
    });

    emitEvent(Constants.DROP_ITEM_PAGE_SHOW);
  }, []);

  return <div style={{
    backgroundColor: 'rgba(0,0,0,0.7)', color: 'white',
    padding: '0.6vh', borderRadius: '0.4vh', width: 'fit-content',
    fontSize: '0.8vh', fontWeight: 'bold',
    position: 'absolute', bottom: '10px', right: '10px',
    userSelect: 'none', WebkitTouchCallout: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none'
  }}>
    <Row gutter={16}>
      <Col span={12}><Tag>{t('dropItemPositionX')}</Tag></Col>
      <Col span={12} style={{ textAlign: 'right' }}><Text>{t('axisX')}</Text></Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}><Tag>{t('dropItemPositionY')}</Tag></Col>
      <Col span={12} style={{ textAlign: 'right' }}><Text>{t('axisY')}</Text></Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}><Tag>{t('dropItemPositionZ')}</Tag></Col>
      <Col span={12} style={{ textAlign: 'right' }}><Text>{t('axisZ')}</Text></Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}><Tag>{t('velocityKey')}</Tag></Col>
      <Col span={12} style={{ textAlign: 'right' }}><Text>{t('velocity')}</Text></Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}><Tag>{t('dropItemPositionRotation')}</Tag></Col>
      <Col span={12} style={{ textAlign: 'right' }}><Text>{t(usingPosition ? 'rotation' : 'position')}</Text></Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}><Tag>{t('dropItemCancel')}</Tag></Col>
      <Col span={12} style={{ textAlign: 'right' }}><Text>{t('cancel')}</Text></Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}><Tag>{t('dropItemConfirm')}</Tag></Col>
      <Col span={12} style={{ textAlign: 'right' }}><Text>{t('confirm')}</Text></Col>
    </Row>
    <Row gutter={16}>
      <Col span={6}><Tag>X: {formatValue(position.x, 2)}</Tag></Col>
      <Col span={6}><Tag>Y: {formatValue(position.y, 2)}</Tag></Col>
      <Col span={6}><Tag>Z: {formatValue(position.z, 2)}</Tag></Col>
      <Col span={6} style={{ textAlign: 'right' }}><Text>{t('position')}</Text></Col>
    </Row>
    <Row gutter={16}>
      <Col span={6}><Tag>X: {formatValue(rotation.x, 2)}</Tag></Col>
      <Col span={6}><Tag>Y: {formatValue(rotation.y, 2)}</Tag></Col>
      <Col span={6}><Tag>Z: {formatValue(rotation.z, 2)}</Tag></Col>
      <Col span={6} style={{ textAlign: 'right' }}><Text>{t('rotation')}</Text></Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}><Tag>{formatValue(velocity, 5)}</Tag></Col>
      <Col span={12} style={{ textAlign: 'right' }}><Text>{t('velocity')}</Text></Col>
    </Row>
  </div>;
};

export default DropItemPage;