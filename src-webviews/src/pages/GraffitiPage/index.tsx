import { Col, ColorPicker, Form, InputNumber, Modal, Row, Select } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { configureEvent, emitEvent } from '../../services/util';
import SelectOption from '../../types/SelectOption';
import { Color } from 'antd/es/color-picker';
import TextArea from 'antd/es/input/TextArea';

const GraffitiPage = () => {
  const [loading, setLoading] = useState(true);
  const [fonts, setFonts] = useState<SelectOption[]>([]);
  const [text, setText] = useState('');
  const [font, setFont] = useState(1);
  const [size, setSize] = useState(0);
  const [color, setColor] = useState<Color>();

  useEffect(() => {
    configureEvent(Constants.GRAFFITI_PAGE_SHOW, (fontsJson: string) => {
      setFonts(JSON.parse(fontsJson));
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.GRAFFITI_PAGE_SHOW);
  }, []);

  const handleCancel = () => {
    emitEvent(Constants.GRAFFITI_PAGE_CLOSE);
  };

  const handleModalOk = () => {
    const fontName = fonts.find(x => x.value.toString() === font.toString())?.label;
    if (!fontName || !color || !text.trim())
      return;

    const rgba = color.toRgb();
    const a = 255 * rgba.a;
    setLoading(true);
    emitEvent(Constants.GRAFFITI_PAGE_SAVE, text.replace(/\r\n|\r|\n/g, "<br />"), font, fontName, size,
      rgba.r, rgba.g, rgba.b, a);
  };

  return <Modal open={true} title={t('graffiti')} onCancel={handleCancel} onOk={handleModalOk} confirmLoading={loading}
    cancelText={t('close')} okText={t('save')} >
    <Form layout='vertical'>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label={t('text')}>
            <TextArea value={text} onChange={(e) => setText(e.target.value)} style={{ width: '100%' }} rows={3} maxLength={35} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label={t('font')}>
            <Select value={font} options={fonts}
              onChange={(value) => setFont(value)} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label={t('size')}>
            <InputNumber value={size} onChange={(value) => setSize(value)} style={{ width: '100%' }} min={1} max={100} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label={t('color')}>
            <ColorPicker size='large' value={color} onChange={(e) => setColor(e)} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  </Modal>
};

export default GraffitiPage;