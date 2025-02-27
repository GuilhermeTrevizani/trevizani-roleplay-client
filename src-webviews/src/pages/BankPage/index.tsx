import { Button, Col, Form, Input, InputNumber, Modal, Row, Space, Table, Tabs, TabsProps, Tag } from 'antd';
import { t } from 'i18next';
import { configureEvent, emitEvent, formatDateTime, formatValue } from '../../services/util';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import Fine from '../../types/Fine';
import Transaction from '../../types/Transaction';
import { TransactionType } from '../../types/TransactionType';
import { stringFormat } from '../../i18n';

const BankPage = () => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [fines, setFines] = useState<Fine[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [name, setName] = useState('');
  const [accountAmount, setAccountAmmount] = useState(0);
  const [depositModal, setDepositModal] = useState(false);
  const [depositValue, setDepositValue] = useState(0);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [withdrawValue, setWithdrawValue] = useState(0);
  const [transferModal, setTransferModal] = useState(false);
  const [transferValue, setTransferValue] = useState(0);
  const [transferBankAccount, setTransferBankAccount] = useState(0);
  const [transferDescription, setTransferDescription] = useState('');
  const [transferName, setTransferName] = useState('');
  const [atm, setAtm] = useState(false);

  useEffect(() => {
    configureEvent(Constants.BANK_PAGE_SHOW, (atm: boolean, bankAccount: number, name: string, accountAmount: number, 
      finesJson: string, transactionsJson: string) => {
      setAtm(atm);
      setTitle(`${t('bankAccount')}: ${bankAccount}`);
      setFines(JSON.parse(finesJson));
      setTransactions(JSON.parse(transactionsJson));
      setName(name);
      setAccountAmmount(accountAmount);
      setLoading(false);
    });

    configureEvent(Constants.BANK_PAGE_TRANSFER, (name: string) => {
      setLoading(false);
      setTransferModal(false);
      setTransferName(name);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setDepositModal(false);
      setWithdrawModal(false);
      setTransferModal(false);
      setTransferName('');
      setLoading(false);
    });

    configureEvent(Constants.BANK_PAGE_UPDATE, (accountAmount: number, finesJson: string, transactionsJson: string) => {
      setFines(JSON.parse(finesJson));
      setTransactions(JSON.parse(transactionsJson));
      setAccountAmmount(accountAmount);
      setLoading(false);
    });

    emitEvent(Constants.BANK_PAGE_SHOW);
  }, []);

  const handleCancel = () => {
    emitEvent(Constants.BANK_PAGE_CLOSE);
  };

  const payFine = (id: string) => {
    setLoading(true);
    emitEvent(Constants.BANK_PAGE_PAY_FINE, id);
  };

  const deposit = () => {
    setDepositValue(0);
    setDepositModal(true);
  };

  const cancelDeposit = () => {
    setDepositModal(false);
  };

  const confirmDeposit = () => {
    setLoading(true);
    emitEvent(Constants.BANK_PAGE_DEPOSIT, depositValue);
  }

  const withdraw = () => {
    setWithdrawValue(0);
    setWithdrawModal(true);
  };

  const cancelWithdraw = () => {
    setWithdrawModal(false);
  };

  const confirmWithdraw = () => {
    setLoading(true);
    emitEvent(Constants.BANK_PAGE_WITHDRAW, withdrawValue);
  };

  const transfer = () => {
    setTransferValue(0);
    setTransferBankAccount(0);
    setTransferDescription('');
    setTransferModal(true);
  };

  const cancelTransfer = () => {
    setTransferModal(false);
  };

  const confirmTransfer = () => {
    setLoading(true);
    emitEvent(Constants.BANK_PAGE_TRANSFER, transferBankAccount, transferValue, transferDescription, false);
  };

  const cancelTransferConfirmation = () => {
    setTransferName('');
  };

  const confirmTransferConfirmation = () => {
    emitEvent(Constants.BANK_PAGE_TRANSFER, transferBankAccount, transferValue, transferDescription, true);
  };

  const columnsFines: ColumnsType<Fine> = [
    {
      title: t('date'),
      dataIndex: 'date',
      key: 'date',
      render: (date: Date) => formatDateTime(date),
    },
    {
      title: t('value'),
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => <>${formatValue(value)}</>,
    },
    {
      title: t('reason'),
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (id: string) => <Button size='small' onClick={() => payFine(id)}>{t('pay')}</Button>,
    },
  ];

  const columnsTransactions: ColumnsType<Transaction> = [
    {
      title: t('date'),
      dataIndex: 'date',
      key: 'date',
      render: (date: Date) => formatDateTime(date),
    },
    {
      title: t('value'),
      dataIndex: 'value',
      key: 'value',
      render: (value: number, transaction: Transaction) => <Tag color={transaction.type === TransactionType.Deposit ? 'green' : 'red'}>{transaction.type === TransactionType.Deposit ? '+' : '-'} ${formatValue(value)}</Tag>,
    },
    {
      title: t('description'),
      dataIndex: 'description',
      key: 'description',
    },
  ];

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: t('main'),
      children: <>
        {t('welcome')},
        <h3>{name}</h3>
        {t('balance')}
        <h4>${formatValue(accountAmount)}</h4>
        <Space>
          <Button onClick={deposit} hidden={atm}>{t('deposit')}</Button>
          <Button onClick={withdraw}>{t('withdraw')}</Button>
          <Button onClick={transfer} hidden={atm}>{t('transfer')}</Button>
        </Space>
      </>,
    },
    {
      key: '2',
      label: t('transactions'),
      children: <Table
        columns={columnsTransactions}
        dataSource={transactions}
        loading={loading}
        pagination={false}
      />,
    },
    {
      key: '3',
      label: t('fines'),
      children: <Table
        columns={columnsFines}
        dataSource={fines}
        loading={loading}
        pagination={false}
      />,
    },
  ];

  return <Modal open={true} title={title} onCancel={handleCancel} footer={null} width={'90%'}>
    <Tabs defaultActiveKey="1" items={items} />

    <Modal open={depositModal} title={t('deposit')} onCancel={cancelDeposit} onOk={confirmDeposit}
      cancelText={t('close')} okText={t('deposit')} confirmLoading={loading}>
      <InputNumber value={depositValue} onChange={(value) => setDepositValue(value)} min={0} />
    </Modal>

    <Modal open={withdrawModal} title={t('withdraw')} onCancel={cancelWithdraw} onOk={confirmWithdraw}
      cancelText={t('close')} okText={t('withdraw')} confirmLoading={loading}>
      <InputNumber value={withdrawValue} onChange={(value) => setWithdrawValue(value)} min={0} />
    </Modal>

    <Modal open={transferModal} title={t('transfer')} onCancel={cancelTransfer} onOk={confirmTransfer}
      cancelText={t('close')} okText={t('transfer')} confirmLoading={loading}>
      <Form layout='vertical'>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label={t('bankAccount')}>
              <InputNumber value={transferBankAccount} onChange={(value) => setTransferBankAccount(value)} min={0} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={t('value')}>
              <InputNumber value={transferValue} onChange={(value) => setTransferValue(value)} min={0} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('description')}>
              <Input value={transferDescription} onChange={(e) => setTransferDescription(e.target.value)} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>

    {transferName && <Modal open={true} title={t('transfer')} onCancel={cancelTransferConfirmation} onOk={confirmTransferConfirmation}
      cancelText={t('close')} okText={t('transfer')} confirmLoading={loading}>
      {stringFormat(t('transferConfirmation'), formatValue(transferValue), transferName)}
    </Modal>}
  </Modal>
};

export default BankPage;