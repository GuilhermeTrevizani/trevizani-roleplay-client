import { Button, Col, Modal, Popconfirm, Row, Table } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { ColumnsType } from 'antd/es/table';
import { configureEvent, emitEvent, formatValue } from '../../services/util';
import Title from 'antd/es/typography/Title';

interface PremiumItem {
  name: string;
  value: number;
  differentLevel: boolean;
};

const PremiumStorePage = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<PremiumItem[]>([]);
  const [premiumPoints, setPremiumPoints] = useState(0);

  useEffect(() => {
    configureEvent(Constants.PREMIUM_STORE_PAGE_SHOW, (premiumPoints: number, itemsJson: string) => {
      setPremiumPoints(premiumPoints);
      setItems(JSON.parse(itemsJson));
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.PREMIUM_STORE_PAGE_SHOW);
  }, []);

  const buy = (record: PremiumItem) => {
    setLoading(true);
    emitEvent(Constants.PREMIUM_STORE_PAGE_BUY, record.name)
  }

  const handleCancel = () => {
    emitEvent(Constants.PREMIUM_STORE_PAGE_CLOSE);
  };

  const columns: ColumnsType<PremiumItem> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('value'),
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => formatValue(value),
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (_, record: PremiumItem) =>
        <Popconfirm
          title={t('purchaseConfirmation')}
          description={t(record.differentLevel ? 'differentPremiumLevelConfirmationContent' : 'purchaseConfirmationContent')}
          onConfirm={() => buy(record)}
          okText={t('yes')}
          cancelText={t('no')}
        >
          <Button size='small'>{t('buy')}</Button>
        </Popconfirm>
    },
  ];

  return <Modal open={true} title={t('premium')} onCancel={handleCancel} footer={null}>
    <Row gutter={16}>
      <Col span={24}>
        <Title level={5}>
          Você possui {formatValue(premiumPoints)} LS Points. Para adquirir clique <a href='https://ucp.ls-chronicles.com.br/premium' target='_blank'>aqui</a>.
        </Title>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={24}>
        <Table
          columns={columns}
          dataSource={items}
          loading={loading}
          pagination={false}
          style={{ marginTop: '10px', maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}
        />
      </Col>
    </Row>
  </Modal>
};

export default PremiumStorePage;