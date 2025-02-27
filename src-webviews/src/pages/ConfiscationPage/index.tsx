import { Button, Col, Divider, Form, Input, InputNumber, List, Modal, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { Constants } from '../../../../src/base/constants';
import { t } from 'i18next';
import { configureEvent, emitEvent } from '../../services/util';
import ConfiscationItem from '../../types/ConfiscationItem';
import { DeleteOutlined } from '@ant-design/icons';

const ConfiscationPage = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ConfiscationItem[]>([]);
  const [item, setItem] = useState<ConfiscationItem>();
  const [characterName, setCharacterName] = useState('');
  const [selectedItems, setSelectedItems] = useState<ConfiscationItem[]>([]);
  const [quantity, setQuantity] = useState(0);
  const [identifier, setIdentifier] = useState('');
  const [itemIdentifier, setItemIdentifier] = useState('');

  useEffect(() => {
    configureEvent(Constants.CONFISCATION_PAGE_SHOW, (itemsJson: string) => {
      setItems(JSON.parse(itemsJson));
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.CONFISCATION_PAGE_SHOW);
  }, []);

  useEffect(() => {
    setQuantity(item?.quantity);
    setItemIdentifier(item?.identifier);
  }, [item]);

  const add = () => {
    if (!item)
      return;

    let currentItem = selectedItems.find(x => x.id === item.id);
    if (!currentItem) {
      currentItem = { ...item };
    }

    currentItem.quantity = quantity;
    currentItem.identifier = itemIdentifier;

    setSelectedItems(old => [
      ...old.filter(x => x.id !== item.id),
      currentItem
    ]);
    setItem(null);
  };

  const remove = (id: string) => {
    setSelectedItems(old => [
      ...old.filter(x => x.id !== id),
    ]);
  };

  const back = () => {
    setLoading(true);
    emitEvent(Constants.CONFISCATION_PAGE_CLOSE);
  };

  const submit = () => {
    setLoading(true);
    emitEvent(Constants.CONFISCATION_PAGE_SAVE, identifier, characterName, JSON.stringify(selectedItems));
  };

  return <Modal open={true} title={t('confiscation')} onOk={submit} onCancel={back} confirmLoading={loading}
    cancelText={t('close')} okText={t('save')} width={'70%'}>
    <Form layout='vertical'>
      <Form.Item label={t('identifier')}>
        <Input value={identifier}
          onChange={(e) => setIdentifier(e.target.value)} maxLength={50}
        />
      </Form.Item>
      <Form.Item label={t('characterName')}>
        <Input value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
        />
      </Form.Item>
      <Divider />
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label={t('item')}>
            <Select value={item?.id}
              options={items.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              labelRender={(props) => <div dangerouslySetInnerHTML={{ __html: props.label }}></div>}
              optionRender={(props) => <div dangerouslySetInnerHTML={{ __html: props.label }}></div>}
              onChange={(value) => setItem(items.find(x => x.id == value))}
            />
          </Form.Item>
        </Col>
        <Col span={3}>
          <Form.Item label={t('quantity')}>
            <InputNumber value={quantity} onChange={(value) => setQuantity(value)} style={{ width: '100%' }} min={1} max={item?.quantity} />
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item label={t('identifier')}>
            <Input value={itemIdentifier} onChange={(e) => setItemIdentifier(e.target.value)} style={{ width: '100%' }} maxLength={50} />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label=' '>
            <Button onClick={add} style={{ width: '100%' }}>{t('add')}</Button>
          </Form.Item>
        </Col>
      </Row>
      <List
        header={t('items')}
        bordered
        dataSource={selectedItems}
        renderItem={(item) => (
          <List.Item>
            <span dangerouslySetInnerHTML={{ __html: `${item.quantity}x ${item.name}` + (item.identifier ? ` (${item.identifier})`: '') }}></span> <Button danger type="primary" shape="circle" icon={<DeleteOutlined />} onClick={() => remove(item.id)} />
          </List.Item>
        )}
      />
    </Form>
  </Modal>
}

export default ConfiscationPage;