import { Descriptions, DescriptionsProps, List, Modal, Tag } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { configureEvent, emitEvent, formatDateTime, formatValue } from '../../services/util';
import Title from 'antd/es/typography/Title';
import Text from 'antd/es/typography/Text';

interface CharacterInfo {
  name: string;
  currentDate: Date;
  user: string;
  factionId?: string;
  staff: number;
  registerDate: Date;
  paycheckValue: number;
  paycheckMultiplier: number;
  paycheckItems: CharacterInfoPaycheck[];
  items: CharacterInfoItem[];
  properties: CharacterInfoProperty[];
  vehicles: CharacterInfoVehicle[];
  companies: CharacterInfoCompany[];
  invites: CharacterInfoInvite[];
  history: string;
  premium: string;
  staffName: string;
  factionName: string;
  rankName: string;
  job: string;
  connectedTime: number;
  nameChanges: number;
  plateChanges: number;
  bank: number;
  skin: string;
  health: number;
  armor: number;
  usingDrug: string;
  endDrugEffects: string;
  thresoldDeath: string;
  thresoldDeathReset: string;
  staffDutyTime: number;
  helpRequestsAnswersQuantity: number;
  numberChanges: number;
  premiumPoints: number;
  bankAccount: number;
};

interface CharacterInfoPaycheck {
  description: string;
  value: number;
  debit: boolean;
};

interface CharacterInfoItem {
  name: string;
  quantity: number;
  extra?: string;
};

interface CharacterInfoProperty {
  address: string;
  price: number;
  protectionLevel: number;
  number: number;
};

interface CharacterInfoVehicle {
  model: string;
  plate: string;
  protectionLevel: number;
  xmr: boolean;
};

interface CharacterInfoCompany {
  name: string;
  owner: boolean;
};

interface CharacterInfoInvite {
  type: string;
  waitingTime: string;
};

const StatsPage = () => {
  const [loading, setLoading] = useState(true);
  const [character, setCharacter] = useState<CharacterInfo>({
    currentDate: new Date(),
    name: '',
    staff: 1,
    user: '',
    paycheckItems: [],
    paycheckValue: 0,
    paycheckMultiplier: 1,
    companies: [],
    items: [],
    invites: [],
    properties: [],
    vehicles: [],
    factionId: null,
    registerDate: new Date(),
    history: '',
    premium: '',
    staffName: '',
    factionName: '',
    rankName: '',
    armor: 0,
    bank: 0,
    connectedTime: 0,
    endDrugEffects: '',
    health: 0,
    helpRequestsAnswersQuantity: 0,
    job: '',
    nameChanges: 0,
    plateChanges: 0,
    skin: '',
    staffDutyTime: 0,
    thresoldDeath: '',
    thresoldDeathReset: '',
    usingDrug: '',
    numberChanges: 0,
    premiumPoints: 0,
    bankAccount: 0,
  });

  useEffect(() => {
    configureEvent(Constants.STATS_PAGE_SHOW, (characterJson: string) => {
      setCharacter(JSON.parse(characterJson));
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });
  }, []);

  const handleCancel = () => {
    emitEvent(Constants.STATS_PAGE_CLOSE);
  };

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: t('ooc'),
      children: character.user,
    },
    {
      key: '2',
      label: t('register'),
      children: formatDateTime(character.registerDate),
    },
    {
      key: '4',
      label: t('connectedTime'),
      children: formatValue(character.connectedTime),
    },
    {
      key: '3',
      label: t('premium'),
      children: character.premium,
    },
    {
      key: t('premiumPoints'),
      label: t('premiumPoints'),
      children: formatValue(character.premiumPoints),
    },
    {
      key: '6',
      label: t('nameChanges'),
      children: formatValue(character.nameChanges),
    },
    {
      key: '7',
      label: t('plateChanges'),
      children: formatValue(character.plateChanges),
    },
    {
      key: t('numberChanges'),
      label: t('numberChanges'),
      children: formatValue(character.numberChanges),
    },
    {
      key: '5',
      label: t('job'),
      children: character.job,
    },
    {
      key: '8',
      label: t('bank'),
      children: `${formatValue(character.bank)}`,
    },
    {
      key: '9',
      label: t('skin'),
      children: character.skin,
    },
    {
      key: '10',
      label: t('health'),
      children: character.health,
    },
    {
      key: '11',
      label: t('armor'),
      children: character.armor,
    },
    {
      key: '12',
      label: t('usingDrug'),
      children: character.usingDrug,
    },
    {
      key: '13',
      label: t('endDrugEffects'),
      children: character.endDrugEffects,
    },
    {
      key: '14',
      label: t('thresoldDeath'),
      children: character.thresoldDeath,
    },
    {
      key: '15',
      label: t('thresoldDeathReset'),
      children: character.thresoldDeathReset,
    },
    {
      key: '16',
      label: t('staff'),
      children: character.staffName,
    },
    {
      key: '17',
      label: t('staffDutyTime'),
      children: formatValue(character.staffDutyTime),
    },
    {
      key: '18',
      label: t('helpRequestsAnswersQuantity'),
      children: formatValue(character.helpRequestsAnswersQuantity),
    },
    {
      key: '19',
      label: t('faction'),
      children: character.factionName,
    },
    {
      key: '20',
      label: t('rank'),
      children: character.rankName,
    },
    {
      key: t('bankAccount'),
      label: t('bankAccount'),
      children: character.bankAccount,
    },
  ];

  return <Modal open={true} title={`${character.name} - ${formatDateTime(character.currentDate)}`} onCancel={handleCancel} footer={null} width={'70%'} loading={loading}>
    <div style={{ paddingRight: '10px', maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}>
      <Descriptions items={items} />
      <Title level={5}>{t('history')}</Title>
      <Text>{character.history}</Text>
      <Title level={5}>{t('paymentPreview')} ({character.paycheckMultiplier}x)</Title>
      <List
        bordered
        footer={<>{t('total')}: <strong>${formatValue(character.paycheckValue)}</strong></>}
        dataSource={character.paycheckItems}
        style={{ marginBottom: '5px' }}
        renderItem={(item) => (
          <List.Item>
            <Text>{item.description}</Text> <Tag color={item.debit ? 'red' : 'green'}>${formatValue(item.value)}</Tag>
          </List.Item>
        )}
      />
      <Title level={5}>{t('inventory')}</Title>
      <List
        bordered
        dataSource={character.items}
        locale={{ emptyText: 'Personagem não possui itens.' }}
        style={{ marginBottom: '5px' }}
        renderItem={(item) => (
          <List.Item>
            <Text>{t('name')}: <strong>{item.name}</strong> | {t('quantity')}: <strong>{formatValue(item.quantity)}</strong> {item.extra && <> | {t('extra')}: <strong dangerouslySetInnerHTML={{ __html: item.extra }}></strong></>}</Text>
          </List.Item>
        )}
      />
      <Title level={5}>{t('properties')}</Title>
      <List
        bordered
        dataSource={character.properties}
        locale={{ emptyText: 'Personagem não possui propriedades.' }}
        style={{ marginBottom: '5px' }}
        renderItem={(item) => (
          <List.Item>
            <Text>{t('number')}: <strong>{item.number}</strong> | {t('address')}: <strong>{item.address}</strong> | {t('price')}: $<strong>{formatValue(item.price)}</strong> | {t('protectionLevel')}: <strong>{item.protectionLevel}</strong></Text>
          </List.Item>
        )}
      />
      <Title level={5}>{t('vehicles')}</Title>
      <List
        bordered
        dataSource={character.vehicles}
        locale={{ emptyText: 'Personagem não possui veículos.' }}
        style={{ marginBottom: '5px' }}
        renderItem={(item) => (
          <List.Item>
            <Text>{t('model')}: <strong>{item.model.toUpperCase()}</strong> | {t('plate')}: <strong>{item.plate}</strong> | {t('protectionLevel')}: <strong>{item.protectionLevel}</strong> | {t('xmr')}: <strong>{item.xmr ? t('yes') : t('no')}</strong></Text>
          </List.Item>
        )}
      />
      <Title level={5}>{t('companies')}</Title>
      <List
        bordered
        dataSource={character.companies}
        locale={{ emptyText: 'Personagem não possui empresas.' }}
        style={{ marginBottom: '5px' }}
        renderItem={(item) => (
          <List.Item>
            <Text>{t('name')}: <strong>{item.name}</strong> | {t('owner')}: <strong>{item.owner ? t('yes') : t('no')}</strong></Text>
          </List.Item>
        )}
      />
      <Title level={5}>{t('invites')}</Title>
      <List
        bordered
        dataSource={character.invites}
        locale={{ emptyText: 'Personagem não possui convites.' }}
        style={{ marginBottom: '5px' }}
        renderItem={(item) => (
          <List.Item>
            <Text>{t('type')}: <strong>{item.type}</strong> | {t('waitingTime')}: <strong>{item.waitingTime}</strong></Text>
          </List.Item>
        )}
      />
    </div>
  </Modal>
};

export default StatsPage;