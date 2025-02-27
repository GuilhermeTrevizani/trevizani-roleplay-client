import { Alert, Button, Col, Flex, Form, Input, InputNumber, List, Modal, Popconfirm, Row, Select, Table, Tabs, TabsProps, Tag } from 'antd';
import { t } from 'i18next';
import { configureEvent, emitEvent, formatDateTime, formatValue } from '../../services/util';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import EmergencyCall from '../../types/EmergencyCall';
import { ColumnsType } from 'antd/es/table';
import Wanted from '../../types/Wanted';
import PendingReport from '../../types/PendingReport';
import TextArea from 'antd/es/input/TextArea';
import Title from 'antd/es/typography/Title';
import Text from 'antd/es/typography/Text';
import SelectOption from '../../types/SelectOption';

interface MDCCrime {
  id: string;
  name: string;
  prisonMinutes: number;
  fineValue: number;
  driverLicensePoints: number;
};

interface FactionUnit {
  id: string;
  name: string;
  registerDate: Date;
  canClose: boolean;
  characters: string;
  posX: number;
  posY: number;
  status: string;
};

interface MDCProperty {
  formatedAddress: string;
  owner: string;
  value: number;
};

interface MDCVehicle {
  id: string;
  plate: string;
  model: string;
  owner: string;
  seizedValue: number;
  canTrack: boolean;
  bolo?: MDCVehicleBOLO;
  insurance: string;
};

interface MDCVehicleBOLO {
  id: string;
  registerDate: Date;
  policeOfficerCharacter: string;
  reason: string;
};

interface MDCForensicTest {
  registerDate: Date;
  identifier: string;
  policeOfficer: string;
  hasResult: boolean;
  items: string[];
};

interface MDCConfiscationWithoutAttribuition {
  id: string;
  registerDate: Date;
  identifier: string;
  policeOfficer: string;
  characterName: string;
};

interface MDCPerson {
  id: string;
  name: string;
  age: number;
  sex: string;
  job: string;
  driverLicenseText: string;
  driverLicenseColor: string;
  apb?: MDCPersonAPB;
  properties: MDCPersonProperty[];
  vehicles: MDCPersonVehicle[];
  fines: MDCPersonFine[];
  jails: MDCPersonJail[];
  confiscations: MDCPersonConfiscation[];
  weaponLicenseText: string;
  weaponLicenseColor: string;
  canManageWeaponLicense: boolean;
};

interface MDCPersonProperty {
  formatedAddress: number;
}

interface MDCPersonAPB {
  id: string;
  policeOfficerCharacter: string;
  registerDate: Date;
  reason: string;
};

interface MDCPersonVehicle {
  model: string;
  plate: string;
  insurance: string;
}

interface MDCPersonFine {
  registerDate: Date;
  value: number;
  policeOfficerCharacter: string;
  reason: string;
  description?: string;
  payed: boolean;
  driverLicensePoints: number;
}

interface MDCPersonJail {
  registerDate: Date;
  minutes: number;
  policeOfficerCharacter: string;
  description?: string;
  reason: string;
}

interface MDCPersonConfiscation {
  registerDate: Date;
  policeOfficerCharacter: string;
  description?: string;
  identifier: string;
  items: MDCPersonConfiscationItem[];
}

interface MDCPersonConfiscationItem {
  name: string;
  quantity: number;
  extra?: string;
  identifier: string;
};

enum FactionType {
  Police = 1,
  Firefighter = 2,
  Criminal = 3,
  Media = 4,
  Government = 5,
  Judiciary = 6,
  Civil = 7,
};

const MDCPage = () => {
  const [title, setTitle] = useState('');
  const [factionType, setFactionType] = useState<FactionType>();
  const [emergencyCalls, setEmergencyCalls] = useState<EmergencyCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [factionUnits, setFactionUnits] = useState<FactionUnit[]>([]);
  const [factionUnitName, setFactionUnitName] = useState('');
  const [factionUnitPartners, setFactionUnitPartners] = useState('');
  const [apbs, setApbs] = useState<Wanted[]>([]);
  const [bolos, setBolos] = useState<Wanted[]>([]);
  const [pendingReports, setPendingReports] = useState<PendingReport[]>([]);
  const [pendingReportDescription, setPendingReportDescription] = useState('');
  const [pendingReport, setPendingReport] = useState<PendingReport>();
  const [searchPerson, setSearchPerson] = useState('');
  const [person, setPerson] = useState<MDCPerson>();
  const [vehicle, setVehicle] = useState<MDCVehicle>();
  const [property, setProperty] = useState<MDCProperty>();
  const [apbReason, setApbReason] = useState('');
  const [addingApb, setAddingApb] = useState(false);
  const [fine, setFine] = useState(false);
  const [searchVehicle, setSearchVehicle] = useState('');
  const [searchProperty, setSearchProperty] = useState('');
  const [addingBolo, setAddingBolo] = useState(false);
  const [boloReason, setBoloReason] = useState('');
  const [alertModal, setAlertModal] = useState('');
  const [confiscation, setConfiscation] = useState<MDCPersonConfiscation>();
  const [confiscationsWithoutAttribuition, setConfiscationsWithoutAttribuition] = useState<MDCConfiscationWithoutAttribuition[]>([]);
  const [confiscationWithoutAttribuition, setConfiscationWithoutAttribuition] = useState<MDCConfiscationWithoutAttribuition>();
  const [crimes, setCrimes] = useState<MDCCrime[]>([]);
  const [selectedCrimes, setSelectedCrimes] = useState<MDCCrime[]>([]);
  const [arrest, setArrest] = useState(false);
  const [forensicTests, setForensicTests] = useState<MDCForensicTest[]>([]);
  const [forensicTest, setForensicTest] = useState<MDCForensicTest>();
  const [giveWeaponLicense, setGiveWeaponLicense] = useState(false);
  const [weaponLicenseTypes, setWeaponLicenseTypes] = useState<SelectOption[]>([]);
  const [weaponLicenseType, setWeaponLicenseType] = useState(1);

  useEffect(() => {
    // setFactionType(FactionType.Police)
    // setCrimes([{
    //   id: '1',
    //   name: 'Name',
    //   driverLicensePoints: 0,
    //   fineValue: 1,
    //   prisonMinutes: 0,
    // }, {
    //   id: '21',
    //   name: 'Name 2',
    //   driverLicensePoints: 0,
    //   fineValue: 0,
    //   prisonMinutes: 1,
    // }
    // ])
    // setPerson({
    //   age: 16,
    //   confiscations: [{
    //     policeOfficerCharacter: 'COP',
    //     registerDate: new Date(),
    //     description: 'Descrição',
    //     identifier: 'id',
    //     items: [{
    //       name: 'Nome',
    //       quantity: 1,
    //       extra: 'Extra',
    //       identifier: 'eae',
    //     }]
    //   }],
    //   driverLicenseColor: 'green',
    //   driverLicenseText: 'VÁLIDA',
    //   fines: [],
    //   id: '1',
    //   jails: [],
    //   job: 'JOB',
    //   name: 'Name',
    //   properties: [],
    //   sex: 'Sexo',
    //   vehicles: [],
    //   weaponLicenseColor: 'green',
    //   weaponLicenseText: 'POSSUI (PADRÃO) (POR GUILHERME TREVIZANI)',
    //   canManageWeaponLicense: true,
    // })
    // setForensicTests([{
    //   hasResult: false,
    //   identifier: 'Id 1',
    //   items: [],
    //   policeOfficer: 'Police Officer',
    //   registerDate: new Date(),
    // },
    // {
    //   hasResult: true,
    //   identifier: 'Id 2',
    //   items: ['Descrição 1', 'Descrição 2'],
    //   policeOfficer: 'Police Officer 2',
    //   registerDate: new Date(),
    // }])
    // setWeaponLicenseTypes([{
    //   label: 'Padrão',
    //   value: '1',
    // }, {
    //   label: 'LEO',
    //   value: '2',
    // }])
    // setFactionUnits([{
    //   canClose: true,
    //   characters: 'Guilherme Trevizani',
    //   id: '1',
    //   name: '10L10',
    //   registerDate: new Date(),
    //   status: 'Código 6',
    //   posX: 12,
    //   posY: 12,
    // }])
    // setLoading(false)
    configureEvent(Constants.MDC_PAGE_SHOW, (factionType: FactionType, factionName: string, emergencyCallsJson: string, factionUnitsJson: string,
      apbsJson: string, bolosJson: string, pendingReportsJson: string, crimesJson: string, weaponLicenseTypesJson: string) => {
      setTitle(`${t('mobileDataComputer')} - ${factionName}`);
      setEmergencyCalls(JSON.parse(emergencyCallsJson));
      setFactionUnits(JSON.parse(factionUnitsJson));
      setFactionType(factionType);
      setPendingReports(JSON.parse(pendingReportsJson));
      setApbs(JSON.parse(apbsJson));
      setBolos(JSON.parse(bolosJson));
      setPendingReport(null);
      setPendingReportDescription('');
      setCrimes(JSON.parse(crimesJson));
      setWeaponLicenseTypes(JSON.parse(weaponLicenseTypesJson));
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    configureEvent(Constants.MDC_PAGE_UPDATE_FACTION_UNITS, (factionUnitsJson: string) => {
      setFactionUnits(JSON.parse(factionUnitsJson));
      setLoading(false);
    });

    configureEvent(Constants.MDC_PAGE_UPDATE_APBS, (apbsJson: string) => {
      setAddingApb(false);
      setApbs(JSON.parse(apbsJson));
      setLoading(false);
    });

    configureEvent(Constants.MDC_PAGE_UPDATE_BOLOS, (bolosJson: string) => {
      setAddingBolo(false);
      setBolos(JSON.parse(bolosJson));
      setLoading(false);
    });

    configureEvent(Constants.MDC_PAGE_UPDATE_PENDING_REPORTS, (pendingReportsJson: string) => {
      setPendingReport(null);
      setPendingReports(JSON.parse(pendingReportsJson));
      setLoading(false);
    });

    configureEvent(Constants.MDC_PAGE_SEARCH_PERSON, (personJson: string) => {
      setFine(false);
      setArrest(false);
      setGiveWeaponLicense(false);
      setPerson(JSON.parse(personJson));
      setLoading(false);
    });

    configureEvent(Constants.MDC_PAGE_SEARCH_VEHICLE, (vehicleJson: string) => {
      setVehicle(JSON.parse(vehicleJson));
      setLoading(false);
    });

    configureEvent(Constants.MDC_PAGE_SEARCH_PROPERTY, (propertyJson: string) => {
      setProperty(JSON.parse(propertyJson));
      setLoading(false);
    });

    configureEvent(Constants.MDC_PAGE_UPDATE_CONFISCATIONS_WITHOUT_ATTRIBUITION, (confiscationsJson: string) => {
      setConfiscationWithoutAttribuition(undefined);
      setConfiscationsWithoutAttribuition(JSON.parse(confiscationsJson));
      setLoading(false);
    });

    configureEvent(Constants.MDC_PAGE_UPDATE_FORENSIC_LABORATORY, (forensicTestsJson: string) => {
      setForensicTests(JSON.parse(forensicTestsJson));
      setLoading(false);
    });

    emitEvent(Constants.MDC_PAGE_SHOW);
  }, []);

  const handleCancel = () => {
    emitEvent(Constants.MDC_PAGE_CLOSE);
  };

  const trackEmergencyCall = (id: string) => {
    emitEvent(Constants.MDC_PAGE_TRACK_EMERGENCY_CALL, id);
  };

  const closeFactionUnit = (id: string) => {
    setLoading(true);
    emitEvent(Constants.MDC_PAGE_CLOSE_FACTION_UNIT, id);
  };

  const addFactionUnit = () => {
    setLoading(true);
    emitEvent(Constants.MDC_PAGE_ADD_FACTION_UNIT, factionUnitName, factionUnitPartners);
  };

  const fillPendingReport = (pendingReport: PendingReport) => {
    setPendingReport(pendingReport);
  };

  const confirmFillPendingReport = () => {
    setLoading(true);
    emitEvent(Constants.MDC_PAGE_FILL_PENDING_REPORT, pendingReport.type, pendingReport.id, pendingReportDescription);
  };

  const cancelFillPendingReport = () => {
    setPendingReport(null);
    setPendingReportDescription('');
  };

  const confirmSearchPerson = () => {
    setLoading(true);
    emitEvent(Constants.MDC_PAGE_SEARCH_PERSON, searchPerson);
  };

  const confirmSearchVehicle = () => {
    setLoading(true);
    emitEvent(Constants.MDC_PAGE_SEARCH_VEHICLE, searchVehicle);
  };

  const confirmSearchProperty = () => {
    setLoading(true);
    emitEvent(Constants.MDC_PAGE_SEARCH_PROPERTY, searchProperty);
  };

  const revokeDriverLicense = () => {
    setLoading(true);
    emitEvent(Constants.MDC_PAGE_REVOKE_DRIVER_LICENSE, person.id);
  };

  const toFine = () => {
    setSelectedCrimes([]);
    setFine(true);
  };

  const confirmToFine = () => {
    setLoading(true);
    emitEvent(Constants.MDC_PAGE_FINE, person.id, person.name, JSON.stringify(selectedCrimes.map(x => x.id)));
  };

  const cancelToFine = () => {
    setFine(false);
  };

  const toArrest = () => {
    setSelectedCrimes([]);
    setArrest(true);
  };

  const confirmToArrest = () => {
    setLoading(true);
    emitEvent(Constants.MDC_PAGE_ARREST, person.id, JSON.stringify(selectedCrimes.map(x => x.id)));
  };

  const cancelToArrest = () => {
    setArrest(false);
  };

  const addApb = () => {
    setApbReason('');
    setAddingApb(true);
  };

  const confirmAddApb = () => {
    setLoading(true);
    emitEvent(Constants.MDC_PAGE_ADD_APB_BOLO, 1, person.id, apbReason, searchPerson);
  };

  const cancelAddApb = () => {
    setAddingApb(false);
  };

  const removeApb = () => {
    setLoading(true);
    emitEvent(Constants.MDC_PAGE_REMOVE_APB_BOLO, person.apb.id, searchPerson);
  };

  const trackVehicle = () => {
    setLoading(true);
    emitEvent(Constants.MDC_PAGE_TRACK_VEHICLE, vehicle.id);
  };

  const addBolo = () => {
    setBoloReason('');
    setAddingBolo(true);
  };

  const confirmAddBolo = () => {
    setLoading(true);
    emitEvent(Constants.MDC_PAGE_ADD_APB_BOLO, 2, vehicle.id, boloReason, searchVehicle);
  };

  const cancelAddBolo = () => {
    setAddingBolo(false);
  };

  const removeBolo = () => {
    setLoading(true);
    emitEvent(Constants.MDC_PAGE_REMOVE_APB_BOLO, vehicle.bolo.id, searchVehicle);
  };

  const removeWeaponLicense = () => {
    setLoading(true);
    emitEvent(Constants.MDC_PAGE_REMOVE_WEAPON_LICENSE, person.id);
  };

  const confirmGiveWeaponLicense = () => {
    setLoading(true);
    emitEvent(Constants.MDC_PAGE_GIVE_WEAPON_LICENSE, person.id, weaponLicenseType);
  };

  const cancelGiveWeaponLicense = () => {
    setGiveWeaponLicense(false);
  };

  const columnsApbs: ColumnsType<Wanted> = [
    {
      title: t('date'),
      dataIndex: 'registerDate',
      key: 'registerDate',
      render: (registerDate: Date) => formatDateTime(registerDate),
    },
    {
      title: t('policeOfficer'),
      dataIndex: 'policeOfficer',
      key: 'policeOfficer',
    },
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('reason'),
      dataIndex: 'reason',
      key: 'reason',
    },
  ];

  const columnsBolos: ColumnsType<Wanted> = [
    {
      title: t('date'),
      dataIndex: 'registerDate',
      key: 'registerDate',
      render: (registerDate: Date) => formatDateTime(registerDate),
    },
    {
      title: t('policeOfficer'),
      dataIndex: 'policeOfficer',
      key: 'policeOfficer',
    },
    {
      title: t('vehicle'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('reason'),
      dataIndex: 'reason',
      key: 'reason',
    },
  ];

  const columnsEmergencyCalls: ColumnsType<EmergencyCall> = [
    {
      title: t('date'),
      dataIndex: 'registerDate',
      key: 'registerDate',
      render: (registerDate: Date) => formatDateTime(registerDate),
    },
    {
      title: t('number'),
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: t('location'),
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: t('message'),
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (id: string) => <Button size='small' onClick={() => trackEmergencyCall(id)}>{t('track')}</Button>,
    },
  ];

  const trackFactionUnit = (posX: number, posY: number) => {
    emitEvent(Constants.MDC_PAGE_TRACK_UNIT, posX, posY);
  };

  const columnsFactionUnits: ColumnsType<FactionUnit> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('status'),
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: t('start'),
      dataIndex: 'registerDate',
      key: 'registerDate',
      render: (registerDate: Date) => formatDateTime(registerDate),
    },
    {
      title: t('occupants'),
      dataIndex: 'characters',
      key: 'characters',
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (id: string, record: FactionUnit) =>
        <Flex vertical={false} gap='small' justify='center'>
          {record.posX != 0 && record.posY != 0 &&
            <Button size='small' onClick={() => trackFactionUnit(record.posX, record.posY)}>{t('track')}</Button>}
          {record.canClose && <Popconfirm
            title={t('closeUnitTitle')}
            description={t('closeUnitContent')}
            onConfirm={() => closeFactionUnit(id)}
            okText={t('yes')}
            cancelText={t('no')}
          >
            <Button size='small' danger>{t('closeUnit')}</Button>
          </Popconfirm>}
        </Flex>,
    },
  ];

  const columnsPendingReports: ColumnsType<PendingReport> = [
    {
      title: t('date'),
      dataIndex: 'registerDate',
      key: 'registerDate',
      render: (registerDate: Date) => formatDateTime(registerDate),
    },
    {
      title: t('policeOfficer'),
      dataIndex: 'policeOfficer',
      key: 'policeOfficer',
    },
    {
      title: t('description'),
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (_, record: PendingReport) => record.isOwner && <Button size='small' onClick={() => fillPendingReport(record)}>{t('fill')}</Button>,
    },
  ];

  const columnsConfiscationsWithoutAttribuition: ColumnsType<MDCConfiscationWithoutAttribuition> = [
    {
      title: t('date'),
      dataIndex: 'registerDate',
      key: 'registerDate',
      render: (registerDate: Date) => formatDateTime(registerDate),
    },
    {
      title: t('identifier'),
      dataIndex: 'identifier',
      key: 'identifier',
    },
    {
      title: t('policeOfficer'),
      dataIndex: 'policeOfficer',
      key: 'policeOfficer',
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (_, record: MDCConfiscationWithoutAttribuition) => <Button size='small' onClick={() => setConfiscationWithoutAttribuition(record)}>{t('edit')}</Button>,
    },
  ];

  const columnsForensicTests: ColumnsType<MDCForensicTest> = [
    {
      title: t('date'),
      dataIndex: 'registerDate',
      key: 'registerDate',
      render: (registerDate: Date) => formatDateTime(registerDate),
    },
    {
      title: t('identifier'),
      dataIndex: 'identifier',
      key: 'identifier',
    },
    {
      title: t('policeOfficer'),
      dataIndex: 'policeOfficer',
      key: 'policeOfficer',
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (_, record: MDCForensicTest) => record.hasResult ?
        <Button size='small' onClick={() => setForensicTest(record)}>{t('items')}</Button>
        :
        t('waitingResult'),
    },
  ];

  const sumPrisonMinutes = () => {
    return selectedCrimes.map(x => x.prisonMinutes).reduce((partialSum, x) => partialSum + x, 0);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: t('emergencyCalls'),
      children: <Table
        columns={columnsEmergencyCalls}
        dataSource={emergencyCalls}
        pagination={false}
        loading={loading}
      />,
      disabled: factionType !== FactionType.Police && factionType !== FactionType.Firefighter,
    },
    {
      key: '2',
      label: t('units'),
      children:
        <>
          <Row gutter={16}>
            <Col span={10}>
              <Input value={factionUnitName} onChange={(e) => setFactionUnitName(e.target.value)}
                maxLength={25} placeholder={t('name')} />
            </Col>
            <Col span={10}>
              <Input value={factionUnitPartners} onChange={(e) => setFactionUnitPartners(e.target.value)}
                placeholder={t('partners')} />
            </Col>
            <Col span={4}>
              <Button style={{ width: '100%' }} onClick={addFactionUnit}>{t('add')}</Button>
            </Col>
          </Row>
          <Table
            columns={columnsFactionUnits}
            dataSource={factionUnits}
            pagination={false}
            loading={loading}
            style={{ marginTop: '10px' }}
          />
        </>
      ,
      disabled: factionType !== FactionType.Police && factionType !== FactionType.Firefighter,
    },
    {
      key: '3',
      label: t('searchPerson'),
      children: <>
        <Row gutter={16} style={{ marginBottom: '10px' }}>
          <Col span={22}>
            <Input value={searchPerson} onChange={(e) => setSearchPerson(e.target.value)} placeholder={t('searchHere')} />
          </Col>
          <Col span={2}>
            <Button style={{ width: '100%' }} loading={loading} onClick={confirmSearchPerson}>{t('search')}</Button>
          </Col>
        </Row>
        {person && <>
          <Row gutter={16}>
            <Col span={6}>
              <Title level={3}>{person.name}</Title>
            </Col>
            <Col span={18}>
              <Flex vertical={false} gap='small' justify='flex-end'>
                <Button loading={loading} onClick={toFine}>{t('toFine')}</Button>
                <Button loading={loading} onClick={toArrest}>{t('toArrest')}</Button>
                {!person.apb && <Button loading={loading} onClick={addApb}>{t('addApb')}</Button>}
                {person.apb && <Popconfirm
                  title={t('removeApb')}
                  description={t('removeApbContent')}
                  onConfirm={removeApb}
                  okText={t('yes')}
                  cancelText={t('no')}
                >
                  <Button loading={loading}>{t('removeApb')}</Button>
                </Popconfirm>}
              </Flex>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: '5px' }}>
            <Col span={24}>
              {t('age')}: <strong>{person.age} {t('years')}</strong>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: '5px' }}>
            <Col span={24}>
              {t('sex')}: <strong>{person.sex}</strong>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: '5px' }}>
            <Col span={24}>
              {t('job')}: <strong>{person.job}</strong>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: '5px' }}>
            <Col span={24}>
              {t('driverLicense')}: <Tag color={person.driverLicenseColor}>{person.driverLicenseText}</Tag>
              {person.driverLicenseColor === 'green' &&
                <Popconfirm
                  title={t('revokeDriverLicense')}
                  description={t('revokeDriverLicenseContent')}
                  onConfirm={revokeDriverLicense}
                  okText={t('yes')}
                  cancelText={t('no')}
                >
                  <Button size='small' loading={loading} >{t('revokeDriverLicense')}</Button>
                </Popconfirm>}
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: '5px' }}>
            <Col span={24}>
              {t('weaponLicense')}: <Tag color={person.weaponLicenseColor}>{person.weaponLicenseText}</Tag>
              {person.canManageWeaponLicense &&
                <Button size='small' loading={loading} onClick={() => setGiveWeaponLicense(true)}>{t('giveWeaponLicense')}</Button>}
              {person.canManageWeaponLicense && person.weaponLicenseColor === 'green' &&
                <Popconfirm
                  title={t('removeWeaponLicense')}
                  description={t('removeWeaponLicenseContent')}
                  onConfirm={removeWeaponLicense}
                  okText={t('yes')}
                  cancelText={t('no')}
                >
                  <Button size='small' loading={loading} style={{ marginLeft: '5px' }}>{t('removeWeaponLicense')}</Button>
                </Popconfirm>}
            </Col>
          </Row>
          {person.apb && <Alert style={{ marginTop: '10px' }}
            message={<><strong>{t('apbCreatedBy')} {person.apb.policeOfficerCharacter} em {formatDateTime(person.apb.registerDate)}</strong><br />{person.apb.reason}</>} type="error" />}
          {person.properties.length > 0 && <>
            <Title level={5}>{t('properties')}</Title>
            <List
              bordered
              dataSource={person.properties}
              renderItem={(item) => (
                <List.Item>
                  <Text>{item.formatedAddress}</Text>
                </List.Item>
              )}
            />
          </>}
          {person.vehicles.length > 0 && <>
            <Title level={5}>{t('vehicles')}</Title>
            <List
              bordered
              dataSource={person.vehicles}
              renderItem={(item) => (
                <List.Item>
                  <Text>{t('model')}: <strong>{item.model}</strong> {t('plate')}: <strong>{item.plate}</strong> {t('insurance')}: <strong>{item.insurance}</strong></Text>
                </List.Item>
              )}
            />
          </>}
          {person.fines.length > 0 && <>
            <Title level={5}>{t('fines')}</Title>
            <List
              bordered
              dataSource={person.fines}
              renderItem={(item) => (
                <List.Item>
                  <Text>{t('date')}: <strong>{formatDateTime(item.registerDate)}</strong> {t('value')}: <strong>${formatValue(item.value)}</strong> {t('policeOfficer')}: <strong>{item.policeOfficerCharacter}</strong> {t('driverLicensePoints')}: <strong>{item.driverLicensePoints}</strong> {t('reason')}: <strong>{item.reason}</strong> <Tag color={item.payed ? 'green' : 'red'}>{t(item.payed ? 'payed' : 'noPayed')}</Tag> {item.description && <Button size='small' onClick={() => setAlertModal(item.description)}>{t('report')}</Button>}</Text>
                </List.Item>
              )}
            />
          </>}
          {person.jails.length > 0 && <>
            <Title level={5}>{t('jails')}</Title>
            <List
              bordered
              dataSource={person.jails}
              renderItem={(item) => (
                <List.Item>
                  <Text>{t('date')}: <strong>{formatDateTime(item.registerDate)}</strong> {t('minutes')}: <strong>{formatValue(item.minutes)}</strong> {t('policeOfficer')}: <strong>{item.policeOfficerCharacter}</strong> {t('reason')}: <strong>{item.reason}</strong> {item.description && <Button size='small' onClick={() => setAlertModal(item.description)}>{t('report')}</Button>}</Text>
                </List.Item>
              )}
            />
          </>}
          {person.confiscations.length > 0 && <>
            <Title level={5}>{t('confiscations')}</Title>
            <List
              bordered
              dataSource={person.confiscations}
              renderItem={(item) => (
                <List.Item>
                  <Text>{t('date')}: <strong>{formatDateTime(item.registerDate)}</strong> {t('policeOfficer')}: <strong>{item.policeOfficerCharacter}</strong> {t('identifier')}: <strong>{item.identifier}</strong> <Button size='small' onClick={() => setConfiscation(item)}>{t('items')}</Button> {item.description && <Button size='small' onClick={() => setAlertModal(item.description)}>{t('report')}</Button>}</Text>
                </List.Item>
              )}
            />
          </>}
        </>}
      </>,
      disabled: factionType !== FactionType.Police,
    },
    {
      key: '4',
      label: t('searchVehicle'),
      children: <>
        <Row gutter={16} style={{ marginBottom: '10px' }}>
          <Col span={22}>
            <Input value={searchVehicle} onChange={(e) => setSearchVehicle(e.target.value)} placeholder={t('searchHere')} />
          </Col>
          <Col span={2}>
            <Button style={{ width: '100%' }} loading={loading} onClick={confirmSearchVehicle}>{t('search')}</Button>
          </Col>
        </Row>
        {vehicle && <>
          <Row gutter={16}>
            <Col span={6}>
              <Title level={3}>{vehicle.plate}</Title>
            </Col>
            <Col span={18}>
              <Flex vertical={false} gap='small' justify='flex-end'>
                {vehicle.canTrack && <Button loading={loading} onClick={trackVehicle}>{t('track')}</Button>}
                {!vehicle.bolo && <Button loading={loading} onClick={addBolo}>{t('addBolo')}</Button>}
                {vehicle.bolo && <Popconfirm
                  title={t('removeBolo')}
                  description={t('removeBoloContent')}
                  onConfirm={removeBolo}
                  okText={t('yes')}
                  cancelText={t('no')}
                >
                  <Button loading={loading}>{t('removeBolo')}</Button>
                </Popconfirm>}
              </Flex>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              {t('model')}: <strong>{vehicle.model}</strong>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              {t('owner')}: <strong>{vehicle.owner}</strong>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              {t('seized')}: <strong>{vehicle.seizedValue > 0 ? `${t('yes')} ($${formatValue(vehicle.seizedValue)})` : t('no')}</strong>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              {t('insurance')}: <strong>{vehicle.insurance}</strong>
            </Col>
          </Row>
          {vehicle.bolo && <Alert style={{ marginTop: '10px' }}
            message={<><strong>{t('boloCreatedBy')} {vehicle.bolo.policeOfficerCharacter} em {formatDateTime(vehicle.bolo.registerDate)}</strong><br />{vehicle.bolo.reason}</>} type="error" />}
        </>}
      </>,
      disabled: factionType !== FactionType.Police,
    },
    {
      key: '5',
      label: t('searchProperty'),
      children: <>
        <Row gutter={16} style={{ marginBottom: '10px' }}>
          <Col span={22}>
            <Input value={searchProperty} onChange={(e) => setSearchProperty(e.target.value)} placeholder={t('searchHere')} />
          </Col>
          <Col span={2}>
            <Button style={{ width: '100%' }} loading={loading} onClick={confirmSearchProperty}>{t('search')}</Button>
          </Col>
        </Row>
        {property && <>
          <Row gutter={16}>
            <Col span={24}>
              <Title level={3}>{property.formatedAddress}</Title>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              {t('owner')}: <strong>{property.owner}</strong>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              {t('value')}: <strong>${formatValue(property.value)}</strong>
            </Col>
          </Row>
        </>}
      </>,
      disabled: factionType !== FactionType.Police,
    },
    {
      key: '6',
      label: t('apb'),
      children: <Table
        columns={columnsApbs}
        dataSource={apbs}
        pagination={false}
        loading={loading}
      />,
      disabled: factionType !== FactionType.Police,
    },
    {
      key: '7',
      label: t('bolo'),
      children: <Table
        columns={columnsBolos}
        dataSource={bolos}
        pagination={false}
        loading={loading}
      />,
      disabled: factionType !== FactionType.Police,
    },
    {
      key: '8',
      label: t('pendingReports'),
      children: <Table
        columns={columnsPendingReports}
        dataSource={pendingReports}
        pagination={false}
        loading={loading}
      />,
      disabled: factionType !== FactionType.Police && factionType !== FactionType.Government,
    },
    {
      key: t('confiscationsWithoutAttribuition'),
      label: t('confiscationsWithoutAttribuition'),
      children: <Table
        columns={columnsConfiscationsWithoutAttribuition}
        dataSource={confiscationsWithoutAttribuition}
        pagination={false}
        loading={loading}
      />,
      disabled: factionType !== FactionType.Police,
    },
    {
      key: t('forensicLaboratory'),
      label: t('forensicLaboratory'),
      children: <Table
        columns={columnsForensicTests}
        dataSource={forensicTests}
        pagination={false}
        loading={loading}
      />,
      disabled: factionType !== FactionType.Police,
    },
  ];

  const onTabChange = (tab: string) => {
    if (tab === t('confiscationsWithoutAttribuition')) {
      setLoading(true);
      emitEvent(Constants.MDC_PAGE_UPDATE_CONFISCATIONS_WITHOUT_ATTRIBUITION);
    } else if (tab === t('forensicLaboratory')) {
      setLoading(true);
      emitEvent(Constants.MDC_PAGE_UPDATE_FORENSIC_LABORATORY);
    }
  };

  return <Modal open={true} title={title} onCancel={handleCancel} footer={null} width={'90%'}>
    <Tabs defaultActiveKey="1" items={items} onChange={onTabChange} />

    <Modal open={!!pendingReport} title={pendingReport?.description} onCancel={cancelFillPendingReport}
      onOk={confirmFillPendingReport}
      cancelText={t('close')} okText={t('save')}
      confirmLoading={loading} width={'50%'}>
      <TextArea value={pendingReportDescription} onChange={(e) => setPendingReportDescription(e.target.value)} rows={15} />
    </Modal>

    <Modal open={fine} title={t('toFine')} onCancel={cancelToFine}
      onOk={confirmToFine}
      cancelText={t('close')} okText={t('toFine')}
      confirmLoading={loading} width={'50%'}>
      <Form layout='vertical'>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('crimes')}>
              <Select mode='multiple'
                options={crimes.filter(x => x.fineValue > 0).map(x => ({ value: x.id, label: x.name }))}
                value={selectedCrimes.map(x => x.id)}
                onChange={(value: string[]) => setSelectedCrimes(crimes.filter(x => value.includes(x.id)))}
                optionFilterProp='label' />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>

    <Modal open={addingApb} title={t('addApb')} onCancel={cancelAddApb}
      onOk={confirmAddApb}
      cancelText={t('close')} okText={t('add')}
      confirmLoading={loading} width={'50%'}>
      <TextArea value={apbReason} onChange={(e) => setApbReason(e.target.value)} rows={15} />
    </Modal>

    <Modal open={addingBolo} title={t('addBolo')} onCancel={cancelAddBolo}
      onOk={confirmAddBolo}
      cancelText={t('close')} okText={t('add')}
      confirmLoading={loading} width={'50%'}>
      <TextArea value={boloReason} onChange={(e) => setBoloReason(e.target.value)} rows={15} />
    </Modal>

    <Modal open={!!alertModal} title={t('report')} onCancel={() => setAlertModal('')} footer={null} width={'50%'}>{alertModal}</Modal>

    <Modal open={!!confiscation} title={t('items')} onCancel={() => setConfiscation(null)} footer={null} width={'50%'}>
      {
        confiscation?.items.map(item => {
          return (
            <>{t('name')}: <strong>{item.name}</strong> {t('quantity')}: <strong>{formatValue(item.quantity)}</strong> {item.extra && <>{t('extra')}: <strong>{item.extra}</strong></>} {item.identifier && <>{t('identifier')}: <strong>{item.identifier}</strong></>} <br /></>
          )
        })
      }
    </Modal>

    {confiscationWithoutAttribuition && <Modal open={true} title={t('confiscation')}
      onCancel={() => setConfiscationWithoutAttribuition(undefined)}
      onOk={() => {
        setLoading(true);
        emitEvent(Constants.MDC_PAGE_SAVE_CONFISCATION,
          confiscationWithoutAttribuition.id,
          confiscationWithoutAttribuition.identifier,
          confiscationWithoutAttribuition.characterName
        );
      }}
      cancelText={t('close')} okText={t('save')}
      confirmLoading={loading}>
      <Form layout='vertical'>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('identifier')}>
              <Input value={confiscationWithoutAttribuition.identifier}
                onChange={(e) => setConfiscationWithoutAttribuition({ ...confiscationWithoutAttribuition, identifier: e.target.value })} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('characterName')}>
              <Input value={confiscationWithoutAttribuition.characterName}
                onChange={(e) => setConfiscationWithoutAttribuition({ ...confiscationWithoutAttribuition, characterName: e.target.value })} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>}

    {arrest && <Modal open={true} title={t('toArrest')} onCancel={cancelToArrest}
      onOk={confirmToArrest}
      cancelText={t('close')} okText={t('toArrest')}
      confirmLoading={loading} width={'50%'}>
      <Form layout='vertical'>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('crimes')}>
              <Select mode='multiple'
                options={crimes.filter(x => x.prisonMinutes > 0).map(x => ({ value: x.id, label: x.name }))}
                value={selectedCrimes.map(x => x.id)}
                onChange={(value: string[]) => setSelectedCrimes(crimes.filter(x => value.includes(x.id)))}
                optionFilterProp='label' />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('prisonMinutes')}>
              <InputNumber readOnly value={sumPrisonMinutes()} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>}

    {forensicTest && <Modal open={true} title={`${t('result')} (${forensicTest.identifier})`}
      onCancel={() => setForensicTest(null)} footer={null} width={'50%'}>
      {
        forensicTest.items.map(item => {
          return (
            <h5>{item}</h5>
          )
        })
      }
    </Modal>}

    {giveWeaponLicense && <Modal open={true} title={t('giveWeaponLicense')}
      onCancel={cancelGiveWeaponLicense}
      onOk={confirmGiveWeaponLicense}
      cancelText={t('close')} okText={t('save')}
      confirmLoading={loading}>
      <Form layout='vertical'>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={t('type')}>
              <Select options={weaponLicenseTypes}
                value={weaponLicenseType.toString()} onChange={(value) => setWeaponLicenseType(Number(value))} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>}
  </Modal>
};

export default MDCPage;