import { useEffect, useState } from 'react';
import '../VehicleTuningPage/style.scss';
import { configureEvent, emitEvent } from '../../services/util';
import { Constants } from '../../../../src/base/constants';
import { t } from 'i18next';
import { CharacterSex } from '../../types/CharacterSex';
import Personalization from '../../types/Personalization';
import { maleHairOverlays, femaleHairOverlays } from './hairOverlays';
import { opacityOverlays, colorOverlays } from './overlays';
import { structureLabels } from './structure';
import { CharacterEditType } from '../../types/CharacterEditType';
import { Col, Modal, Row, Tag } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import Text from 'antd/es/typography/Text';
import { faceNames } from './faceNames';
import maleHairs from '../../../json/clothes2male.json' assert { type: 'json' };
import femaleHairs from '../../../json/clothes2female.json' assert { type: 'json' };
import Cloth from '../../types/Cloth';

enum Page {
  Sex,
  Structure,
  Hair,
  Overlays,
  Decor,
};

const CharCreatorPage = () => {
  const [sex, setSex] = useState<CharacterSex>();
  const [personalization, setPersonalization] = useState<Personalization>({
    faceFather: 0,
    faceMother: 0,
    faceAncestry: 0,
    skinFather: 0,
    skinMother: 0,
    skinAncestry: 0,
    faceMix: 0,
    skinMix: 0,
    ancestryMix: 0,
    eyes: 0,
    structure: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    colorOverlays: [
      {
        id: 1,
        color1: 0,
        color2: 0,
        opacity: 0,
        value: 0,
      },
      {
        id: 2,
        color1: 0,
        color2: 0,
        opacity: 0,
        value: 0,
      },
      {
        id: 4,
        color1: 0,
        color2: 0,
        opacity: 0,
        value: 0,
      },
      {
        id: 5,
        color1: 0,
        color2: 0,
        opacity: 0,
        value: 0,
      },
      {
        id: 8,
        color1: 0,
        color2: 0,
        opacity: 0,
        value: 0,
      },
      {
        id: 10,
        color1: 0,
        color2: 0,
        opacity: 0,
        value: 0,
      },
    ],
    hair: 0,
    hairColor1: 0,
    hairColor2: 0,
    opacityOverlays: [
      {
        id: 0,
        opacity: 0,
        value: 0,
      },
      {
        id: 3,
        opacity: 0,
        value: 0,
      },
      {
        id: 6,
        opacity: 0,
        value: 0,
      },
      {
        id: 7,
        opacity: 0,
        value: 0,
      },
      {
        id: 9,
        opacity: 0,
        value: 0,
      },
      {
        id: 11,
        opacity: 0,
        value: 0,
      },
    ],
    tattoos: [],
  });
  const [type, setType] = useState<CharacterEditType>();
  const [currentPage, setCurrentPage] = useState(Page.Sex);
  const [pages, setPages] = useState<Page[]>([]);
  const maxEye = 7;
  const maxFaceSkin = 45;
  const maxMix = 1.0;
  const maxStructure = 1.0;
  const maxColor = 64;

  const [importingXMLMenyoo, setImportingXMLMenyoo] = useState(false);
  const [xmlMenyoo, setXmlMenyoo] = useState('');

  useEffect(() => {
    // setType(CharacterEditType.Creator);
    // setPages([Page.Sex, Page.Structure, Page.Hair, Page.Overlays, Page.Decor]);
    // setCurrentPage(Page.Sex);
    configureEvent(Constants.CHAR_CREATOR_PAGE_SHOW, (sex: CharacterSex, personalizationJson: string, type: CharacterEditType) => {
      setSex(sex);
      setPersonalization(JSON.parse(personalizationJson));
      setType(type);
      if (type === CharacterEditType.MakeUp) {
        setPages([Page.Decor]);
        setCurrentPage(Page.Decor);
      } else if (type === CharacterEditType.BarberShop) {
        setPages([Page.Hair, Page.Overlays, Page.Decor]);
        setCurrentPage(Page.Hair);
      } else {
        setPages([Page.Sex, Page.Structure, Page.Hair, Page.Overlays, Page.Decor]);
        setCurrentPage(Page.Sex);
      }
    });
    emitEvent(Constants.CHAR_CREATOR_PAGE_SHOW);
  }, []);

  useEffect(() => {
    emitEvent(Constants.CHAR_CREATOR_PAGE_SYNC, JSON.stringify(personalization));
  }, [personalization]);

  const confirm = () => {
    emitEvent(Constants.CHAR_CREATOR_PAGE_CONFIRM, JSON.stringify(personalization));
  };

  const cancel = () => {
    emitEvent(Constants.CHAR_CREATOR_PAGE_CLOSE);
  };

  const back = () => {
    let newPage = pages.indexOf(currentPage);
    newPage--;

    if (newPage < 0)
      return;

    setCurrentPage(pages[newPage]);
  };

  const next = () => {
    let newPage = pages.indexOf(currentPage);
    newPage++;

    if (newPage > pages.length - 1)
      return;

    setCurrentPage(pages[newPage]);
  };

  const changeEye = (newValue: number) => {
    setPersonalization({ ...personalization, eyes: newValue });
  };

  const changeFaceFather = (newValue: number) => {
    setPersonalization({ ...personalization, faceFather: newValue });
  };

  const changeFaceAncestry = (newValue: number) => {
    setPersonalization({ ...personalization, faceAncestry: newValue });
  };

  const changeSkinAncestry = (newValue: number) => {
    setPersonalization({ ...personalization, skinAncestry: newValue });
  };

  const changeSkinFather = (newValue: number) => {
    setPersonalization({ ...personalization, skinFather: newValue });
  };

  const changeFaceMother = (newValue: number) => {
    setPersonalization({ ...personalization, faceMother: newValue });
  };

  const changeSkinMother = (newValue: number) => {
    setPersonalization({ ...personalization, skinMother: newValue });
  };

  const changeStructure = (index: number, value: number) => {
    const structure = [...personalization.structure];
    structure[index] = value;
    setPersonalization({ ...personalization, structure: structure });
  };

  const getHairs = () => {
    return (sex === CharacterSex.Woman ? femaleHairs : maleHairs) as Cloth[];
  }

  const getHair = () => {
    const index = getHairs()
      .findIndex(x => x.drawable === personalization.hair);
    // .findIndex(x => x.drawable === personalization.hair
    //     && (x.dlc ?? '') === (personalization.hairDLC ?? ''));
    return Math.max(index, 0);
  };

  const getHairCount = () => {
    return getHairs().length - 1;
  };

  const changeHair = (newValue: number) => {
    const hair = getHairs()[newValue];
    setPersonalization({ ...personalization, hair: hair.drawable, hairDLC: hair.dlc });
  };

  const changeHairColor1 = (newValue: number) => {
    setPersonalization({ ...personalization, hairColor1: newValue });
  };

  const changeHairColor2 = (newValue: number) => {
    setPersonalization({ ...personalization, hairColor2: newValue });
  };

  const getHairOverlays = () => {
    return sex === CharacterSex.Woman ? femaleHairOverlays : maleHairOverlays;
  };

  const getHairOverlayCount = () => {
    return getHairOverlays().length - 1;
  };

  const changeHairOverlay = (newValue: number) => {
    const hairOverlay = getHairOverlays()[newValue];
    setPersonalization({ ...personalization, hairCollection: hairOverlay.collection, hairOverlay: hairOverlay.overlay });
  };

  const getHairOverlay = () => {
    const index = getHairOverlays()
      .findIndex(x => (x.collection ?? '') === (personalization.hairCollection ?? '')
        && (x.overlay ?? '') === (personalization.hairOverlay ?? ''));
    return index;
  };

  const changeOpacityOverlayValue = (index: number, value: number) => {
    const opacityOverlay = [...personalization.opacityOverlays];
    opacityOverlay[index].value = value;
    setPersonalization({ ...personalization, opacityOverlays: opacityOverlay });
  };

  const changeOpacityOverlayOpacity = (index: number, value: number) => {
    const opacityOverlay = [...personalization.opacityOverlays];
    opacityOverlay[index].opacity = value;
    setPersonalization({ ...personalization, opacityOverlays: opacityOverlay });
  };

  const changeColorOverlayValue = (index: number, value: number) => {
    const colorOverlay = [...personalization.colorOverlays];
    colorOverlay[index].value = value;
    setPersonalization({ ...personalization, colorOverlays: colorOverlay });
  };

  const changeColorOverlayOpacity = (index: number, value: number) => {
    const colorOverlay = [...personalization.colorOverlays];
    colorOverlay[index].opacity = value;
    setPersonalization({ ...personalization, colorOverlays: colorOverlay });
  };

  const changeColorOverlayColor1 = (index: number, value: number) => {
    const colorOverlay = [...personalization.colorOverlays];
    colorOverlay[index].color1 = value;
    setPersonalization({ ...personalization, colorOverlays: colorOverlay });
  };

  const changeColorOverlayColor2 = (index: number, value: number) => {
    const colorOverlay = [...personalization.colorOverlays];
    colorOverlay[index].color2 = value;
    setPersonalization({ ...personalization, colorOverlays: colorOverlay });
  };

  const handleCancelImportXMLMenyoo = () => {
    setImportingXMLMenyoo(false);
  };

  const numberFormat = (value: string) => {
    const number = Number(value);
    return isNaN(number) ? 0 : number;
  };

  const checkValue = (value: number, maxValue: number) => {
    if (value < 0 || value > maxValue)
      return 0;

    return value;
  }

  const handleConfirmImportXMLMenyoo = () => {
    try {
      const xmlParser = new DOMParser();
      const xml = xmlParser.parseFromString(xmlMenyoo.replace(/>\s+</g, '><').trim(), 'text/xml');

      const newPersonalization = personalization;

      newPersonalization.faceFather = checkValue(numberFormat(xml.getElementsByTagName("ShapeFatherId")[0].innerHTML), maxFaceSkin);
      newPersonalization.faceMother = checkValue(numberFormat(xml.getElementsByTagName("ShapeMotherId")[0].innerHTML), maxFaceSkin);
      newPersonalization.faceAncestry = checkValue(numberFormat(xml.getElementsByTagName("ShapeOverrideId")[0].innerHTML), maxFaceSkin);
      newPersonalization.faceMix = checkValue(numberFormat(xml.getElementsByTagName("ShapeVal")[0].innerHTML), maxMix);

      newPersonalization.skinFather = checkValue(numberFormat(xml.getElementsByTagName("ToneFatherId")[0].innerHTML), maxFaceSkin);
      newPersonalization.skinMother = checkValue(numberFormat(xml.getElementsByTagName("ToneMotherId")[0].innerHTML), maxFaceSkin);
      newPersonalization.skinAncestry = checkValue(numberFormat(xml.getElementsByTagName("ToneOverrideId")[0].innerHTML), maxFaceSkin);
      newPersonalization.skinMix = checkValue(numberFormat(xml.getElementsByTagName("ToneVal")[0].innerHTML), maxMix);

      newPersonalization.ancestryMix = checkValue(numberFormat(xml.getElementsByTagName("OverrideVal")[0].innerHTML), maxMix);
      newPersonalization.eyes = checkValue(numberFormat(xml.getElementsByTagName("EyeColour")[0].innerHTML), maxEye);

      personalization.structure = [];
      const facialFeatures = xml.getElementsByTagName("FacialFeatures")[0].childNodes;
      facialFeatures.forEach(item => {
        personalization.structure.push(checkValue(numberFormat(item.textContent), maxStructure));
      });

      const overlays = xml.getElementsByTagName("Overlays")[0].childNodes;

      const getOpacityOverlay = (id: number) => {
        const overlay = overlays[id] as Element;

        let value = numberFormat(overlay.getAttributeNode('index').nodeValue);
        let opacity = checkValue(numberFormat(overlay.getAttributeNode('opacity').nodeValue), maxMix);

        if (value < 0 || value > opacityOverlays.find(x => x.id === id).max)
          value = opacity = 0;

        return {
          id,
          value,
          opacity,
        };
      }

      const getColorOverlay = (id: number) => {
        const overlay = overlays[id] as Element;

        let value = numberFormat(overlay.getAttributeNode('index').nodeValue);
        let opacity = checkValue(numberFormat(overlay.getAttributeNode('opacity').nodeValue), maxMix);

        if (value < 0 || value > colorOverlays.find(x => x.id === id).max)
          value = opacity = 0;

        return {
          id,
          value,
          opacity,
          color1: checkValue(numberFormat(overlay.getAttributeNode('colour').nodeValue), maxColor),
          color2: checkValue(numberFormat(overlay.getAttributeNode('colourSecondary').nodeValue), maxColor),
        };
      }

      personalization.opacityOverlays = [
        getOpacityOverlay(0),
        getOpacityOverlay(3),
        getOpacityOverlay(6),
        getOpacityOverlay(7),
        getOpacityOverlay(9),
        getOpacityOverlay(11),
      ];

      personalization.colorOverlays = [
        getColorOverlay(1),
        getColorOverlay(2),
        getColorOverlay(4),
        getColorOverlay(5),
        getColorOverlay(8),
        getColorOverlay(10),
      ];

      setPersonalization(newPersonalization);
      emitEvent(Constants.CHAR_CREATOR_PAGE_SYNC, JSON.stringify(newPersonalization));
    } catch (ex) {
      console.log(ex);
      emitEvent(Constants.CHAR_CREATOR_PAGE_NOTIFY_ERROR, t('invalidXML'));
    }
    setImportingXMLMenyoo(false);
  };

  const formatPercentage = (number: number) => {
    return `${(number * 100).toFixed(0)}%`;
  };

  const isConfirmDisabled = () => {
    return type === CharacterEditType.Creator && pages.indexOf(currentPage) != pages.length - 1;
  };

  return <div className="tuningPage">
    <div className="editor">
      <div className="navigation">
        <button onClick={back} className={pages.indexOf(currentPage) === 0 ? 'inactive' : ''}>{t('back')}</button>
        <button onClick={next} className={pages.indexOf(currentPage) == pages.length - 1 ? 'inactive' : ''}>{t('next')}</button>
      </div>
      {currentPage === Page.Sex && <div className="options">
        <div className="option">
          <button onClick={() => setImportingXMLMenyoo(true)} className="full danger">{t('importXMLMenyoo')}</button>
        </div>
        <div className="option">
          <div className="labelContainer">
            <div className="label">
              {t('fatherFace')}
            </div>
            <div className="value">
              {faceNames[personalization.faceFather]} ({personalization.faceFather})
            </div>
          </div>
          <div className="inputHolder">
            <input type="range" min={0} max={maxFaceSkin} value={personalization.faceFather} step={1}
              onChange={(e) => changeFaceFather(Number(e.target.value))} />
          </div>
        </div>
        <div className="option">
          <div className="labelContainer">
            <div className="label">
              {t('motherFace')}
            </div>
            <div className="value">
              {faceNames[personalization.faceMother]} ({personalization.faceMother})
            </div>
          </div>
          <div className="inputHolder">
            <input type="range" min={0} max={maxFaceSkin} value={personalization.faceMother} step={1}
              onChange={(e) => changeFaceMother(Number(e.target.value))} />
          </div>
        </div>
        <div className="option">
          <div className="labelContainer">
            <div className="label">
              {t('ancestryFace')}
            </div>
            <div className="value">
              {faceNames[personalization.faceAncestry]} ({personalization.faceAncestry})
            </div>
          </div>
          <div className="inputHolder">
            <input type="range" min={0} max={maxFaceSkin} value={personalization.faceAncestry} step={1}
              onChange={(e) => changeFaceAncestry(Number(e.target.value))} />
          </div>
        </div>
        <div className="option">
          <div className="labelContainer">
            <div className="label">
              {t('faceMix')}
            </div>
            <div className="value">
              {formatPercentage(personalization.faceMix)}
            </div>
          </div>
          <div className="inputHolder">
            <input type="range" min="0" max={maxMix} step="0.01" value={personalization.faceMix}
              onChange={(e) => setPersonalization({ ...personalization, faceMix: Number(e.target.value) })} />
          </div>
        </div>
        <div className="option">
          <div className="labelContainer">
            <div className="label">
              {t('fatherSkin')}
            </div>
            <div className="value">
              {personalization.skinFather}
            </div>
          </div>
          <div className="inputHolder">
            <input type="range" min={0} max={maxFaceSkin} value={personalization.skinFather} step={1}
              onChange={(e) => changeSkinFather(Number(e.target.value))} />
          </div>
        </div>
        <div className="option">
          <div className="labelContainer">
            <div className="label">
              {t('motherSkin')}
            </div>
            <div className="value">
              {personalization.skinMother}
            </div>
          </div>
          <div className="inputHolder">
            <input type="range" min={0} max={maxFaceSkin} value={personalization.skinMother} step={1}
              onChange={(e) => changeSkinMother(Number(e.target.value))} />
          </div>
        </div>
        <div className="option">
          <div className="labelContainer">
            <div className="label">
              {t('ancestrySkin')}
            </div>
            <div className="value">
              {personalization.skinAncestry}
            </div>
          </div>
          <div className="inputHolder">
            <input type="range" min={0} max={maxFaceSkin} value={personalization.skinAncestry} step={1}
              onChange={(e) => changeSkinAncestry(Number(e.target.value))} />
          </div>
        </div>
        <div className="option">
          <div className="labelContainer">
            <div className="label">
              {t('skinMix')}
            </div>
            <div className="value">
              {formatPercentage(personalization.skinMix)}
            </div>
          </div>
          <div className="inputHolder">
            <input type="range" min="0" max={maxMix} step="0.01" value={personalization.skinMix}
              onChange={(e) => setPersonalization({ ...personalization, skinMix: Number(e.target.value) })} />
          </div>
        </div>
        <div className="option">
          <div className="labelContainer">
            <div className="label">
              {t('ancestryMix')}
            </div>
            <div className="value">
              {formatPercentage(personalization.ancestryMix)}
            </div>
          </div>
          <div className="inputHolder">
            <input type="range" min="0" max={maxMix} step="0.01" value={personalization.ancestryMix}
              onChange={(e) => setPersonalization({ ...personalization, ancestryMix: Number(e.target.value) })} />
          </div>
        </div>
        <div className="option">
          <div className="labelContainer">
            <div className="label">
              {t('eyeColor')}
            </div>
            <div className="value">
              {personalization.eyes}
            </div>
          </div>
          <div className="inputHolder">
            <input type="range" min="0" max={maxEye} step="1" value={personalization.eyes}
              onChange={(e) => changeEye(Number(e.target.value))} />
          </div>
        </div>
      </div>}
      {currentPage === Page.Structure && <div className="options">
        {structureLabels.map((item, index) => {
          const value = personalization.structure[index];
          return (
            <div className="option">
              <div className="labelContainer">
                <div className="label">
                  {item}
                </div>
                <div className="value">
                  {value.toFixed(2)}
                </div>
              </div>
              <div className="inputHolder">
                <input type="range" min="-1" max={maxStructure} step="0.01" value={value}
                  onChange={(e) => changeStructure(index, Number(e.target.value))} />
              </div>
            </div>
          )
        })}
      </div>}
      {currentPage === Page.Hair && <div className="options">
        <div className="option">
          <div className="labelContainer">
            <div className="label">
              {t('hair')}
            </div>
            <div className="value">
              {getHair()}
            </div>
          </div>
          <div className="inputHolder">
            <input type="range" min={0} max={getHairCount()} value={getHair()} step={1}
              onChange={(e) => changeHair(Number(e.target.value))} />
          </div>
          {Constants.DEBUG && <div className="label">
            {personalization.hairDLC} {personalization.hair}
          </div>}
        </div>
        <div className="option">
          <div className="labelContainer">
            <div className="label">
              {t('hairDetail')}
            </div>
            <div className="value">
              {getHairOverlay()}
            </div>
          </div>
          <div className="inputHolder">
            <input type="range" min={0} max={getHairOverlayCount()} value={getHairOverlay()} step={1}
              onChange={(e) => changeHairOverlay(Number(e.target.value))} />
          </div>
        </div>
        <div className="option">
          <div className="labelContainer">
            <div className="label">
              {t('hairColor')}
            </div>
            <div className="value">
              {personalization.hairColor1}
            </div>
          </div>
          <div className="inputHolder">
            <input type="range" min={0} max={maxColor} value={personalization.hairColor1} step={1}
              onChange={(e) => changeHairColor1(Number(e.target.value))} />
          </div>
        </div>
        <div className="option">
          <div className="labelContainer">
            <div className="label">
              {t('hairLights')}
            </div>
            <div className="value">
              {personalization.hairColor2}
            </div>
          </div>
          <div className="inputHolder">
            <input type="range" min={0} max={maxColor} value={personalization.hairColor2} step={1}
              onChange={(e) => changeHairColor2(Number(e.target.value))} />
          </div>
        </div>
      </div>}
      {currentPage === Page.Overlays && <div className="options">
        {opacityOverlays.map((item, index) => {
          const opacityOverlay = personalization.opacityOverlays[index];
          return (
            <div className="option">
              <div className="labelContainer">
                <div className="label">
                  {item.label}
                </div>
                <div className="value">
                  {opacityOverlay.value}
                </div>
              </div>
              <div className="inputHolder">
                <input type="range" min={0} max={item.max} value={opacityOverlay.value} step={1}
                  onChange={(e) => changeOpacityOverlayValue(index, Number(e.target.value))} />
              </div>
              <div className="labelContainer">
                <div className="label">
                  {t('opacity')}
                </div>
                <div className="value">
                  {formatPercentage(opacityOverlay.opacity)}
                </div>
              </div>
              <div className="inputHolder">
                <input type="range" min="0" max={maxMix} value={opacityOverlay.opacity} step="0.01"
                  onChange={(e) => changeOpacityOverlayOpacity(index, Number(e.target.value))} />
              </div>
            </div>
          )
        })}
      </div>}
      {currentPage === Page.Decor && <div className="options">
        {colorOverlays.map((item, index) => {
          const colorOverlay = personalization.colorOverlays[index];
          return (
            <div className="option">
              <div className="labelContainer">
                <div className="label">
                  {item.label}
                </div>
                <div className="value">
                  {colorOverlay.value}
                </div>
              </div>
              <div className="inputHolder">
                <input type="range" min={0} max={item.max} value={colorOverlay.value} step={1}
                  onChange={(e) => changeColorOverlayValue(index, Number(e.target.value))} />
              </div>
              <div className="labelContainer">
                <div className="label">
                  {t('opacity')}
                </div>
                <div className="value">
                  {formatPercentage(colorOverlay.opacity)}
                </div>
              </div>
              <div className="inputHolder">
                <input type="range" min="0" max={maxMix} value={colorOverlay.opacity} step="0.01"
                  onChange={(e) => changeColorOverlayOpacity(index, Number(e.target.value))} />
              </div>
              <div className="labelContainer">
                <div className="label">
                  {t('primaryColor')}
                </div>
                <div className="value">
                  {colorOverlay.color1}
                </div>
              </div>
              <div className="inputHolder">
                <input type="range" min="0" max={maxColor} value={colorOverlay.color1} step="1"
                  onChange={(e) => changeColorOverlayColor1(index, Number(e.target.value))} />
              </div>
              {item.hasColor2 && <>
                <div className="labelContainer">
                  <div className="label">
                    {t('secondaryColor')}
                  </div>
                  <div className="value">
                    {colorOverlay.color2}
                  </div>
                </div>
                <div className="inputHolder">
                  <input type="range" min="0" max={maxColor} value={colorOverlay.color2} step="1"
                    onChange={(e) => changeColorOverlayColor2(index, Number(e.target.value))} />
                </div>
              </>}
            </div>
          )
        })}
      </div>}
      <div className="navigation bottom">
        {type !== CharacterEditType.Creator && <button className="full danger" onClick={cancel}>{t('cancel')}</button>}
        <button className={`full ${isConfirmDisabled() ? 'inactive' : ''}`}
          onClick={confirm} disabled={isConfirmDisabled()} style={{ gridColumn: type === CharacterEditType.Creator ? 'span 2' : '' }}>{t('confirm')}</button>
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
    <Modal open={importingXMLMenyoo} title={t('importXMLMenyoo')}
      cancelText={t('close')} okText={t('importXMLMenyoo')}
      onCancel={handleCancelImportXMLMenyoo} onOk={handleConfirmImportXMLMenyoo}>
      <TextArea rows={20} value={xmlMenyoo} onChange={(e) => setXmlMenyoo(e.target.value)} />
    </Modal>
  </div>;
};

export default CharCreatorPage;