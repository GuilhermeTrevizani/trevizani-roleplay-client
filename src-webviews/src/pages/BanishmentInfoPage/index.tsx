import { Modal } from 'antd';
import { useEffect, useState } from 'react';
import { Constants } from '../../../../src/base/constants';
import BanishmentInfo from '../../types/BanishmentInfo';
import Title from 'antd/es/typography/Title';
import { t } from 'i18next';
import { stringFormat } from '../../i18n';
import { configureEvent, formatDateTime } from '../../services/util';

const BanishmentInfoPage = () => {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<BanishmentInfo>();

  useEffect(() => {
    configureEvent(Constants.BANISHMENT_INFO_PAGE_SHOW, (infoJson: string) => {
      setInfo(JSON.parse(infoJson));
      setLoading(false);
    });
  }, []);

  if (!info)
    return <></>

  return <Modal open={true} title={info.expirationDate ? stringFormat(t('banWithExpirationDate'), formatDateTime(info.expirationDate)) : t('banPermanently')} footer={null} confirmLoading={loading} closable={false}>
    <Title level={3}>{t('date')}: {formatDateTime(info.registerDate)}</Title>
    <Title level={3}>{t('reason')}: {info.reason}</Title>
    <Title level={3}>{t('staffer')}: {info.staffer}</Title>
  </Modal>
}

export default BanishmentInfoPage;