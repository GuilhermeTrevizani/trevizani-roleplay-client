import { ColorPicker, Tag } from 'antd';
import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { UserPremium } from '../../types/UserPremium';
import { configureEvent, emitEvent, formatValue, hexToRgb, removeAccents } from '../../services/util';
import './style.scss';

interface DealershipItem {
  model: string;
  price: number;
  restriction: UserPremium;
};

const DealershipPage = () => {
  const [loading, setLoading] = useState(true);
  const [originalItems, setOriginalItems] = useState<DealershipItem[]>([]);
  const [items, setItems] = useState<DealershipItem[]>([]);
  const [title, setTitle] = useState('');
  const [search, setSearch] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#000000');
  const [secondaryColor, setSecondaryColor] = useState('#000000');
  const [selectedItem, setSelectedItem] = useState<DealershipItem>();

  useEffect(() => {
    // setTitle('Deluxe Motorsport');
    // setOriginalItems([{
    //   model: 'ADDER',
    //   price: 15231,
    //   restriction: UserPremium.None,
    // }, {
    //   model: 'ADDER 2',
    //   price: 15232,
    //   restriction: UserPremium.Bronze,
    // }, {
    //   model: 'ADDER 3',
    //   price: 15233,
    //   restriction: UserPremium.Silver,
    // }, {
    //   model: 'ADDER 4',
    //   price: 15234,
    //   restriction: UserPremium.Gold,
    // }]);
    //setLoading(false);
    configureEvent(Constants.DEALERSHIP_PAGE_SHOW, (title: string, itemsJson: string) => {
      const items = JSON.parse(itemsJson);
      setTitle(title);
      setOriginalItems(items);
      setSelectedItem(items[0]);
      setPrimaryColor('#000000');
      setSecondaryColor('#000000');
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    document.addEventListener('keydown', keyDown);

    emitEvent(Constants.DEALERSHIP_PAGE_SHOW);

    return () => {
      document.removeEventListener('keydown', keyDown);
    };
  }, []);

  const keyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape')
      emitEvent(Constants.DEALERSHIP_PAGE_CLOSE);
  };

  const testDrive = () => {
    setLoading(true);
    const color1 = hexToRgb(primaryColor);
    const color2 = hexToRgb(secondaryColor);
    emitEvent(Constants.DEALERSHIP_PAGE_TEST_DRIVE, selectedItem.model, color1.r, color1.g, color1.b, color2.r, color2.g, color2.b);
  };

  const buy = () => {
    setLoading(true);
    const color1 = hexToRgb(primaryColor);
    const color2 = hexToRgb(secondaryColor);
    emitEvent(Constants.DEALERSHIP_PAGE_CONFIRM, selectedItem.model, color1.r, color1.g, color1.b, color2.r, color2.g, color2.b);
  };

  useEffect(() => {
    if (search == '') {
      setItems(originalItems);
      return;
    }

    const newSearch = removeAccents(search);
    const filteredItems = originalItems.filter(x =>
      removeAccents(x.model).includes(newSearch)
    );
    setItems(filteredItems);
  }, [search, originalItems]);

  const renderRestriction = () => {
    if (selectedItem.restriction === UserPremium.Gold)
      return <Tag color={'#f1c40f'} style={{ margin: 0 }}>{t('gold')}</Tag>

    if (selectedItem.restriction === UserPremium.Silver)
      return <Tag color={'#607d8b'} style={{ margin: 0 }}>{t('silver')}</Tag>

    if (selectedItem.restriction === UserPremium.Bronze)
      return <Tag color={'#a84300'} style={{ margin: 0 }}>{t('bronze')}</Tag>

    return <>N/A</>
  };

  useEffect(() => {
    if (!selectedItem)
      return;

    const color1 = hexToRgb(primaryColor);
    const color2 = hexToRgb(secondaryColor);
    emitEvent(Constants.DEALERSHIP_PAGE_SELECT, selectedItem.model, color1.r, color1.g, color1.b, color2.r, color2.g, color2.b);
  }, [selectedItem, primaryColor, secondaryColor]);

  return <div id="dealership">
    <div className="cars">
      <div className="cars__wrapper">
        <div className="cars__col menu">
          <div className="cars-nav">
            <div className="cars-nav__title title">{title}</div>
            <div className="cars-nav__find-box">
              <div className="cars-nav__search">
                <input placeholder={t('searchHere')} value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <div className="cars-nav__items">
              {
                items.map(item => {
                  return (
                    <div className="cars-nav__item" key={item.model} onClick={() => setSelectedItem(item)}>
                      <div className="cars-nav__item--inner">{item.model}</div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
        {selectedItem && <div className="cars__col params">
          <div v-if="isCarDetailsVisible" className="cars-params">
            <div className="cars-params__info info">
              <div className="info__head">
                <div className="info__title title">
                  {selectedItem.model}
                </div>
              </div>
              <div className="info__params">
                <div className="info__param">
                  <div className="info__param__text">
                    {t('value')}
                    <span className="info__param__value">${formatValue(selectedItem.price)}</span>
                  </div>
                </div>
                <div className="info__param">
                  <div className="info__param__text">
                    {t('restriction')}
                    <span className="info__param__value">{renderRestriction()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="cars-params__colors colors">
              <div className="colors__group">
                <div className="colors__title">{t('primaryColor')}</div>
                <div className="colors__items">
                  <ColorPicker size='large' disabledAlpha value={primaryColor} onChange={(e) => setPrimaryColor(e.toHexString())} />
                </div>
              </div>
              <div className="colors__group">
                <div className="colors__title">{t('secondaryColor')}</div>
                <div className="colors__items">
                  <ColorPicker size='large' disabledAlpha value={secondaryColor} onChange={(e) => setSecondaryColor(e.toHexString())} />
                </div>
              </div>
            </div>
            <div className="cars-params__bottom">
              <button className="cars-params__price" onClick={testDrive} disabled={loading}>
                {t('testDrive')}
              </button>
              <button className="cars-params__buy" onClick={buy} disabled={loading}>
                {t('buy')}
              </button>
            </div>
          </div>
        </div>}
      </div>
    </div>
  </div>
};

export default DealershipPage;