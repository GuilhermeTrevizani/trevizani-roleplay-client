import { useEffect, useState } from 'react';
import { configureEvent, emitEvent } from '../../services/util';
import { Form, InputNumber, Modal } from 'antd';
import { t } from 'i18next';
import { Constants } from '../../../../src/base/constants';
import TextArea from 'antd/es/input/TextArea';

const AttributesPage = () => {
  const [loading, setLoading] = useState(true);
  const [attributes, setAttributes] = useState('');
  const [age, setAge] = useState(0);

  useEffect(() => {
    configureEvent(Constants.ATTRIBUTES_PAGE_SHOW, (attributes: string, age: number) => {
      setAttributes(attributes);
      setAge(age);
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.ATTRIBUTES_PAGE_SHOW);
  }, []);

  const handleCancel = () => {
    emitEvent(Constants.ATTRIBUTES_PAGE_CLOSE);
  };

  const handleConfirm = () => {
    setLoading(true);
    emitEvent(Constants.ATTRIBUTES_PAGE_SAVE, attributes, age);
  };

  return <Modal open={true} onCancel={handleCancel} onOk={handleConfirm} closeIcon={false}
    cancelText={t('close')} okText={t('save')} confirmLoading={loading}>
    <Form layout='vertical'>
      <Form.Item label={t('attributes')}>
        <TextArea value={attributes} rows={10} showCount maxLength={500}
          onChange={(e) => setAttributes(e.target.value)}
        />
      </Form.Item>
      <Form.Item label={t('age')}>
        <InputNumber value={age} style={{ width: '100%' }}
          onChange={(value) => setAge(value)}
        />
      </Form.Item>
    </Form>
  </Modal>
}

export default AttributesPage;