import { useEffect, useState } from 'react';
import { Constants } from '../../../../src/base/constants';
import { Col, Input, Modal, Row, Select, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { t } from 'i18next';
import { configureEvent, emitEvent, removeAccents } from '../../services/util';
import Animation from '../../types/Animation';

const AnimationPage = () => {
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<Animation[]>([]);
  const [search, setSearch] = useState('');
  const [originalOptions, setOriginalOptions] = useState<Animation[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState('');

  useEffect(() => {
    configureEvent(Constants.ANIMATION_PAGE_SHOW, (categoriesJson: string, animationsJson: string) => {
      setCategory(t('all'));
      setCategories([t('all'), ...JSON.parse(categoriesJson)]);
      setOriginalOptions(JSON.parse(animationsJson));
      setLoading(false);
    });

    emitEvent(Constants.ANIMATION_PAGE_SHOW);
  }, []);

  useEffect(() => {
    if (search == '') {
      if (originalOptions.length > 0)
        setOptions(originalOptions.filter(x => category === t('all') || x.category === category));
      return;
    }

    const newSearch = removeAccents(search);
    const filteredItems = originalOptions.filter(x =>
      (category === t('all') || x.category === category) && removeAccents(x.display).includes(newSearch)
    );
    setOptions(filteredItems);
  }, [search, category, originalOptions]);

  const handleCancel = () => {
    emitEvent(Constants.ANIMATION_PAGE_CLOSE);
  };

  const columns: ColumnsType<Animation> = [
    {
      title: t('category'),
      dataIndex: 'category',
      key: 'category',
      hidden: category !== t('all'),
    },
    {
      title: t('option'),
      dataIndex: 'display',
      key: 'display',
    },
  ];

  return <Modal open={true} title={t('animations')} onCancel={handleCancel} footer={null} width={'50%'}>
    <Row gutter={16}>
      <Col span={4}>
        <Select value={category} onChange={(value) => setCategory(value)}
          options={categories.map(x => ({ value: x, label: x }))}
          style={{ width: '100%' }} />
      </Col>
      <Col span={20}>
        <Input placeholder={t('searchHere')} value={search} onChange={(e) => setSearch(e.target.value)} />
      </Col>
    </Row>
    <Table
      columns={columns}
      dataSource={options}
      loading={loading}
      style={{ marginTop: '10px', maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}
    />
  </Modal>;
};

export default AnimationPage;