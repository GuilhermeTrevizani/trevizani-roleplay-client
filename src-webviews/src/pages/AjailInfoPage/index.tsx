import { Modal } from 'antd';
import { useEffect, useState } from 'react';
import { Constants } from '../../../../src/base/constants';
import Title from 'antd/es/typography/Title';
import { configureEvent, emitEvent } from '../../services/util';

const AjailInfoPage = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    configureEvent(Constants.AJAIL_INFO_PAGE_SHOW, (message: string) => {
      setMessage(message);
      setLoading(false);
    });

    emitEvent(Constants.AJAIL_INFO_PAGE_SHOW);
  }, []);

  return <div className='bgPageCentered'>
    <Modal open={true} footer={null} confirmLoading={loading} closable={false}>
      <Title level={3}>{message}</Title>
    </Modal>
  </div>
};

export default AjailInfoPage;