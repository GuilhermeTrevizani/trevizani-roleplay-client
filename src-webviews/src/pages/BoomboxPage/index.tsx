import { useEffect, useState } from 'react';
import { Constants } from '../../../../src/base/constants';
import { Button, Flex, Form, Input, Modal, Select, Slider } from 'antd';
import { t } from 'i18next';
import { configureEvent, emitEvent } from '../../services/util';

interface AudioRadioStation {
  name: string;
  url: string;
};

const BoomboxPage = () => {
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [volume, setVolume] = useState(100);
  const [radioStations, setRadioStations] = useState<AudioRadioStation[]>([]);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    configureEvent(Constants.BOOMBOX_PAGE_SHOW, (title: string, url: string, volume: number, isPremium: boolean, radioStationsJson: string) => {
      setTitle(title);
      setUrl(url);
      setVolume(volume * 100);
      setRadioStations(JSON.parse(radioStationsJson));
      setIsPremium(isPremium);
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.BOOMBOX_PAGE_SHOW);
  }, []);

  const handleCancel = () => {
    emitEvent(Constants.BOOMBOX_PAGE_CLOSE);
  };

  const handleOk = () => {
    setLoading(true);
    emitEvent(Constants.BOOMBOX_PAGE_CONFIRM, url, volume / 100);
  };

  const handleTurnOff = () => {
    setLoading(true);
    emitEvent(Constants.BOOMBOX_PAGE_TURN_OFF);
  };

  return <Modal open={true} title={title} onCancel={handleCancel} footer={null} maskClosable={false}>
    <Form layout='vertical'>
      <Form.Item label={t('radioStation')}>
        <Select options={radioStations.map(x => ({ value: x.url, label: x.name }))}
          value={url} onChange={(value) => setUrl(value)} style={{ width: '100%' }} />
      </Form.Item>
      {isPremium && <Form.Item label={t('url')}>
        <Input value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </Form.Item>}
      <Form.Item label={t('volume')}>
        <Slider value={volume} min={0} max={100} step={1}
          onChange={(value: number) => setVolume(value)}
        />
      </Form.Item>
      <Form.Item>
        <Flex justify='space-evenly'>
          <Button danger onClick={handleTurnOff} loading={loading}>{t('turnOff')}</Button>
          <Button type='primary' onClick={handleOk} loading={loading}>{t('save')}</Button>
        </Flex>
      </Form.Item>
    </Form>
  </Modal>;
};

export default BoomboxPage;