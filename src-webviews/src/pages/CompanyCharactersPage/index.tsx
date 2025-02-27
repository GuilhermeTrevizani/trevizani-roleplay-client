import { Button, Col, Flex, Form, Input, InputNumber, Modal, Popconfirm, Row, Select } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { configureEvent, emitEvent, formatDateTime, removeAccents } from '../../services/util';
import Table, { ColumnsType } from 'antd/es/table';
import { t } from 'i18next';
import CompanyCharacter from '../../types/CompanyCharacter';
import { CompanyFlag } from '../../types/CompanyFlag';
import SelectOption from '../../types/SelectOption';

const CompanyCharactersPage = () => {
  const [loading, setLoading] = useState(true);
  const [originalItems, setOriginalItems] = useState<CompanyCharacter[]>([]);
  const [items, setItems] = useState<CompanyCharacter[]>([]);
  const [title, setTitle] = useState('');
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [characterId, setCharacterId] = useState(0);
  const [editCharacterId, setEditCharacterId] = useState('');
  const [editCharacterName, setEditCharacterName] = useState('');
  const [flags, setFlags] = useState<CompanyFlag[]>([]);
  const [flagsOptions, setFlagsOptions] = useState<SelectOption[]>([]);
  const [editFlags, setEditFlags] = useState<CompanyFlag[]>([]);

  useEffect(() => {
    configureEvent(Constants.COMPANY_CHARACTERS_PAGE_SHOW, (companyName: string, itemsJson: string, flagsJson: string, flagsOptionsJson: string) => {
      setTitle(companyName);
      setFlags(JSON.parse(flagsJson));
      setFlagsOptions(JSON.parse(flagsOptionsJson));
      setOriginalItems(JSON.parse(itemsJson));
      setAddModalOpen(false);
      setCharacterId(0);
      setEditCharacterId('');
      setEditCharacterName('');
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });
  }, []);

  const remove = (id: string) => {
    setLoading(true);
    emitEvent(Constants.COMPANY_CHARACTERS_PAGE_REMOVE, id);
  }

  const handleCancel = () => {
    emitEvent(Constants.COMPANY_CHARACTERS_PAGE_CLOSE);
  };

  const add = () => {
    setAddModalOpen(true);
  };

  const confirmAdd = () => {
    setLoading(true);
    emitEvent(Constants.COMPANY_CHARACTERS_PAGE_INVITE, characterId);
  };

  const cancelAdd = () => {
    setCharacterId(0);
    setAddModalOpen(false);
  };

  const edit = (character: CompanyCharacter) => {
    setEditCharacterId(character.id);
    setEditCharacterName(character.name);
    setEditFlags(JSON.parse(character.flagsJson));
  }

  const confirmEdit = () => {
    setLoading(true);
    emitEvent(Constants.COMPANY_CHARACTERS_PAGE_SAVE, editCharacterId, JSON.stringify(editFlags));
  };

  const cancelEdit = () => {
    setEditCharacterId('');
    setEditFlags([]);
  };

  useEffect(() => {
    if (search == '') {
      setItems(originalItems);
      return;
    }

    const newSearch = removeAccents(search);
    const filteredItems = originalItems.filter(x =>
      removeAccents(x.name).includes(newSearch) || removeAccents(x.user).includes(newSearch)
    );
    setItems(filteredItems);
  }, [search, originalItems]);

  const columns: ColumnsType<CompanyCharacter> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('user'),
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: t('lastAccess'),
      dataIndex: 'lastAccessDate',
      key: 'lastAccessDate',
      render: (lastAccessDate: Date) => formatDateTime(lastAccessDate),
    },
    {
      title: t('online'),
      dataIndex: 'isOnline',
      key: 'online',
      align: 'center',
      render: (isOnline: boolean) => <>{isOnline ? t('yes') : t('no')}</>,
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (id: string, character: CompanyCharacter) => <Flex justify='space-evenly'>
        <Button disabled={!flags.includes(CompanyFlag.EditEmployee)} size='small' onClick={() => edit(character)}>{t('edit')}</Button>
        <Popconfirm
          title={t('deleteRecord')}
          description={t('deleteRecordConfirm')}
          onConfirm={() => remove(id)}
          okText={t('yes')}
          cancelText={t('no')}
        >
          <Button disabled={!flags.includes(CompanyFlag.RemoveEmployee)} danger size='small'>{t('delete')}</Button>
        </Popconfirm>
      </Flex>
    },
  ];

  return <Modal open={true} title={title} onCancel={handleCancel} footer={null} width={'50%'}>
    <Row gutter={16}>
      <Col span={20}>
        <Input placeholder={t('searchHere')} value={search} onChange={(e) => setSearch(e.target.value)} />
      </Col>
      <Col span={4}>
        <Button type='primary' style={{ width: '100%' }} onClick={add} disabled={!flags.includes(CompanyFlag.InviteEmployee)}>{t('add')}</Button>
      </Col>
    </Row>
    <Table
      columns={columns}
      dataSource={items}
      loading={loading}
      style={{ marginTop: '10px', maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}
    />

    <Modal open={isAddModalOpen} title={t('characterId')} onOk={confirmAdd} onCancel={cancelAdd} confirmLoading={loading}
      cancelText={t('close')} okText={t('add')}>
      <InputNumber value={characterId} onChange={(value) => setCharacterId(value)} style={{ width: '100%' }} />
    </Modal>

    <Modal open={editCharacterId != ''} title={editCharacterName} onOk={confirmEdit} onCancel={cancelEdit} confirmLoading={loading}
      cancelText={t('close')} okText={t('edit')} >
      <Form layout='vertical'>
        <Form.Item label={t('flags')}>
          <Select mode='multiple' value={editFlags}
            options={flagsOptions}
            onChange={(value) => setEditFlags(value)}
            optionFilterProp='label'
          />
        </Form.Item>
      </Form>
    </Modal>
  </Modal>
};

export default CompanyCharactersPage;