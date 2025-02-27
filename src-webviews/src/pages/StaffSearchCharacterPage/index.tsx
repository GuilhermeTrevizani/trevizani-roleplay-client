import { Alert, Button, Col, Descriptions, DescriptionsProps, Flex, Form, Input, InputNumber, List, Modal, Row } from 'antd';
import { configureEvent, emitEvent, formatDateTime, formatValue } from '../../services/util';
import { Constants } from '../../../../src/base/constants';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { StaffFlag } from '../../types/StaffFlag';
import { Staff } from '../../types/Staff';
import Title from 'antd/es/typography/Title';
import Text from 'antd/es/typography/Text';
import { stringFormat } from '../../i18n';

interface Character {
  id: string;
  name: string;
  history: string;
  evaluatorStaffUser: string;
  faction: string;
  rank: string;
  user: string;
  job: string;
  banishment?: CharacterBanishment;
  items: CharacterItem[];
  properties: CharacterProperty[];
  vehicles: CharacterVehicle[];
  companies: CharacterCompany[];
  registerDate: Date;
  premium: string;
  bank: number;
  nameChanges: number;
  plateChanges: number;
  connectedTime: number;
  nameChangeStatus: CharacterNameChangeStatus;
  deathDate?: Date,
  deathReason?: string,
  ckAvaliation: boolean;
  jailFinalDate?: Date;
  deletedDate?: Date;
  numberChanges: number;
  premiumPoints: number;
  ajailMinutes: number;
  ip: string;
  socialClubName: string;
};

interface CharacterBanishment {
  registerDate: Date;
  reason: string;
  expirationDate?: Date;
  staff: string;
  userId?: string;
};

interface CharacterItem {
  name: string;
  quantity: number;
  extra?: string;
};

interface CharacterProperty {
  number: number;
  address: string;
  value: number;
  protectionLevel: number;
};

interface CharacterVehicle {
  model: string;
  plate: string;
  protectionLevel: number;
  xmr: boolean;
};

interface CharacterCompany {
  name: string;
  owner: boolean;
};

enum CharacterNameChangeStatus {
  Allowed = 1,
  Blocked = 2,
  Done = 3,
}

const StaffSearchCharacterPage = () => {
  const [loading, setLoading] = useState(true);
  const [userStaffFlags, setUserStaffFlags] = useState<StaffFlag[]>([]);
  const [userStaff, setUserStaff] = useState<Staff>();
  const [character, setCharacter] = useState<Character>();
  const [ban, setBan] = useState(false);
  const [banDays, setBanDays] = useState(0);
  const [banReason, setBanReason] = useState('');
  const [warn, setWarn] = useState(false);
  const [warnReason, setWarnReason] = useState('');
  const [ajail, setAjail] = useState(false);
  const [ajailMinutes, setAjailMinutes] = useState(0);
  const [ajailReason, setAjailReason] = useState('');

  useEffect(() => {
    // setCharacter({
    //   bank: 10,
    //   ckAvaliation: false,
    //   companies: [],
    //   connectedTime: 1,
    //   evaluatorStaffUser: 'Trevizani',
    //   faction: 'LSSD',
    //   history: 'História',
    //   id: '1',
    //   items: [],
    //   job: 'Emprego',
    //   name: 'Guilherme Trevizani',
    //   nameChanges: 1,
    //   nameChangeStatus: 1,
    //   numberChanges: 1,
    //   plateChanges: 1,
    //   premium: 'Ouro',
    //   premiumPoints: 123,
    //   properties: [],
    //   rank: 'Deputy Sheriff',
    //   registerDate: new Date(),
    //   user: 'Trevizani',
    //   vehicles: [],
    //   ajailMinutes: 0,
    //   ip: 'IP',
    //   socialClubName: 'Social Club',
    // });
    // setUserStaff(Staff.ServerManager);
    // setLoading(false);
    configureEvent(Constants.STAFF_SEARCH_CHARACTER_PAGE_SHOW, (userStaffJson: string, userStaffFlagsJson: string, characterJson: string) => {
      setUserStaff(JSON.parse(userStaffJson));
      setUserStaffFlags(JSON.parse(userStaffFlagsJson));
      setCharacter(JSON.parse(characterJson));
      cancelBanCharacter();
      cancelAjailCharacter();
      cancelWarnCharacter();
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    emitEvent(Constants.STAFF_SEARCH_CHARACTER_PAGE_SHOW);
  }, []);

  const handleCancel = () => {
    emitEvent(Constants.STAFF_SEARCH_CHARACTER_PAGE_CLOSE);
  };

  const banCharacter = () => {
    setBanDays(0);
    setBanReason('');
    setBan(true);
  };

  const confirmBanCharacter = () => {
    setLoading(true);
    emitEvent(Constants.STAFF_SEARCH_CHARACTER_PAGE_BAN, character.id, banDays, banReason);
  };

  const cancelBanCharacter = () => {
    setBan(false);
  };

  const changeNameChangeStatus = () => {
    setLoading(true);
    emitEvent(Constants.STAFF_SEARCH_CHARACTER_PAGE_CHANGE_NAME_CHANGE_STATUS, character.id);
  };

  const removeFromJail = () => {
    setLoading(true);
    emitEvent(Constants.STAFF_SEARCH_CHARACTER_PAGE_REMOVE_JAIL, character.id);
  };

  const removeFromCKOrCKAvaliation = () => {
    setLoading(true);
    emitEvent(Constants.STAFF_SEARCH_CHARACTER_PAGE_REMOVE_CK_OR_CK_AVALIATION, character.id);
  };

  const applyCKAvaliation = () => {
    setLoading(true);
    emitEvent(Constants.STAFF_SEARCH_CHARACTER_PAGE_SET_CK_AVALIATION, character.id);
  };

  const applyCK = () => {
    setLoading(true);
    emitEvent(Constants.STAFF_SEARCH_CHARACTER_PAGE_CK, character.id);
  };

  const giveWarn = () => {
    setWarnReason('');
    setWarn(true);
  };

  const giveAjail = () => {
    setAjailMinutes(0);
    setAjailReason('');
    setAjail(true);
  };

  const confirmAjailCharacter = () => {
    setLoading(true);
    emitEvent(Constants.STAFF_SEARCH_CHARACTER_PAGE_GIVE_AJAIL, character.id, ajailMinutes, ajailReason);
  };

  const cancelAjailCharacter = () => {
    setAjail(false);
  };

  const confirmWarnCharacter = () => {
    setLoading(true);
    emitEvent(Constants.STAFF_SEARCH_CHARACTER_PAGE_GIVE_WARN, character.id, warnReason);
  };

  const cancelWarnCharacter = () => {
    setWarn(false);
  };

  if (!character)
    return <></>

  const characterItems: DescriptionsProps['items'] = [
    {
      key: t('ooc'),
      label: t('ooc'),
      children: character.user,
    },
    {
      key: t('faction'),
      label: t('faction'),
      children: character.faction,
    },
    {
      key: t('rank'),
      label: t('rank'),
      children: character.rank,
    },
    {
      key: t('job'),
      label: t('job'),
      children: character.job,
    },
    {
      key: t('register'),
      label: t('register'),
      children: formatDateTime(character.registerDate),
    },
    {
      key: t('premium'),
      label: t('premium'),
      children: character.premium,
    },
    {
      key: t('bank'),
      label: t('bank'),
      children: formatValue(character.bank ?? 0),
    },
    {
      key: t('premiumPoints'),
      label: t('premiumPoints'),
      children: formatValue(character.premiumPoints ?? 0),
    },
    {
      key: t('nameChanges'),
      label: t('nameChanges'),
      children: formatValue(character.nameChanges ?? 0) + (character.nameChangeStatus === CharacterNameChangeStatus.Blocked ? ` (${t('blocked')})` : ''),
    },
    {
      key: t('plateChanges'),
      label: t('plateChanges'),
      children: formatValue(character.plateChanges ?? 0),
    },
    {
      key: t('numberChanges'),
      label: t('numberChanges'),
      children: formatValue(character.numberChanges ?? 0),
    },
    {
      key: t('connectedTime'),
      label: t('connectedTime'),
      children: formatValue(character.connectedTime ?? 0),
    },
    {
      key: t('ip'),
      label: t('ip'),
      children: character.ip,
      className: userStaff < Staff.LeadServerAdmin ? 'hidden' : '',
    },
    {
      key: t('socialClub'),
      label: t('socialClub'),
      children: character.socialClubName,
      className: userStaff < Staff.LeadServerAdmin ? 'hidden' : '',
    },
  ];

  return <Modal open={true} title={character.name} onCancel={handleCancel} footer={null} width={'90%'} >
    <div style={{ maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}>
      <Row gutter={16}>
        <Col span={6}>
          <Title level={3}>{character.name}</Title>
        </Col>
        <Col span={18}>
          <Flex vertical={false} gap='small' justify='flex-end'>
            {!character.deletedDate && !character.banishment && userStaff >= Staff.JuniorServerAdmin
              && <Button onClick={banCharacter} loading={loading}>{t('ban')}</Button>}
            {!character.deletedDate && character.nameChangeStatus !== CharacterNameChangeStatus.Done && userStaffFlags.includes(StaffFlag.CK)
              && <Button onClick={changeNameChangeStatus} loading={loading}>{t(character.nameChangeStatus === CharacterNameChangeStatus.Allowed ? 'block' : 'release')} {t('nameChange')}</Button>}
            {!character.deletedDate && character.jailFinalDate && userStaff >= Staff.LeadServerAdmin
              && <Button onClick={removeFromJail} loading={loading}>{t('removeFromJail')}</Button>}
            {!character.deletedDate && (character.ckAvaliation || character.deathDate) && userStaffFlags.includes(StaffFlag.CK)
              && <Button onClick={removeFromCKOrCKAvaliation} loading={loading}>{t('removeFromCKOrCKAvaliation')}</Button>}
            {!character.deletedDate && !character.deathDate && !character.ckAvaliation && userStaffFlags.includes(StaffFlag.CK)
              && <Button onClick={applyCKAvaliation} loading={loading}>{t('applyCKAvaliation')}</Button>}
            {!character.deletedDate && !character.deathDate && userStaffFlags.includes(StaffFlag.CK)
              && <Button onClick={applyCK} loading={loading}>{t('applyCK')}</Button>}
            {!character.deletedDate && character.ajailMinutes == 0 && userStaff >= Staff.JuniorServerAdmin
              && <Button onClick={giveAjail} loading={loading}>{t('ajail')}</Button>}
            {!character.deletedDate && userStaff >= Staff.JuniorServerAdmin
              && <Button onClick={giveWarn} loading={loading}>{t('giveWarn')}</Button>}
          </Flex>
        </Col>
      </Row>
      {character.banishment && <Alert style={{ margin: '10px' }}
        message={<>{stringFormat(t('thisUserIsBanned'), t(character.banishment.userId ? 'user' : 'character').toLowerCase())}<br />{t('date')}: <strong>{formatDateTime(character.banishment.registerDate)}</strong><br />{t('reason')}: <strong>{character.banishment.reason}</strong><br />{t('staff')}: <strong>{character.banishment.staff}</strong><br />{t('expiration')}: <strong>{character.banishment.expirationDate ? formatDateTime(character.banishment.registerDate) : t('permanent')}</strong><br /></>} type="error" />}
      {character.deletedDate && <Alert style={{ margin: '10px' }} type='error' message={t('thisCharacterIsDeleted')} />}
      {character.jailFinalDate > new Date() && <Alert style={{ margin: '10px' }} type='error' message={stringFormat(t('thisCharacterIsArrestedUntil'), formatDateTime(character.jailFinalDate))} />}
      {character.deathDate && <Alert style={{ margin: '10px' }} type='error' message={stringFormat(t('thisCharacterIsDead'), formatDateTime(character.deathDate), character.deathReason)} />}
      {character.ckAvaliation && <Alert style={{ margin: '10px' }} type='error' message={t('thisCharacterIsInCKAvaliation')} />}
      <Descriptions items={characterItems} />
      <Title level={5}>{t('history')} ({t('acceptedBy')} {character.evaluatorStaffUser})</Title>
      <Text>{character.history}</Text>
      <Title level={5} style={{ marginTop: '10px' }}>{t('inventory')}</Title>
      <List
        bordered
        dataSource={character.items}
        locale={{ emptyText: 'Personagem não possui itens no inventário.' }}
        renderItem={(item) => (
          <List.Item>
            <Text>{t('name')}: <strong>{item.name}</strong> | {t('quantity')}: <strong>{formatValue(item.quantity)}</strong> {item.extra && <> | {t('extra')}: <strong dangerouslySetInnerHTML={{ __html: item.extra }}></strong></>}</Text>
          </List.Item>
        )}
      />
      <Title level={5} style={{ marginTop: '10px' }}>{t('properties')}</Title>
      <List
        bordered
        dataSource={character.properties}
        locale={{ emptyText: 'Personagem não possui propriedades.' }}
        renderItem={(item) => (
          <List.Item>
            <Text>{t('number')}: <strong>{item.number}</strong> | {t('address')}: <strong>{item.address}</strong> | {t('price')}: $<strong>{formatValue(item.value)}</strong> | {t('protectionLevel')}: <strong>{item.protectionLevel}</strong></Text>
          </List.Item>
        )}
      />
      <Title level={5} style={{ marginTop: '10px' }}>{t('vehicles')}</Title>
      <List
        bordered
        dataSource={character.vehicles}
        locale={{ emptyText: 'Personagem não possui veículos.' }}
        renderItem={(item) => (
          <List.Item>
            <Text>{t('model')}: <strong>{item.model.toUpperCase()}</strong> | {t('plate')}: <strong>{item.plate}</strong> | {t('protectionLevel')}: <strong>{item.protectionLevel}</strong> | {t('xmr')}: <strong>{item.xmr ? t('yes') : t('no')}</strong></Text>
          </List.Item>
        )}
      />
      <Title level={5} style={{ marginTop: '10px' }}>{t('companies')}</Title>
      <List
        bordered
        dataSource={character.companies}
        locale={{ emptyText: 'Personagem não possui empresas.' }}
        renderItem={(item) => (
          <List.Item>
            <Text>{t('name')}: <strong>{item.name}</strong> | {t('owner')}: <strong>{item.owner ? t('yes') : t('no')}</strong></Text>
          </List.Item>
        )}
      />
    </div>

    {ban && <Modal open={true} title={t('ban')}
      onOk={confirmBanCharacter} onCancel={cancelBanCharacter} confirmLoading={loading}
      cancelText={t('close')} okText={t('ban')} >
      <Form layout='vertical'>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('banDays')}>
              <InputNumber value={banDays} onChange={(value) => setBanDays(value)} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('reason')}>
              <Input value={banReason} onChange={(e) => setBanReason(e.target.value)} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>}

    {ajail && <Modal open={true} title={t('ajail')}
      onOk={confirmAjailCharacter} onCancel={cancelAjailCharacter} confirmLoading={loading}
      cancelText={t('close')} okText={t('ajail')} >
      <Form layout='vertical'>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('minutes')}>
              <InputNumber value={ajailMinutes} onChange={(value) => setAjailMinutes(value)} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('reason')}>
              <Input value={ajailReason} onChange={(e) => setAjailReason(e.target.value)} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>}

    {warn && <Modal open={true} title={t('giveWarn')}
      onOk={confirmWarnCharacter} onCancel={cancelWarnCharacter} confirmLoading={loading}
      cancelText={t('close')} okText={t('giveWarn')} >
      <Form layout='vertical'>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('reason')}>
              <Input value={warnReason} onChange={(e) => setWarnReason(e.target.value)} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>}
  </Modal>
};

export default StaffSearchCharacterPage;