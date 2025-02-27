import './index.scss'
import { DragDropContext, Droppable, Draggable, DragStart, DropResult } from 'react-beautiful-dnd'
import { ReactElement, useEffect, useRef, useState } from 'react'
import { configureEvent, emitEvent, formatValue } from '../../services/util'
import { Constants } from '../../../../src/base/constants'
import Item from '../../types/Item'
import { t } from 'i18next'
import { CloseOutlined } from '@ant-design/icons'
import { Popover } from 'antd'
import NearbyCharacter from '../../types/NearbyCharacter'
import SelectOption from '../../types/SelectOption'

const InventoryPage = () => {
  const [leftTitle, setLeftTitle] = useState('');
  const [leftItems, setLeftItems] = useState<Item[]>([]);
  const [rightTitle, setRightTitle] = useState('');
  const [rightItems, setRightItems] = useState<Item[]>([]);
  const [maxLeftItemsWeight, setMaxLeftItemsWeight] = useState(0);
  const [leftSlots, setLeftSlots] = useState(0);
  const [rightSlots, setRightSlots] = useState(0);

  const [itemDragged, setItemDragged] = useState<Item | undefined>();
  const [qtdToDrag, setQtdToDrag] = useState<number | undefined>();
  const qtdToDragRef = useRef(0);

  const [modalGiveIsOpen, setModalGiveIsOpen] = useState(false);
  const modalGiveIsOpenRef = useRef(modalGiveIsOpen);

  const [nearbyCharacters, setNearbyCharacters] = useState<NearbyCharacter[]>([]);
  const [nearbyCharacter, setNearbyCharacter] = useState<NearbyCharacter>();
  const giveItem = useRef<Item>(undefined);

  const [useItemId, setUseItemId] = useState('');
  const [useItemOption, setUseItemOption] = useState<SelectOption>();
  const [useItemOptions, setUseItemOptions] = useState<SelectOption[]>([]);

  const getItemLeft = (slot: number) => {
    const item = leftItems.filter(i => i.slot == slot);
    return !!item ? item[0] : undefined;
  }

  const getItemRight = (slot: number) => {
    const item = rightItems.filter(i => i.slot == slot);
    return !!item ? item[0] : undefined;
  }

  const renderItems = (side: 'left' | 'right') => {
    const getItem = side === 'left' ? getItemLeft : getItemRight;
    const slots = side === 'left' ? leftSlots : rightSlots;
    const arrRes: ReactElement[] = [];

    for (let i = 1; i <= slots; i++) {
      var item = getItem(i)
      if (item !== undefined) {
        const { id, name, quantity, inUse, image, isUsable, weight, extra } = { ...item }
        arrRes.push(
          <Droppable droppableId={`${i}-${side}`} isDropDisabled key={i}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className='inventoryItemWrapper'
              >
                <Draggable key={`${i}-${side}`} draggableId={`${i}-${side}`} index={i}>
                  {(provided, snapshot) => (
                    <>
                      <Popover content={<>
                        <span>{t('weight')}: <strong>{formatValue(weight * quantity, 2)} kg</strong></span>
                        {extra && <><br /><span dangerouslySetInnerHTML={{ __html: extra }}></span></>}
                      </>} title={name}>
                        <div
                          onContextMenu={(ev) => useItem(id, quantity, isUsable)}
                          className={'inventoryItem' + (inUse ? ' using' : '')}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className='inventoryItemTop'>
                            <span>{formatValue(snapshot.isDragging ? getQuantity(quantity) : quantity)}x</span>
                            <img src={image} alt="" className='inventoryItemImage' />
                          </div>
                          <div className='inventoryItemBottom'>
                            <span>{name}</span>
                          </div>
                        </div>
                      </Popover>
                    </>
                  )}
                </Draggable>
              </div>
            )
            }
          </Droppable>
        )
      }
      else {
        arrRes.push(
          <Droppable droppableId={`${i}-${side}`} key={i}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className='inventoryItemWrapper'
              >
              </div>
            )
            }
          </Droppable>
        )
      }

    }
    return <>{arrRes.map(x => x)}</>
  }

  const handleDragItem = (start: DragStart) => {
    try {
      const idSplitted = start.draggableId.split('-');
      const getItem = idSplitted[1] == 'left' ? getItemLeft : getItemRight

      setItemDragged(getItem(Number(idSplitted[0])))
    } catch (ex) {
      console.log(ex);
    }
  }

  const getQuantity = (realQuantity: number) => {
    let qtdDrag = qtdToDragRef.current ?? 1;
    if (qtdDrag < 1)
      qtdDrag = 1;
    return Math.min(realQuantity, qtdDrag);
  };

  const handleDrop = (res: DropResult) => {
    try {
      if (!itemDragged)
        return;

      giveItem.current = itemDragged;
      const { id, quantity, name, isStack } = { ...itemDragged };

      if (!res.destination) {
        setItemDragged(undefined);
        return;
      }

      if (res.destination.droppableId == 'give') {
        setItemDragged(undefined);
        emitEvent(Constants.INVENTORY_PAGE_GET_NEARBY_CHARACTERS);
        return
      }

      const dragIdSplitted = res.draggableId.split('-')
      const dropIdSplitted = res.destination.droppableId.split('-')
      const leftOrigin = dragIdSplitted[1] === 'left';
      const leftTarget = dropIdSplitted[1] === 'left';
      const slot = Number(dropIdSplitted[0]);
      const quantityToMove = leftOrigin == leftTarget && isStack ? quantity : getQuantity(quantity);

      if (leftOrigin == leftTarget) {
        if (leftTarget)
          setLeftItems(old => {
            itemDragged.slot = slot;
            return old;
          });
        else
          setRightItems(old => {
            itemDragged.slot = slot;
            return old;
          });
      } else {
        if (leftTarget) {
          const stackedItem = leftItems.find(x => x.name === name && x.isStack);
          if (stackedItem !== undefined) {
            setLeftItems(old => {
              stackedItem.quantity += quantityToMove;
              return old;
            });
          } else {
            const newItem = { ...itemDragged, slot: slot, quantity: quantityToMove }
            setLeftItems(old => [...old, newItem]);
          }
        } else {
          const stackedItem = rightItems.find(x => x.name === name && x.isStack);
          if (stackedItem !== undefined) {
            setRightItems(old => {
              stackedItem.quantity += quantityToMove;
              return old;
            });
          } else {
            const newItem = { ...itemDragged, slot: slot, quantity: quantityToMove }
            setRightItems(old => [...old, newItem]);
          }
        }

        const remaingQuantity = quantity - quantityToMove;
        if (remaingQuantity == 0) {
          if (leftOrigin)
            setLeftItems(old => old.filter(x => x.id !== id));
          else
            setRightItems(old => old.filter(x => x.id !== id));
        } else {
          if (leftOrigin)
            setLeftItems(old => {
              itemDragged.quantity = remaingQuantity;
              return old;
            });
          else
            setRightItems(old => {
              itemDragged.quantity = remaingQuantity;
              return old;
            });
        }
      }

      if (Constants.DEBUG)
        console.log('INVENTORY_PAGE_MOVE_ITEM', id, leftOrigin, leftTarget, slot, quantityToMove);
      emitEvent(Constants.INVENTORY_PAGE_MOVE_ITEM, id, leftOrigin, leftTarget, slot, quantityToMove);
      setItemDragged(undefined);
    } catch (ex) {
      console.log(ex);
    }
  }

  const useItem = (id: string, quantity: number, isUsable: boolean) => {
    try {
      if (!isUsable)
        return;

      const quantityToUse = getQuantity(quantity);
      if (Constants.DEBUG)
        console.log('INVENTORY_PAGE_USE_ITEM', id, quantityToUse);
      emitEvent(Constants.INVENTORY_PAGE_USE_ITEM, id, quantityToUse);
    } catch (ex) {
      console.log(ex);
    }
  };

  const handleGiveItem = (character: NearbyCharacter) => {
    try {
      const quantityToGive = getQuantity(giveItem.current.quantity);
      if (Constants.DEBUG)
        console.log('INVENTORY_PAGE_GIVE_ITEM', giveItem.current.id, quantityToGive, character.sessionId);
      emitEvent(Constants.INVENTORY_PAGE_GIVE_ITEM, giveItem.current.id, quantityToGive, character.sessionId);

      giveItem.current = undefined;
      setModalGiveIsOpen(false);
      setNearbyCharacter(undefined);
    } catch (ex) {
      console.log(ex);
    }
  }

  useEffect(() => {
    qtdToDragRef.current = qtdToDrag;
  }, [qtdToDrag]);

  const sumLeftItemsWeight = () => {
    return leftItems.map(x => x.quantity * x.weight).reduce((partialSum, x) => partialSum + x, 0);
  };

  const getWeightMarkerPercentage = () => {
    return sumLeftItemsWeight() / maxLeftItemsWeight * 100;
  };

  const getWeightMarkerColor = () => {
    const percentage = getWeightMarkerPercentage();
    if (percentage > 90)
      return '#FF6A4D';

    if (percentage > 60)
      return '#decc4b';

    return '#6EB469';
  };

  const handleUseItem = () => {
    try {
      if (Constants.DEBUG)
        console.log('INVENTORY_PAGE_USE_ITEM_SELECT', useItemId, useItemOption.value);
      emitEvent(Constants.INVENTORY_PAGE_USE_ITEM_SELECT, useItemId, useItemOption.value);

      setUseItemId('');
      setUseItemOptions([]);
      setUseItemOption(undefined);
    } catch (ex) {
      console.log(ex);
    }
  }

  useEffect(() => {
    // setLeftTitle('Guilherme Trevizani');
    // setRightTitle('Chão');
    // setLeftItems([
    //   {
    //     name: 'HeavyPistol',
    //     quantity: 1,
    //     slot: 1,
    //     inUse: false,
    //     id: '1',
    //     image: 'https://i.imgur.com/joXQBRy.png',
    //     isUsable: false,
    //     weight: 0.13,
    //   },
    //   {
    //     name: 'Chave de Propriedade',
    //     quantity: 1,
    //     slot: 2,
    //     inUse: false,
    //     id: '2',
    //     image: 'https://i.imgur.com/IEDSv1j.png',
    //     isUsable: false,
    //     weight: 0.13,
    //   },
    //   {
    //     name: 'Dinheiro',
    //     quantity: 18199,
    //     slot: 4,
    //     inUse: false,
    //     id: '3',
    //     image: 'https://i.imgur.com/z5afrcD.png',
    //     isUsable: false,
    //     weight: 0.0013,
    //     isStack: true,
    //   },
    //   {
    //     name: 'Boombox',
    //     quantity: 1,
    //     slot: 5,
    //     inUse: false,
    //     id: '4',
    //     image: 'https://i.imgur.com/hxlP7Ib.png',
    //     isUsable: false,
    //     weight: 0.13,
    //   },
    //   {
    //     name: 'Chave de Veículo',
    //     quantity: 1,
    //     slot: 6,
    //     inUse: false,
    //     id: '5',
    //     image: 'https://i.imgur.com/bkYGL8a.png',
    //     isUsable: false,
    //     weight: 0.13,
    //     extra: 'Fechadura: <strong>13</strong>'
    //   },
    //   {
    //     name: 'Rádio Comunicador',
    //     quantity: 1,
    //     slot: 7,
    //     inUse: false,
    //     id: '6',
    //     image: 'https://i.imgur.com/tTbIBc5.png',
    //     isUsable: false,
    //     weight: 0.13,
    //   },
    //   {
    //     name: 'Celular',
    //     quantity: 1,
    //     slot: 10,
    //     inUse: false,
    //     id: '7',
    //     image: 'https://i.imgur.com/C82Wq1d.png',
    //     isUsable: false,
    //     weight: 0.13,
    //   },
    //   {
    //     name: 'Maconha',
    //     quantity: 754,
    //     slot: 11,
    //     inUse: false,
    //     id: '8',
    //     image: 'https://i.imgur.com/K27oCR6.png',
    //     isUsable: false,
    //     weight: 0.0013,
    //     isStack: true,
    //   },
    //   {
    //     name: 'Cocaína',
    //     quantity: 3,
    //     slot: 12,
    //     inUse: false,
    //     id: '9',
    //     image: 'https://i.imgur.com/GEF2r2J.png',
    //     isUsable: false,
    //     weight: 0.13,
    //     isStack: true,
    //   },
    //   {
    //     name: 'Crack',
    //     quantity: 12,
    //     slot: 14,
    //     inUse: false,
    //     id: '10',
    //     image: 'https://i.imgur.com/SOyB2Ec.png',
    //     isUsable: true,
    //     weight: 0.13,
    //     isStack: true,
    //   },
    //   {
    //     name: 'Heroína',
    //     quantity: 15,
    //     slot: 16,
    //     inUse: false,
    //     id: '11',
    //     image: 'https://i.imgur.com/BT8hk5H.png',
    //     isUsable: false,
    //     weight: 0.13,
    //     isStack: true,
    //   },
    //   {
    //     name: 'MDMA',
    //     quantity: 2,
    //     slot: 22,
    //     inUse: false,
    //     id: '12',
    //     image: 'https://i.imgur.com/rjEZGXP.png',
    //     isUsable: false,
    //     weight: 0.13,
    //     isStack: true,
    //   },
    // ]);
    // setRightItems([
    //   {
    //     name: 'PumpShotgun',
    //     quantity: 1,
    //     slot: 1,
    //     id: '333',
    //     image: 'https://i.imgur.com/joXQBRy.png',
    //     weight: 0.12,
    //   },
    //   {
    //     name: 'Dinheiro',
    //     quantity: 100,
    //     slot: 15,
    //     id: '213412343',
    //     image: 'https://i.imgur.com/z5afrcD.png',
    //     weight: 0.0013,
    //     isStack: true,
    //   },
    // ]);
    // setMaxLeftItemsWeight(30);
    // setLeftSlots(30);
    // setRightSlots(100);
    // setNearbyCharacters([
    //   {
    //     icName: 'Adailton Dumer',
    //     sessionId: 2,
    //   },
    //   {
    //     icName: 'Diego Tonetto',
    //     sessionId: 1,
    //   },
    // ])
    // setUseItemOptions([
    //   {
    //     label: 'Carbine Rifle',
    //     value: '2',
    //   },
    //   {
    //     label: 'Heavy Shotgun',
    //     value: '1',
    //   },
    // ])
    // setUseItemId('1');
    // setModalGiveIsOpen(true);
    configureEvent(Constants.INVENTORY_PAGE_SHOW, (lefTitle: string, leftItemsJson: string, maxLeftItemsWeight: number, leftSlots: number,
      rightTitle: string, rightItemsJson: string, rightSlots: number) => {
      setLeftTitle(lefTitle);
      setLeftItems(JSON.parse(leftItemsJson));
      setMaxLeftItemsWeight(maxLeftItemsWeight);
      setLeftSlots(leftSlots);
      setRightTitle(rightTitle);
      setRightItems(JSON.parse(rightItemsJson));
      setRightSlots(rightSlots);
    });

    configureEvent(Constants.INVENTORY_PAGE_GET_NEARBY_CHARACTERS, (nearbyCharactersJson: string) => {
      const nearbyCharacters = JSON.parse(nearbyCharactersJson);
      if (nearbyCharacters.length === 1) {
        handleGiveItem(nearbyCharacters[0]);
        return;
      }

      setNearbyCharacter(undefined);
      setNearbyCharacters(nearbyCharacters);
      setModalGiveIsOpen(true);
    });

    configureEvent(Constants.INVENTORY_PAGE_USE_ITEM_SELECT, (id: string, optionsJson: string) => {
      setUseItemId(id);
      setUseItemOption(undefined);
      setUseItemOptions(JSON.parse(optionsJson));
    });

    document.addEventListener('keydown', keyDown);
    emitEvent(Constants.INVENTORY_PAGE_SHOW);

    return () => {
      document.removeEventListener('keydown', keyDown);
    };
  }, []);

  const keyDown = (e: KeyboardEvent) => {
    if (e.key.toUpperCase() === 'ESCAPE' || e.key.toUpperCase() === 'I') {
      if (modalGiveIsOpenRef.current)
        setModalGiveIsOpen(false);
      else
        emitEvent(Constants.INVENTORY_PAGE_CLOSE);
    }
  };

  useEffect(() => {
    modalGiveIsOpenRef.current = modalGiveIsOpen;
  }, [modalGiveIsOpen]);

  return <div id='inventoryPage'>
    <DragDropContext onDragStart={handleDragItem} onDragEnd={handleDrop}>
      <div className='mainContainer'>
        <div className="subContainer">
          <div className='inventoryCard'>
            <div className='titleLine'>
              <span className='inventoryCardTitle'>{leftTitle}</span>
              <div className='weightTextContainer'>
                <span className='weightText bold'>{formatValue(sumLeftItemsWeight(), 2)}</span>
                <span className='weightText'> / {formatValue(maxLeftItemsWeight, 2)} kg</span>
              </div>
            </div>
            <div className='weightContainer'>
              <div className='wheightIndicator'>
                <div className='inner' style={{ width: `${getWeightMarkerPercentage()}%`, backgroundColor: getWeightMarkerColor() }} />
              </div>
            </div>
            <div className='inventoryItems'>
              {renderItems('left')}
            </div>
          </div>
          <div className='centerSpace'>
            <div className='centerSpaceInner'>
              <div className='centerOptionLg'>
                <input type="number" placeholder='QTD' className='qtdInput' min={0} onChange={(ev) => setQtdToDrag(Number(ev.target.value))} value={qtdToDrag} />
              </div>
              <Droppable droppableId={'give'}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className='centerOptionLg'>
                    {t('give')}
                  </div>
                )}
              </Droppable>
            </div>
            <div className="centerSpaceInner">
              <div className='centerOptionDescription'>
                <span>[{t('leftMouse')}]</span>
                <span>{t('moveItem')}</span>
              </div>
              <div className='centerOptionDescription'>
                <span>[{t('rightMouse')}]</span>
                <span>{t('useEquipItem')}</span>
              </div>
            </div>
          </div>
          <div className='inventoryCard'>
            <span className='inventoryCardTitle'>{rightTitle}</span>
            <div style={{ padding: '4px' }} />
            <div className='inventoryItems'>
              {renderItems('right')}
            </div>
          </div>
        </div>
      </div>
      {modalGiveIsOpen &&
        <div className={'modalWrapper show'} onClick={() => setModalGiveIsOpen(false)}>
          <div className='modalCard' onClick={(ev) => ev.stopPropagation()}>
            <div className='modalTop'>
              <span>{t('give')}</span>
              <CloseOutlined onClick={() => setModalGiveIsOpen(false)} />
            </div>
            <hr style={{ color: 'white', margin: 0 }} />
            <div className="modalBody">
              <div className='modalCharacterList'>
                {nearbyCharacters.map((item, i) => {
                  return <div key={i} className='characterSelectItem'>
                    <input type='radio' id={'radio-' + i} onClick={() => setNearbyCharacter(item)} checked={nearbyCharacter?.sessionId === item.sessionId} />
                    <div className='characterSelectItemContent'>
                      <label htmlFor={'radio-' + i}>
                        {item.icName}
                      </label>
                    </div>
                  </div>
                })}
              </div>
            </div>
            <hr style={{ color: 'white', margin: 0 }} />
            <div className='modalBottom'>
              <div className='buttons'>
                <button disabled={!nearbyCharacter} onClick={() => handleGiveItem(nearbyCharacter)}>{t('give')}</button>
              </div>
            </div>
          </div>
        </div>
      }
      {useItemId &&
        <div className={'modalWrapper show'} onClick={() => setUseItemId('')}>
          <div className='modalCard' onClick={(ev) => ev.stopPropagation()}>
            <div className='modalTop'>
              <span>{t('useItem')}</span>
              <CloseOutlined onClick={() => setUseItemId('')} />
            </div>
            <hr style={{ color: 'white', margin: 0 }} />
            <div className="modalBody">
              <div className='modalCharacterList'>
                {useItemOptions.map((item, i) => {
                  return <div key={i} className='characterSelectItem'>
                    <input type='radio' id={'radio-' + i} onClick={() => setUseItemOption(item)} checked={useItemOption === item} />
                    <div className='characterSelectItemContent'>
                      <label htmlFor={'radio-' + i}>
                        {item.label}
                      </label>
                    </div>
                  </div>
                })}
              </div>
            </div>
            <hr style={{ color: 'white', margin: 0 }} />
            <div className='modalBottom'>
              <div className='buttons'>
                <button disabled={!useItemOption} onClick={handleUseItem}>{t('useItem')}</button>
              </div>
            </div>
          </div>
        </div>
      }
    </DragDropContext>
  </div>
};

export default InventoryPage;