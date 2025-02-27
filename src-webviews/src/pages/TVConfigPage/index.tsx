import { useEffect, useState } from 'react';
import { Constants } from '../../../../src/base/constants';
import { Button, Flex, Form, Input, Modal, Slider } from 'antd';
import { t } from 'i18next';
import { configureEvent, emitEvent } from '../../services/util';

const TVConfigPage = () => {
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState('');
  const [volume, setVolume] = useState(100);

  useEffect(() => {
    configureEvent(Constants.TV_CONFIG_PAGE_SHOW, (url: string, volume: number) => {
      setUrl(url);
      setVolume(volume);
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.TV_CONFIG_PAGE_SHOW);
  }, []);

  const handleCancel = () => {
    emitEvent(Constants.TV_CONFIG_PAGE_CLOSE);
  };

  const handleOk = () => {
    setLoading(true);
    emitEvent(Constants.TV_CONFIG_PAGE_SAVE, url, volume);
  };

  return <Modal open={true} title={t('tv')} onCancel={handleCancel} footer={null}>
    <Form layout='vertical'>
      <Form.Item label={t('videoId')}>
        <Input value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </Form.Item>
      <Form.Item label={t('volume')}>
        <Slider value={volume} min={0} max={100} step={1}
          onChange={(value: number) => setVolume(value)}
        />
      </Form.Item>
      <Form.Item>
        <Flex justify='space-evenly'>
          <Button type='primary' onClick={handleOk} loading={loading}>{t('save')}</Button>
        </Flex>
      </Form.Item>
    </Form>
  </Modal>;
};

export default TVConfigPage;