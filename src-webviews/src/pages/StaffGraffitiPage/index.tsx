import { Button, Col, Flex, Input, Modal, Popconfirm, Row, Table } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { ColumnsType } from 'antd/es/table';
import { configureEvent, emitEvent, formatValue, removeAccents } from '../../services/util';

interface StaffGraffiti {
  id: string;
  text: string;
  font: string;
  size: number;
  character: string;
  dimension: number;
  posX: number;
  posY: number;
  posZ: number;
  rotR: number;
  rotP: number;
  rotY: number;
  colorR: number;
  colorG: number;
  colorB: number;
  colorA: number;
}

const StaffGraffitiPage = () => {
  const [loading, setLoading] = useState(true);
  const [originalItems, setOriginalItems] = useState<StaffGraffiti[]>([]);
  const [items, setItems] = useState<StaffGraffiti[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    configureEvent(Constants.STAFF_GRAFFITI_PAGE_SHOW, (itemsJson: string) => {
      setOriginalItems(JSON.parse(itemsJson));
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.STAFF_GRAFFITI_PAGE_SHOW);
  }, []);

  const remove = (id: string) => {
    setLoading(true);
    emitEvent(Constants.STAFF_GRAFFITI_PAGE_REMOVE, id);
  }

  const handleCancel = () => {
    emitEvent(Constants.STAFF_GRAFFITI_PAGE_CLOSE);
  };

  const goto = (id: string) => {
    emitEvent(Constants.STAFF_GRAFFITI_PAGE_GO_TO, id);
  }

  useEffect(() => {
    if (search == '') {
      setItems(originalItems);
      return;
    }

    const newSearch = removeAccents(search);
    const filteredItems = originalItems.filter(x =>
      removeAccents(x.text).includes(newSearch) || removeAccents(x.character).includes(newSearch)
    );
    setItems(filteredItems);
  }, [search, originalItems]);

  const columns: ColumnsType<StaffGraffiti> = [
    {
      title: t('text'),
      dataIndex: 'text',
      key: 'text',
    },
    {
      title: t('font'),
      dataIndex: 'font',
      key: 'font',
    },
    {
      title: t('size'),
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: t('character'),
      dataIndex: 'character',
      key: 'character',
    },
    {
      title: t('position'),
      dataIndex: 'position',
      key: 'position',
      render: (_, record: StaffGraffiti) => `X: ${record.posX} | Y: ${record.posY} | Z: ${record.posZ}`,
    },
    {
      title: t('dimension'),
      dataIndex: 'dimension',
      key: 'dimension',
      render: (dimension: number) => formatValue(dimension),
    },
    {
      title: t('rotation'),
      dataIndex: 'rotation',
      key: 'rotation',
      render: (_, record: StaffGraffiti) => `X: ${record.rotR} | Y: ${record.rotP} | Z: ${record.rotY}`,
    },
    {
      title: t('color'),
      dataIndex: 'color',
      key: 'color',
      render: (_, record: StaffGraffiti) => `R: ${record.colorR} | G: ${record.colorG} | B: ${record.colorB} | A: ${record.colorA}`,
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (id: string, record: StaffGraffiti) => <Flex justify='space-evenly'>
        <Button size='small' onClick={() => goto(record.id)}>{t('goto')}</Button>
        <Popconfirm
          title={t('deleteRecord')}
          description={t('deleteRecordConfirm')}
          onConfirm={() => remove(id)}
          okText={t('yes')}
          cancelText={t('no')}
        >
          <Button danger size='small'>{t('delete')}</Button>
        </Popconfirm>
      </Flex>,
    },
  ];

  return <Modal open={true} title={t('graffitis')} onCancel={handleCancel} footer={null} width={'70%'}>
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
          style={{ marginTop: '10px', maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}
        />
      </Col>
    </Row>
  </Modal>
};

export default StaffGraffitiPage;