import { useEffect, useState } from 'react';
import '../VehicleTuningPage/style.scss';
import { configureEvent, emitEvent } from '../../services/util';
import { Constants } from '../../../../src/base/constants';
import { t } from 'i18next';
import { CharacterSex } from '../../types/CharacterSex';
import clothes1Male from '../../../json/clothes1male.json' assert { type: 'json' };
import clothes1Female from '../../../json/clothes1female.json' assert { type: 'json' };
import clothes3Male from '../../../json/clothes3male.json' assert { type: 'json' };
import clothes3Female from '../../../json/clothes3female.json' assert { type: 'json' };
import clothes4Male from '../../../json/clothes4male.json' assert { type: 'json' };
import clothes4Female from '../../../json/clothes4female.json' assert { type: 'json' };
import clothes5Male from '../../../json/clothes5male.json' assert { type: 'json' };
import clothes5Female from '../../../json/clothes5female.json' assert { type: 'json' };
import clothes6Male from '../../../json/clothes6male.json' assert { type: 'json' };
import clothes6Female from '../../../json/clothes6female.json' assert { type: 'json' };
import clothes7Male from '../../../json/clothes7male.json' assert { type: 'json' };
import clothes7Female from '../../../json/clothes7female.json' assert { type: 'json' };
import clothes8Male from '../../../json/clothes8male.json' assert { type: 'json' };
import clothes8Female from '../../../json/clothes8female.json' assert { type: 'json' };
import clothes9Male from '../../../json/clothes9male.json' assert { type: 'json' };
import clothes9Female from '../../../json/clothes9female.json' assert { type: 'json' };
import clothes10Male from '../../../json/clothes10male.json' assert { type: 'json' };
import clothes10Female from '../../../json/clothes10female.json' assert { type: 'json' };
import clothes11Male from '../../../json/clothes11male.json' assert { type: 'json' };
import clothes11Female from '../../../json/clothes11female.json' assert { type: 'json' };
import accessories0Male from '../../../json/accessories0male.json' assert { type: 'json' };
import accessories0Female from '../../../json/accessories0female.json' assert { type: 'json' };
import accessories1Male from '../../../json/accessories1male.json' assert { type: 'json' };
import accessories1Female from '../../../json/accessories1female.json' assert { type: 'json' };
import accessories2Male from '../../../json/accessories2male.json' assert { type: 'json' };
import accessories2Female from '../../../json/accessories2female.json' assert { type: 'json' };
import accessories6Male from '../../../json/accessories6male.json' assert { type: 'json' };
import accessories6Female from '../../../json/accessories6female.json' assert { type: 'json' };
import accessories7Male from '../../../json/accessories7male.json' assert { type: 'json' };
import accessories7Female from '../../../json/accessories7female.json' assert { type: 'json' };
import Cloth from '../../types/Cloth';
import Outfit, { ClothAccessory } from '../../types/Outfit';
import { Col, Row, Select, Tag } from 'antd';
import Text from 'antd/es/typography/Text';
import SelectOption from '../../types/SelectOption';

const ClothesPage = () => {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(0);
  const [factionType, setFactionType] = useState(0);
  const [outfit, setOutfit] = useState(1);
  const [maxOutfit, setMaxOutfit] = useState(2);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [currentOutfit, setCurrentOutfit] = useState<Outfit>();
  const [clothes1, setClothes1] = useState<Cloth[]>([]);
  const [clothes3, setClothes3] = useState<Cloth[]>([]);
  const [clothes4, setClothes4] = useState<Cloth[]>([]);
  const [clothes5, setClothes5] = useState<Cloth[]>([]);
  const [clothes6, setClothes6] = useState<Cloth[]>([]);
  const [clothes7, setClothes7] = useState<Cloth[]>([]);
  const [clothes8, setClothes8] = useState<Cloth[]>([]);
  const [clothes9, setClothes9] = useState<Cloth[]>([]);
  const [clothes10, setClothes10] = useState<Cloth[]>([]);
  const [clothes11, setClothes11] = useState<Cloth[]>([]);
  const [accessories0, setAccessories0] = useState<Cloth[]>([]);
  const [accessories1, setAccessories1] = useState<Cloth[]>([]);
  const [accessories2, setAccessories2] = useState<Cloth[]>([]);
  const [accessories6, setAccessories6] = useState<Cloth[]>([]);
  const [accessories7, setAccessories7] = useState<Cloth[]>([]);

  const components: SelectOption[] = [
    { value: 'cloth10', label: t('embroidery') },
    { value: 'accessory7', label: t('bracelet') },
    { value: 'cloth4', label: t('pants') },
    { value: 'cloth8', label: t('shirt') },
    { value: 'accessory0', label: t('hat') },
    { value: 'cloth9', label: t('armor') },
    { value: 'cloth7', label: t('extra') },
    { value: 'cloth11', label: t('jacket') },
    { value: 'cloth1', label: t('mask') },
    { value: 'cloth5', label: t('backpack') },
    { value: 'accessory1', label: t('glasses') },
    { value: 'accessory2', label: t('ear') },
    { value: 'accessory6', label: t('watch') },
    { value: 'cloth6', label: t('shoes') },
    { value: 'cloth3', label: t('torso') },
  ];

  const [currentComponent, setCurrentComponent] = useState<SelectOption>(components[0]);

  useEffect(() => {
    // const isPremium = false;
    // const sex = CharacterSex.Woman;
    // const outfit = 1;
    // const maxOutfit = 1;
    // const outfits: Outfit[] = [{
    //   accessory0: { drawable: 0, texture: 0, using: true },
    //   accessory1: { drawable: 0, texture: 0, using: true },
    //   accessory2: { drawable: 0, texture: 0, using: true },
    //   accessory6: { drawable: 0, texture: 0, using: true },
    //   accessory7: { drawable: 0, texture: 0, using: true },
    //   cloth1: { drawable: 0, texture: 0, using: true },
    //   cloth3: { drawable: 0, texture: 0, using: true },
    //   cloth4: { drawable: 0, texture: 0, using: true },
    //   cloth5: { drawable: 0, texture: 0, using: true },
    //   cloth6: { drawable: 0, texture: 0, using: true },
    //   cloth7: { drawable: 0, texture: 0, using: true },
    //   cloth8: { drawable: 0, texture: 0, using: true },
    //   cloth9: { drawable: 0, texture: 0, using: true },
    //   cloth10: { drawable: 0, texture: 0, using: true },
    //   cloth11: { drawable: 0, texture: 0, using: true },
    //   slot: 1,
    // }];
    // setClothes1(filterClothes(isPremium, (sex === CharacterSex.Woman ? clothes1Female : clothes1Male) as Cloth[]));
    // setClothes3(filterClothes(isPremium, (sex === CharacterSex.Woman ? clothes3Female : clothes3Male) as Cloth[]));
    // setClothes4(filterClothes(isPremium, (sex === CharacterSex.Woman ? clothes4Female : clothes4Male) as Cloth[]));
    // setClothes5(filterClothes(isPremium, (sex === CharacterSex.Woman ? clothes5Female : clothes5Male) as Cloth[]));
    // setClothes6(filterClothes(isPremium, (sex === CharacterSex.Woman ? clothes6Female : clothes6Male) as Cloth[]));
    // setClothes7(filterClothes(isPremium, (sex === CharacterSex.Woman ? clothes7Female : clothes7Male) as Cloth[]));
    // setClothes8(filterClothes(isPremium, (sex === CharacterSex.Woman ? clothes8Female : clothes8Male) as Cloth[]));
    // setClothes9(filterClothes(isPremium, (sex === CharacterSex.Woman ? clothes9Female : clothes9Male) as Cloth[]));
    // setClothes10(filterClothes(isPremium, (sex === CharacterSex.Woman ? clothes10Female : clothes10Male) as Cloth[]));
    // setClothes11(filterClothes(isPremium, (sex === CharacterSex.Woman ? clothes11Female : clothes11Male) as Cloth[]));
    // setAccessories0(filterClothes(isPremium, (sex === CharacterSex.Woman ? accessories0Female : accessories0Male) as Cloth[]));
    // setAccessories1(filterClothes(isPremium, (sex === CharacterSex.Woman ? accessories1Female : accessories1Male) as Cloth[]));
    // setAccessories2(filterClothes(isPremium, (sex === CharacterSex.Woman ? accessories2Female : accessories2Male) as Cloth[]));
    // setAccessories6(filterClothes(isPremium, (sex === CharacterSex.Woman ? accessories6Female : accessories6Male) as Cloth[]));
    // setAccessories7(filterClothes(isPremium, (sex === CharacterSex.Woman ? accessories7Female : accessories7Male) as Cloth[]));
    // setOutfit(outfit);
    // setMaxOutfit(maxOutfit);
    // setOutfits(outfits);
    // setType(type);
    // setFactionType(factionType);
    // setCurrentOutfit(outfits.find(x => x.slot === outfit));
    configureEvent(Constants.CLOTHES_PAGE_SHOW, (outfit: number, maxOutfit: number, outfitsJson: string, type: number,
      sex: CharacterSex, factionType: number, isPremium: boolean) => {
      setClothes1(filterClothes(isPremium, (sex === CharacterSex.Woman ? clothes1Female : clothes1Male) as Cloth[]));
      setClothes3(filterClothes(isPremium, (sex === CharacterSex.Woman ? clothes3Female : clothes3Male) as Cloth[]));
      setClothes4(filterClothes(isPremium, (sex === CharacterSex.Woman ? clothes4Female : clothes4Male) as Cloth[]));
      setClothes5(filterClothes(isPremium, (sex === CharacterSex.Woman ? clothes5Female : clothes5Male) as Cloth[]));
      setClothes6(filterClothes(isPremium, (sex === CharacterSex.Woman ? clothes6Female : clothes6Male) as Cloth[]));
      setClothes7(filterClothes(isPremium, (sex === CharacterSex.Woman ? clothes7Female : clothes7Male) as Cloth[]));
      setClothes8(filterClothes(isPremium, (sex === CharacterSex.Woman ? clothes8Female : clothes8Male) as Cloth[]));
      setClothes9(filterClothes(isPremium, (sex === CharacterSex.Woman ? clothes9Female : clothes9Male) as Cloth[]));
      setClothes10(filterClothes(isPremium, (sex === CharacterSex.Woman ? clothes10Female : clothes10Male) as Cloth[]));
      setClothes11(filterClothes(isPremium, (sex === CharacterSex.Woman ? clothes11Female : clothes11Male) as Cloth[]));
      setAccessories0(filterClothes(isPremium, (sex === CharacterSex.Woman ? accessories0Female : accessories0Male) as Cloth[]));
      setAccessories1(filterClothes(isPremium, (sex === CharacterSex.Woman ? accessories1Female : accessories1Male) as Cloth[]));
      setAccessories2(filterClothes(isPremium, (sex === CharacterSex.Woman ? accessories2Female : accessories2Male) as Cloth[]));
      setAccessories6(filterClothes(isPremium, (sex === CharacterSex.Woman ? accessories6Female : accessories6Male) as Cloth[]));
      setAccessories7(filterClothes(isPremium, (sex === CharacterSex.Woman ? accessories7Female : accessories7Male) as Cloth[]));
      const outfits = JSON.parse(outfitsJson);
      setOutfit(outfit);
      setMaxOutfit(maxOutfit);
      setOutfits(outfits);
      setType(type);
      setFactionType(factionType);
      setCurrentOutfit(outfits.find(x => x.slot === outfit));
    });

    emitEvent(Constants.CLOTHES_PAGE_SHOW);
  }, []);

  const cancel = () => {
    setLoading(true);
    emitEvent(Constants.CLOTHES_PAGE_CLOSE);
  };

  const confirm = () => {
    setLoading(true);
    emitEvent(Constants.CLOTHES_PAGE_CONFIRM, outfit, JSON.stringify(outfits));
  };

  const filterClothes = (isPremium: boolean, newClothes: Cloth[]) => {
    return newClothes.filter(x => (!x.onlyPremium || isPremium) && (x.factionType === 0
      || x.factionType === factionType
      || (x.factionType === -2 && (factionType == 1 || factionType == 2)))) as Cloth[];
  };

  const changeOutfitNumber = (newValue: number) => {
    if (newValue < 1)
      newValue = maxOutfit;
    else if (newValue > maxOutfit)
      newValue = 1;

    setOutfit(newValue);
    setCurrentOutfit(outfits.find(x => x.slot === newValue));
  };

  useEffect(() => {
    if (!currentOutfit)
      return;

    emitEvent(Constants.CLOTHES_PAGE_SET_CLOTHES, 1, currentOutfit.cloth1.drawable, currentOutfit.cloth1.texture, currentOutfit.cloth1.dlc);
    emitEvent(Constants.CLOTHES_PAGE_SET_CLOTHES, 3, currentOutfit.cloth3.drawable, currentOutfit.cloth3.texture, currentOutfit.cloth3.dlc);
    emitEvent(Constants.CLOTHES_PAGE_SET_CLOTHES, 4, currentOutfit.cloth4.drawable, currentOutfit.cloth4.texture, currentOutfit.cloth4.dlc);
    emitEvent(Constants.CLOTHES_PAGE_SET_CLOTHES, 5, currentOutfit.cloth5.drawable, currentOutfit.cloth5.texture, currentOutfit.cloth5.dlc);
    emitEvent(Constants.CLOTHES_PAGE_SET_CLOTHES, 6, currentOutfit.cloth6.drawable, currentOutfit.cloth6.texture, currentOutfit.cloth6.dlc);
    emitEvent(Constants.CLOTHES_PAGE_SET_CLOTHES, 7, currentOutfit.cloth7.drawable, currentOutfit.cloth7.texture, currentOutfit.cloth7.dlc);
    emitEvent(Constants.CLOTHES_PAGE_SET_CLOTHES, 8, currentOutfit.cloth8.drawable, currentOutfit.cloth8.texture, currentOutfit.cloth8.dlc);
    emitEvent(Constants.CLOTHES_PAGE_SET_CLOTHES, 9, currentOutfit.cloth9.drawable, currentOutfit.cloth9.texture, currentOutfit.cloth9.dlc);
    emitEvent(Constants.CLOTHES_PAGE_SET_CLOTHES, 10, currentOutfit.cloth10.drawable, currentOutfit.cloth10.texture, currentOutfit.cloth10.dlc);
    emitEvent(Constants.CLOTHES_PAGE_SET_CLOTHES, 11, currentOutfit.cloth11.drawable, currentOutfit.cloth11.texture, currentOutfit.cloth11.dlc);
    emitEvent(Constants.CLOTHES_PAGE_SET_PROPS, 0, currentOutfit.accessory0.drawable, currentOutfit.accessory0.texture, currentOutfit.accessory0.dlc);
    emitEvent(Constants.CLOTHES_PAGE_SET_PROPS, 1, currentOutfit.accessory1.drawable, currentOutfit.accessory1.texture, currentOutfit.accessory1.dlc);
    emitEvent(Constants.CLOTHES_PAGE_SET_PROPS, 2, currentOutfit.accessory2.drawable, currentOutfit.accessory2.texture, currentOutfit.accessory2.dlc);
    emitEvent(Constants.CLOTHES_PAGE_SET_PROPS, 6, currentOutfit.accessory6.drawable, currentOutfit.accessory6.texture, currentOutfit.accessory6.dlc);
    emitEvent(Constants.CLOTHES_PAGE_SET_PROPS, 7, currentOutfit.accessory7.drawable, currentOutfit.accessory7.texture, currentOutfit.accessory7.dlc);

    const newList = [...outfits];
    newList[outfit - 1] = currentOutfit;
    setOutfits(newList);
  }, [currentOutfit]);

  const clothesMap: { [key: string]: Cloth[] } = {
    cloth1: clothes1,
    cloth3: clothes3,
    cloth4: clothes4,
    cloth5: clothes5,
    cloth6: clothes6,
    cloth7: clothes7,
    cloth8: clothes8,
    cloth9: clothes9,
    cloth10: clothes10,
    cloth11: clothes11,
    accessory0: accessories0,
    accessory1: accessories1,
    accessory2: accessories2,
    accessory6: accessories6,
    accessory7: accessories7
  };

  const getClothes = (type: string) => {
    return clothesMap[type] || [];
  };

  const getMaxDrawable = (type: string) => {
    return getClothes(type).length - 1;
  };

  const getDrawableIndex = (type: string) => {
    const cloth = currentOutfit[type] as ClothAccessory;
    const clothes = getClothes(type);
    // const index = clothes.findIndex(x => x.drawable === cloth.drawable && (x.dlc ?? '') === (cloth.dlc ?? ''));
    const index = clothes.findIndex(x => x.drawable === cloth.drawable);
    return Math.max(index, 0);
  }

  const changeDrawableNumber = (type: string, value: number) => {
    const maxDrawable = getMaxDrawable(type);
    if (value < 0)
      value = maxDrawable;
    else if (value > maxDrawable)
      value = 0;

    const cloth = getClothes(type)[value];
    console.log(`${type} ${cloth.drawable} ${cloth.dlc}`);
    setCurrentOutfit({ ...currentOutfit, [type]: { ...currentOutfit[type], drawable: cloth.drawable, texture: 0, dlc: cloth.dlc } });
  };

  const getMaxTexture = (type: string) => {
    return getClothes(type)[getDrawableIndex(type)].textures - 1;
  };

  const changeTextureNumber = (type: string, value: number) => {
    const maxTexture = getMaxTexture(type);
    if (value < 0)
      value = maxTexture;
    else if (value > maxTexture)
      value = 0;

    setCurrentOutfit({ ...currentOutfit, [type]: { ...currentOutfit[type], texture: value } });
  };

  return <div className="tuningPage">
    <div className="editor">
      <div className="options">
        <div className="option">
          <div className="labelContainer">
            <div className="label">
              {t('outfit')}
            </div>
            <div className="value">
              <input value={outfit} min={1} max={maxOutfit} type='number' className='inputSpan'
                onChange={(e) => changeOutfitNumber(Number(e.target.value))} />
            </div>
          </div>
          <div className="inputHolder">
            <input type="range" min={1} max={maxOutfit} value={outfit} step={1}
              onChange={(e) => changeOutfitNumber(Number(e.target.value))} />
          </div>
        </div>

        <Select value={currentComponent.value} options={components}
          onChange={(value: string) => setCurrentComponent(components.find(x => x.value === value))}
          style={{ width: '100%', marginBottom: '10px' }} />

        {currentOutfit && currentComponent && <div className="option">
          <div className="labelContainer">
            <div className="label">
              {currentComponent.label}
            </div>
            <div className="value">
              <input value={getDrawableIndex(currentComponent.value)} min={0} max={getMaxDrawable(currentComponent.value)}
                type='number' className='inputSpan' onChange={(e) => changeDrawableNumber(currentComponent.value, Number(e.target.value))} />
            </div>
          </div>
          <div className="inputHolder">
            <input type="range" min={0} max={getMaxDrawable(currentComponent.value)} value={getDrawableIndex(currentComponent.value)} step={1}
              onChange={(e) => changeDrawableNumber(currentComponent.value, Number(e.target.value))} />
          </div>
          <div className="labelContainer" style={{ marginTop: '10px' }}>
            <div className="label">
              {t('texture')} ({getMaxTexture(currentComponent.value)})
            </div>
            <div className="value">
              <input value={currentOutfit[currentComponent.value].texture} min={0} max={getMaxTexture(currentComponent.value)}
                type='number' className='inputSpan' onChange={(e) => changeTextureNumber(currentComponent.value, Number(e.target.value))} />
            </div>
          </div>
          <div className="inputHolder">
            <input type="range" min={0} max={getMaxTexture(currentComponent.value)} value={currentOutfit[currentComponent.value].texture} step={1}
              onChange={(e) => changeTextureNumber(currentComponent.value, Number(e.target.value))} />
          </div>
          {Constants.DEBUG &&
            <div className="label">
              {currentOutfit[currentComponent.value].dlc} {currentOutfit[currentComponent.value].drawable}
            </div>}
        </div>
        }
      </div>
      <div className="navigation bottom">
        {type !== 0 && <button onClick={cancel} className="danger" disabled={loading}>{t('cancel')}</button>}
        <button onClick={confirm} disabled={loading} style={{ gridColumn: type === 0 ? 'span 2' : '' }}>{t('confirm')}</button>
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

export default ClothesPage;