import { Input, Modal, Table } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { ColumnsType } from 'antd/es/table';
import Command from '../../types/Command';
import { configureEvent, emitEvent, removeAccents } from '../../services/util';

const HelpPage = () => {
  const [loading, setLoading] = useState(true);
  const [commands, setCommands] = useState<Command[]>([]);
  const [originalCommands, setOriginalCommands] = useState<Command[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    configureEvent(Constants.HELP_PAGE_SHOW, (commandsJson: string) => {
      setOriginalCommands(JSON.parse(commandsJson));
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (search == '') {
      if (originalCommands.length > 0)
        setCommands(originalCommands);
      return;
    }

    const newSearch = removeAccents(search);
    const filteredItems = originalCommands.filter(x =>
      removeAccents(x.category).includes(newSearch) || removeAccents(x.name).includes(newSearch) || removeAccents(x.description).includes(newSearch)
    );
    setCommands(filteredItems);
  }, [search, originalCommands]);

  const handleCancel = () => {
    emitEvent(Constants.HELP_PAGE_CLOSE);
  };

  const columns: ColumnsType<Command> = [
    {
      title: t('category'),
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('description'),
      dataIndex: 'description',
      key: 'description',
    },
  ];

  return <Modal open={true} title={t('commands')} onCancel={handleCancel} footer={null} width={'50%'}>
    <Input placeholder={t('searchHere')} value={search} onChange={(e) => setSearch(e.target.value)} />
    <Table
      columns={columns}
      dataSource={commands}
      loading={loading}
      pagination={false}
      style={{ marginTop: '10px', maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}
    />
  </Modal>
};

export default HelpPage;