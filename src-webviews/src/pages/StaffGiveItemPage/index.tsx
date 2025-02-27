import { Col, Form, Input, InputNumber, Modal, Row, Select } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { configureEvent, emitEvent } from '../../services/util';
import ItemTemplate from '../../types/ItemTemplate';

interface GiveItem {
  itemTemplateId: string;
  quantity: number;
  targetId: number;
  reason: string;
};

const StaffGiveItemPage = () => {
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<ItemTemplate[]>([]);
  const [record, setRecord] = useState<GiveItem>({
    itemTemplateId: '',
    quantity: 1,
    targetId: 0,
    reason: '',
  });

  useEffect(() => {
    configureEvent(Constants.STAFF_GIVE_ITEM_PAGE_SHOW, (templatesJson: string) => {
      setTemplates(JSON.parse(templatesJson));
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.STAFF_GIVE_ITEM_PAGE_SHOW);
  }, []);

  const handleCancel = () => {
    emitEvent(Constants.STAFF_GIVE_ITEM_PAGE_CLOSE);
  };

  const handleModalOk = () => {
    setLoading(true);
    emitEvent(Constants.STAFF_GIVE_ITEM_PAGE_SAVE, record.itemTemplateId, record.quantity, record.targetId, record.reason);
  };

  const getTemplate = () => {
    return templates.find(x => x.id === record.itemTemplateId);
  }

  useEffect(() => {
    setRecord({ ...record, quantity: 1 })
  }, [record.itemTemplateId]);

  return <Modal open={true} title={t('giveItem')} onCancel={handleCancel} onOk={handleModalOk} confirmLoading={loading}
    cancelText={t('close')} okText={t('save')} >
    <Form layout='vertical'>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label={t('item')}>
            <Select value={record.itemTemplateId} options={templates.map(x => ({ value: x.id, label: x.name }))}
              onChange={(value) => setRecord({ ...record, itemTemplateId: value })} style={{ width: '100%' }} showSearch optionFilterProp='label' />
          </Form.Item>
        </Col>
      </Row>
      {getTemplate()?.isStack && <Row gutter={16}>
        <Col span={24}>
          <Form.Item label={t('quantity')}>
            <InputNumber value={record.quantity} onChange={(value) => setRecord({ ...record, quantity: value })} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>}
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label={t('playerId')}>
            <InputNumber value={record.targetId} onChange={(value) => setRecord({ ...record, targetId: value })} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label={t('reason')}>
            <Input value={record.reason} onChange={(e) => setRecord({ ...record, reason: e.target.value })} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  </Modal>
};

export default StaffGiveItemPage;