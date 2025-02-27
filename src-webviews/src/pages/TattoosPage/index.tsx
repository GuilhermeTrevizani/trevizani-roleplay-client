import { useEffect, useState } from 'react';
import '../VehicleTuningPage/style.scss';
import { configureEvent, emitEvent } from '../../services/util';
import { Constants } from '../../../../src/base/constants';
import { t } from 'i18next';
import { CharacterSex } from '../../types/CharacterSex';
import { tattoos } from './list';
import Tattoo from '../../types/Tattoo';
import { Col, Row, Select, Tag } from 'antd';
import Text from 'antd/es/typography/Text';
import SelectOption from '../../types/SelectOption';

interface SelectedTattoo {
  collection: string;
  overlay: string;
};

const TattoosPage = () => {
  const zones: SelectOption[] = [
    {
      value: 'ZONE_HEAD',
      label: t('head'),
    },
    {
      value: 'ZONE_TORSO',
      label: t('torso'),
    },
    {
      value: 'ZONE_LEFT_ARM',
      label: t('leftArm'),
    },
    {
      value: 'ZONE_RIGHT_ARM',
      label: t('rightArm'),
    },
    {
      value: 'ZONE_LEFT_LEG',
      label: t('leftLeg'),
    },
    {
      value: 'ZONE_RIGHT_LEG',
      label: t('rightLeg'),
    },
  ];

  const [sex, setSex] = useState<CharacterSex>();
  const [studio, setStudio] = useState(false);
  const [zone, setZone] = useState<SelectOption>(zones[0]);
  const [zoneTattoos, setZoneTattoos] = useState<Tattoo[]>([]);
  const [selectedTattoos, setSelectedTattoos] = useState<SelectedTattoo[]>([]);

  useEffect(() => {
    configureEvent(Constants.TATTOOS_PAGE_SHOW, (sex: CharacterSex, studio: boolean, selectedTattoosJson: string) => {
      setSex(sex);
      setStudio(studio);
      setSelectedTattoos(JSON.parse(selectedTattoosJson));
    });

    emitEvent(Constants.TATTOOS_PAGE_SHOW);
  }, []);

  const getSelectedTatto = (tattoo: Tattoo) => {
    return selectedTattoos.findIndex(x => x.collection === tattoo.collection && x.overlay === (sex === CharacterSex.Man ? tattoo.male : tattoo.female));
  };

  const toggleTattoo = (tattoo: Tattoo) => {
    const index = getSelectedTatto(tattoo);
    if (index === -1) {
      setSelectedTattoos(old => [...old, {
        collection: tattoo.collection,
        overlay: sex === CharacterSex.Man ? tattoo.male : tattoo.female,
      }]);
      return;
    }

    setSelectedTattoos(old => old.filter((_, i) => i !== index));
  };

  const cancel = () => {
    emitEvent(Constants.TATTOOS_PAGE_CLOSE);
  };

  const confirm = () => {
    emitEvent(Constants.TATTOOS_PAGE_CONFIRM, JSON.stringify(selectedTattoos));
  };

  const removeAll = () => {
    setSelectedTattoos([]);
  };

  useEffect(() => {
    if (sex == CharacterSex.Woman)
      setZoneTattoos(tattoos.filter(x => x.zone == zone.value && x.female));
    else
      setZoneTattoos(tattoos.filter(x => x.zone == zone.value && x.male));
  }, [zone, sex]);

  useEffect(() => {
    emitEvent(Constants.TATTOOS_PAGE_SYNC, JSON.stringify(selectedTattoos));
  }, [selectedTattoos]);

  return <div className="tuningPage">
    <div className="editor">
      <Select value={zone.value} options={zones} onChange={(value: string) => setZone(zones.find(x => x.value === value))} />

      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '5px', padding: '5px', textAlign: 'center',
        maxHeight: '75vh', overflowY: 'auto', justifyContent: 'center', alignItems: 'center'
      }}>
        {zoneTattoos.map((tattoo, index) => {
          return (
            <div key={index} onClick={() => toggleTattoo(tattoo)}
              style={{
                width: '35px', height: '35px',
                backgroundColor: getSelectedTatto(tattoo) !== -1 ? '#f279b2' : '#666666',
                color: 'white', fontSize: '20px',
                cursor: 'pointer'
              }}>
              {index + 1}
            </div>
          )
        })}
      </div>

      <button onClick={removeAll} className="danger" style={{ marginTop: '15px' }}>{t('removeAll')}</button>

      <div className="navigation bottom">
        {studio && <button onClick={cancel} className="danger">{t('cancel')}</button>}
        <button onClick={confirm} style={{ gridColumn: studio ? '' : 'span 2' }}>{t('confirm')}</button>
      </div>
    </div>
    <div className="commands">
      <Row gutter={16}>
        <Col span={4}><Tag>{t('w')}</Tag></Col>
        <Col span={20} style={{ textAlign: 'right' }}><Text>{t('up')}</Text></Col>
      </Row>
      <Row gutter={16}>
        <Col span={4}><Tag>{t('s')}</Tag></Col>
        <Col span={20} style={{ textAlign: 'right' }}><Text>{t('down')}</Text></Col>
      </Row>
      <Row gutter={16}>
        <Col span={4}><Tag>{t('a')}</Tag></Col>
        <Col span={20} style={{ textAlign: 'right' }}><Text>{t('rotateLeft')}</Text></Col>
      </Row>
      <Row gutter={16}>
        <Col span={4}><Tag>{t('d')}</Tag></Col>
        <Col span={20} style={{ textAlign: 'right' }}><Text>{t('rotateRight')}</Text></Col>
      </Row>
      <Row gutter={16}>
        <Col span={4}><Tag>{t('alt')}</Tag></Col>
        <Col span={20} style={{ textAlign: 'right' }}><Text>{t('animation')}</Text></Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}><Tag>{t('mouseScroll')}</Tag></Col>
        <Col span={12} style={{ textAlign: 'right' }}><Text>{t('zoom')}</Text></Col>
      </Row>
    </div>
  </div>
};

export default TattoosPage;