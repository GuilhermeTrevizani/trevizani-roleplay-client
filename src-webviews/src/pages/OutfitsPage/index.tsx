import Outfit from '../../types/Outfit'
import { useEffect, useState } from 'react';
import { configureEvent, emitEvent } from '../../services/util';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Button, Flex, Input, Modal, Space, Switch } from 'antd';
import { t } from 'i18next';
import { Constants } from '../../../../src/base/constants';

const OutfitsPage = () => {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [maxOutfit, setMaxOutfit] = useState(0);
  const [outfit, setOutfit] = useState<Outfit>();

  useEffect(() => {
    // setOutfits([{
    //   slot: 1,
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
    // }]);
    // setOutfit({
    //   slot: 1,
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
    // })
    // setMaxOutfit(10);
    configureEvent(Constants.OUTFITS_PAGE_SHOW, (outfitsJson: string, currentOutfit: number, maxOutfit: number) => {
      const outfits = JSON.parse(outfitsJson);
      setOutfits(outfits);
      setOutfit(outfits.find(x => x.slot == currentOutfit));
      setMaxOutfit(maxOutfit);
    });

    emitEvent(Constants.OUTFITS_PAGE_SHOW);
  }, []);

  useEffect(() => {
    if (!outfit)
      return;

    setOutfits(old => [...old.filter(x => x.slot !== outfit.slot), outfit]);
    emitEvent(Constants.OUTFITS_PAGE_TOGGLE_OUTFIT_PART, JSON.stringify(outfit));
  }, [outfit]);

  const changeOutfit = (add: boolean) => {
    let outfitSlot = outfit.slot;
    if (add)
      outfitSlot++;
    else
      outfitSlot--;

    if (outfitSlot < 1 || outfitSlot > maxOutfit)
      return;

    setOutfit(outfits.find(x => x.slot == outfitSlot));
    emitEvent(Constants.OUTFITS_PAGE_SET_OUTFIT, outfitSlot);
  };

  const handleCancel = () => {
    emitEvent(Constants.OUTFITS_PAGE_CLOSE);
  };

  if (!outfit)
    return <></>

  return <Modal open={true} title={t('outfit')} onCancel={handleCancel} footer={null} width={'20%'}>
    <Space.Compact style={{ width: '100%' }}>
      <Button type="primary" shape="circle" icon={<ArrowLeftOutlined />} onClick={() => changeOutfit(false)} />
      <Input value={outfit.slot} readOnly />
      <Button type="primary" shape="circle" icon={<ArrowRightOutlined />} onClick={() => changeOutfit(true)} />
    </Space.Compact>
    <hr />
    <Flex style={{ marginBottom: '5px' }}>
      <Switch checked={outfit.accessory0.using} onChange={() => setOutfit((old => ({ ...old, accessory0: { ...old.accessory0, using: !old.accessory0.using } })))} />
      <div style={{ marginLeft: '5px' }}><i className="fi fi-sr-hat-cowboy"></i> <span>{t('hat')} </span></div>
    </Flex>
    <Flex style={{ marginBottom: '5px' }}>
      <Switch checked={outfit.cloth1.using} onChange={() => setOutfit((old => ({ ...old, cloth1: { ...old.cloth1, using: !old.cloth1.using } })))} />
      <div style={{ marginLeft: '5px' }}><i className="fi fi-ss-hockey-mask"></i> <span>{t('mask')} </span></div>
    </Flex>
    <Flex style={{ marginBottom: '5px' }}>
      <Switch checked={outfit.accessory1.using} onChange={() => setOutfit((old => ({ ...old, accessory1: { ...old.accessory1, using: !old.accessory1.using } })))} />
      <div style={{ marginLeft: '5px' }}><i className="fa-solid fa-glasses"></i> <span>{t('glasses')} </span></div>
    </Flex>
    <Flex style={{ marginBottom: '5px' }}>
      <Switch checked={outfit.accessory2.using} onChange={() => setOutfit((old => ({ ...old, accessory2: { ...old.accessory2, using: !old.accessory2.using } })))} />
      <div style={{ marginLeft: '5px' }}><i className="fi fi-rr-ear"></i> <span>{t('ear')} </span></div>
    </Flex>
    <Flex style={{ marginBottom: '5px' }}>
      <Switch checked={outfit.cloth3.using} onChange={() => setOutfit((old => ({ ...old, cloth3: { ...old.cloth3, using: !old.cloth3.using } })))} />
      <div style={{ marginLeft: '5px' }}><i className="fi fi-rr-user"></i> <span>{t('torso')} </span></div>
    </Flex>
    <Flex style={{ marginBottom: '5px' }}>
      <Switch checked={outfit.cloth8.using} onChange={() => setOutfit((old => ({ ...old, cloth8: { ...old.cloth8, using: !old.cloth8.using } })))} />
      <div style={{ marginLeft: '5px' }}><i className="fi fi-tr-shirt-tank-top"></i> <span>{t('shirt')} </span></div>
    </Flex>
    <Flex style={{ marginBottom: '5px' }}>
      <Switch checked={outfit.cloth11.using} onChange={() => setOutfit((old => ({ ...old, cloth11: { ...old.cloth11, using: !old.cloth11.using } })))} />
      <div style={{ marginLeft: '5px' }}><i className="fi fi-rr-shirt-long-sleeve"></i> <span>{t('jacket')} </span></div>
    </Flex>
    <Flex style={{ marginBottom: '5px' }}>
      <Switch checked={outfit.cloth4.using} onChange={() => setOutfit((old => ({ ...old, cloth4: { ...old.cloth4, using: !old.cloth4.using } })))} />
      <div style={{ marginLeft: '5px' }}><i className="fi fi-tr-clothes-hanger"></i> <span>{t('pants')} </span></div>
    </Flex>
    <Flex style={{ marginBottom: '5px' }}>
      <Switch checked={outfit.cloth6.using} onChange={() => setOutfit((old => ({ ...old, cloth6: { ...old.cloth6, using: !old.cloth6.using } })))} />
      <div style={{ marginLeft: '5px' }}><i className="fi fi-sr-shoe-prints"></i> <span>{t('shoes')} </span></div>
    </Flex>
    <Flex style={{ marginBottom: '5px' }}>
      <Switch checked={outfit.cloth5.using} onChange={() => setOutfit((old => ({ ...old, cloth5: { ...old.cloth5, using: !old.cloth5.using } })))} />
      <div style={{ marginLeft: '5px' }}><i className="fi fi-rr-backpack"></i> <span>{t('backpack')} </span></div>
    </Flex>
    <Flex style={{ marginBottom: '5px' }}>
      <Switch checked={outfit.cloth7.using} onChange={() => setOutfit((old => ({ ...old, cloth7: { ...old.cloth7, using: !old.cloth7.using } })))} />
      <div style={{ marginLeft: '5px' }}><i className="fi fi-ts-tie"></i> <span>{t('extra')} </span></div>
    </Flex>
    <Flex style={{ marginBottom: '5px' }}>
      <Switch checked={outfit.cloth9.using} onChange={() => setOutfit((old => ({ ...old, cloth9: { ...old.cloth9, using: !old.cloth9.using } })))} />
      <div style={{ marginLeft: '5px' }}><i className="fi fi-ss-shirt-tank-top"></i> <span>{t('armor')} </span></div>
    </Flex>
    <Flex style={{ marginBottom: '5px' }}>
      <Switch checked={outfit.cloth10.using} onChange={() => setOutfit((old => ({ ...old, cloth10: { ...old.cloth10, using: !old.cloth10.using } })))} />
      <div style={{ marginLeft: '5px' }}><i className="fi fi-tr-vest-patches"></i> <span>{t('embroidery')} </span></div>
    </Flex>
    <Flex style={{ marginBottom: '5px' }}>
      <Switch checked={outfit.accessory6.using} onChange={() => setOutfit((old => ({ ...old, accessory6: { ...old.accessory6, using: !old.accessory6.using } })))} />
      <div style={{ marginLeft: '5px' }}><i className="fi fi-rr-watch-smart"></i> <span>{t('watch')} </span></div>
    </Flex>
    <Flex style={{ marginBottom: '5px' }}>
      <Switch checked={outfit.accessory7.using} onChange={() => setOutfit((old => ({ ...old, accessory7: { ...old.accessory7, using: !old.accessory7.using } })))} />
      <div style={{ marginLeft: '5px' }}><i className="fi fi-ts-ring"></i> <span>{t('bracelet')} </span></div>
    </Flex>
  </Modal>
}

export default OutfitsPage;