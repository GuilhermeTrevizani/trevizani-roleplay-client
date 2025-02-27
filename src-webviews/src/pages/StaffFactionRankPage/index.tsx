import { Button, Col, Flex, Form, Input, InputNumber, Modal, Row, Table } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { ColumnsType } from 'antd/es/table';
import { configureEvent, emitEvent, formatValue, removeAccents } from '../../services/util';
import StaffFactionRank from '../../types/StaffFactionRank';

const StaffFactionRankPage = () => {
  const [loading, setLoading] = useState(true);
  const [originalItems, setOriginalItems] = useState<StaffFactionRank[]>([]);
  const [items, setItems] = useState<StaffFactionRank[]>([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [record, setRecord] = useState<StaffFactionRank>();
  const [factionName, setFactionName] = useState('');

  useEffect(() => {
    configureEvent(Constants.STAFF_FACTION_RANK_PAGE_SHOW, (itemsJson: string) => {
      setOriginalItems(JSON.parse(itemsJson));
      handleModalCancel();
      setLoading(false);
    });

    configureEvent(Constants.STAFF_FACTION_RANK_PAGE_LOAD_FACTION_NAME, (factionName: string) => {
      setFactionName(factionName);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.STAFF_FACTION_RANK_PAGE_SHOW);
  }, []);

  const edit = (record: StaffFactionRank) => {
    setModal(true);
    setRecord(record);
  }

  const handleCancel = () => {
    emitEvent(Constants.STAFF_FACTION_RANK_PAGE_CLOSE);
  };

  const handleModalCancel = () => {
    setModal(false);
  }

  const handleModalOk = () => {
    setLoading(true);
    emitEvent(Constants.STAFF_FACTION_RANK_PAGE_SAVE, record.id, record.salary);
  };

  useEffect(() => {
    if (search == '') {
      setItems(originalItems);
      return;
    }

    const newSearch = removeAccents(search);
    const filteredItems = originalItems.filter(x =>
      removeAccents(x.name).includes(newSearch)
    );
    setItems(filteredItems);
  }, [search, originalItems]);

  const columns: ColumnsType<StaffFactionRank> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('salary'),
      dataIndex: 'salary',
      key: 'salary',
      render: (salary: number) => `$${formatValue(salary)}`,
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (_, record: StaffFactionRank) => <Flex justify='space-evenly'>
        <Button size='small' onClick={() => edit(record)}>{t('edit')}</Button>
      </Flex>,
    },
  ];

  return <Modal open={true} title={factionName} onCancel={handleCancel} footer={null} width={'60%'}>
    <Row gutter={16}>
      <Col span={24}>
        <Input placeholder={t('searchHere')} value={search} onChange={(e) => setSearch(e.target.value)} />
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

    {record && <Modal open={modal} title={t('edit') + ' ' + t('rank')} onOk={handleModalOk} onCancel={handleModalCancel} confirmLoading={loading}
      cancelText={t('close')} okText={t('save')} >
      <Form layout='vertical'>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('name')}>
              <Input value={record.name} style={{ width: '100%' }} readOnly />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('salary')}>
              <InputNumber value={record.salary} onChange={(value) => setRecord({ ...record, salary: value })} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>}
  </Modal>
};

export default StaffFactionRankPage;