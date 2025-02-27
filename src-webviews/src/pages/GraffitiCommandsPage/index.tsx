import { Col, Row, Tag } from 'antd';
import Text from 'antd/es/typography/Text';
import { t } from 'i18next';

const GraffitiCommandsPage = () => {
  return <div style={{
    backgroundColor: 'rgba(0,0,0,0.7)', color: 'white',
    padding: '0.6vh', borderRadius: '0.4vh', width: 'fit-content',
    fontSize: '0.8vh', fontWeight: 'bold',
    position: 'absolute', bottom: '10px', right: '10px',
    userSelect: 'none', WebkitTouchCallout: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none'
  }}>
    <Row gutter={16}>
      <Col span={12}><Tag>{t('graffitiRotationLeft')}</Tag></Col>
      <Col span={12} style={{ textAlign: 'right' }}><Text>{t('rotationLeft')}</Text></Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}><Tag>{t('graffitiRotationRight')}</Tag></Col>
      <Col span={12} style={{ textAlign: 'right' }}><Text>{t('rotationRight')}</Text></Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}><Tag>{t('graffitiCancel')}</Tag></Col>
      <Col span={12} style={{ textAlign: 'right' }}><Text>{t('cancel')}</Text></Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}><Tag>{t('graffitiConfirm')}</Tag></Col>
      <Col span={12} style={{ textAlign: 'right' }}><Text>{t('confirm')}</Text></Col>
    </Row>
  </div>;
};

export default GraffitiCommandsPage;