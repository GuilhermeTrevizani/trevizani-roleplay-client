import { Constants } from '../../../../src/base/constants';
import { useEffect, useRef, useState } from 'react';
import { configureEvent, emitEvent, formatValue, removeAccents } from '../../services/util';
import { t } from 'i18next';
import './index.scss';
import { Popconfirm } from 'antd';
import { stringFormat } from '../../i18n';
import { LeftOutlined } from '@ant-design/icons';

interface PropertyFurniture {
  id: string;
  name: string;
  distance: number;
  value: number;
  useSlot: boolean;
};

interface Furniture {
  id: string;
  category: string;
  name: string;
  model: string;
  value: number;
  subcategory: string;
};

interface Category {
  name: string;
  subcategories: Subcategory[];
};

interface Subcategory {
  name: string;
};

interface Chunk {
  chunk: string;
  order: number;
};

const PropertyFurnituresPage = () => {
  const [loading, setLoading] = useState(true);
  const [maxFurnitures, setMaxFurnitures] = useState(0);
  const [originalPropertyFurnitures, setOriginalPropertyFurnitures] = useState<PropertyFurniture[]>([]);
  const [propertyFurnitures, setPropertyFurnitures] = useState<PropertyFurniture[]>([]);
  const [searchPropertyFurnitures, setSearchPropertyFurnitures] = useState('');
  const [originalFurnitures, setOriginalFurnitures] = useState<Furniture[]>([]);
  const [furnitures, setFurnitures] = useState<Furniture[]>([]);
  const [searchFurnitures, setSearchFurnitures] = useState('');
  const [isEditing, setIsEditing] = useState(true);
  const canCloseRef = useRef(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  let timeout: NodeJS.Timeout = undefined;
  let chunks: Chunk[] = [];

  useEffect(() => {
    // setLoading(false);
    // setMaxFurnitures(300);
    // setOriginalPropertyFurnitures([{
    //   id: '1',
    //   distance: 3.232,
    //   name: 'Nome',
    //   value: 322,
    // }])
    // setOriginalFurnitures([{
    //   category: 'Categoria 1',
    //   subcategory: 'Subcategoria 1',
    //   id: '1',
    //   model: 'model',
    //   name: 'Name 1',
    //   value: 12
    // }, {
    //   category: 'Categoria 1',
    //   subcategory: 'Subcategoria 2',
    //   id: '1',
    //   model: 'model',
    //   name: 'Name 2',
    //   value: 123
    // }, {
    //   category: 'Categoria 2',
    //   subcategory: 'Subcategoria 3',
    //   id: '1',
    //   model: 'model',
    //   name: 'Name 3',
    //   value: 434
    // }])
    // setCategories([
    //   {
    //     name: 'Categoria 1',
    //     subcategories:
    //       [
    //         {
    //           name: 'Subcategoria 1',
    //         },
    //         {
    //           name: 'Subcategoria 2'
    //         }
    //       ],
    //   },
    //   {
    //     name: 'Categoria 2',
    //     subcategories: [
    //       {
    //         name: 'Subcategoria 3',
    //       }
    //     ],
    //   }
    // ]);
    configureEvent(Constants.PROPERTY_FURNITURES_PAGE_SHOW, (maxFurnitures: number, categoriesJson: string, chunk: string, order: number, length: number) => {
      chunks.push({ chunk, order });
      if (chunks.length != length)
        return;

      const propertyFurnituresJson = chunks.sort((a, b) => a.order - b.order).map(x => x.chunk).join('');
      chunks = [];
      setMaxFurnitures(maxFurnitures);
      setOriginalPropertyFurnitures(JSON.parse(propertyFurnituresJson));
      setCategories(JSON.parse(categoriesJson));
      setLoading(false);
    });

    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });

    configureEvent(Constants.PROPERTY_FURNITURES_PAGE_SET_CAN_CLOSE, (canClose: boolean) => {
      if (timeout) {
        clearTimeout(timeout);
        timeout = undefined;
      }

      if (canClose) {
        timeout = setTimeout(() => {
          canCloseRef.current = canClose;
        }, 1000);
        return;
      }

      canCloseRef.current = canClose;
    });

    configureEvent(Constants.PROPERTY_FURNITURES_PAGE_LIST_FURNITURES, (furnituresJson: string) => {
      setOriginalFurnitures(JSON.parse(furnituresJson));
      setLoading(false);
    });

    document.addEventListener('keydown', keyDown);

    emitEvent(Constants.PROPERTY_FURNITURES_PAGE_SHOW);

    return () => {
      document.removeEventListener('keydown', keyDown);
    };
  }, []);

  const keyDown = (e: KeyboardEvent) => {
    if (e.key.toUpperCase() === 'ESCAPE' && canCloseRef.current)
      handleCancel();
  };

  const edit = (id: string) => {
    setLoading(true);
    emitEvent(Constants.PROPERTY_FURNITURES_PAGE_EDIT, id);
  }

  const copy = (id: string) => {
    setLoading(true);
    emitEvent(Constants.PROPERTY_FURNITURES_PAGE_COPY, id);
  }

  const sell = (id: string) => {
    setLoading(true);
    emitEvent(Constants.PROPERTY_FURNITURES_PAGE_SELL, id);
  }

  const handleCancel = () => {
    emitEvent(Constants.PROPERTY_FURNITURES_PAGE_CLOSE);
  };

  const buy = (id: string) => {
    setLoading(true);
    emitEvent(Constants.PROPERTY_FURNITURES_PAGE_BUY, id);
  }

  const preview = (model: string) => {
    setLoading(true);
    emitEvent(Constants.PROPERTY_FURNITURES_PAGE_PREVIEW, model);
  };

  useEffect(() => {
    if (searchFurnitures == '') {
      setFurnitures(originalFurnitures);
      return;
    }

    const newSearch = removeAccents(searchFurnitures);
    const filteredItems = originalFurnitures.filter(x =>
      removeAccents(x.name).includes(newSearch)
    );
    setFurnitures(filteredItems);
  }, [searchFurnitures, originalFurnitures]);

  useEffect(() => {
    if (searchPropertyFurnitures == '') {
      setPropertyFurnitures(originalPropertyFurnitures);
      return;
    }

    const newSearch = removeAccents(searchPropertyFurnitures);
    const filteredItems = originalPropertyFurnitures.filter(x =>
      removeAccents(x.name).includes(newSearch)
    );
    setPropertyFurnitures(filteredItems);
  }, [searchPropertyFurnitures, originalPropertyFurnitures]);

  const handleBack = () => {
    if (originalFurnitures.length > 0)
      setOriginalFurnitures([]);
    else if (selectedCategory)
      setSelectedCategory(undefined);
  };

  const selectSubcategory = (subcategory: string) => {
    setLoading(true);
    emitEvent(Constants.PROPERTY_FURNITURES_PAGE_LIST_FURNITURES, selectedCategory.name, subcategory);
  };

  return <div id='propertyFurniture'>
    <div className='tabs'>
      <button type='button' disabled={loading} onClick={() => setIsEditing(true)} className={isEditing ? 'active' : ''}>{t('edit')}</button>
      <button type='button' disabled={loading} onClick={() => setIsEditing(false)} className={!isEditing ? 'active' : ''}>{t('buy')}</button>
    </div>
    {isEditing && <>
      <div className='header'>
        <div className='title'>
          {t('furnitures')} ({originalPropertyFurnitures.filter(x => x.useSlot).length}/{maxFurnitures})
        </div>
      </div>
      <input type='text' placeholder={t('searchHere')} disabled={loading}
        value={searchPropertyFurnitures} onChange={(e) => setSearchPropertyFurnitures(e.target.value)} />
      <div className='list'>
        <table>
          <thead>
            <tr>
              <th style={{ width: '100%' }}></th>
              <th style={{ whiteSpace: 'nowrap' }}></th>
              <th style={{ whiteSpace: 'nowrap' }}></th>
              <th style={{ whiteSpace: 'nowrap' }}></th>
            </tr>
          </thead>
          <tbody>
            {propertyFurnitures.map((item) => {
              return (
                <tr>
                  <td>{item.name} ({formatValue(item.distance, 2)}m)</td>
                  <td><button disabled={loading} onClick={() => copy(item.id)}><span className='fa fa-copy' /></button></td>
                  <td><button disabled={loading} onClick={() => edit(item.id)}><span className='fa fa-pencil' /></button></td>
                  <td>
                    <Popconfirm
                      title={t('sell')}
                      description={stringFormat(t('sellFurnitureConfirm'), item.name, formatValue(item.value))}
                      onConfirm={() => sell(item.id)}
                      okText={t('yes')}
                      cancelText={t('no')}
                      disabled={loading}
                    >
                      <button><span className='fa fa-dollar' /></button>
                    </Popconfirm>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>}
    {!isEditing && <>
      <div className='header'>
        <div className='title'>
          {(originalFurnitures.length > 0 || selectedCategory) && <LeftOutlined disabled={loading} onClick={handleBack} />}
          {t('furnitureStore')}
        </div>
      </div>
      {originalFurnitures.length === 0 && !selectedCategory && <>
        <div className='list'>
          {categories.map((category) => {
            return (
              <>
                <span style={{ marginLeft: '5px' }} onClick={() => setSelectedCategory(category)}>
                  {category.name}
                </span>
                <br />
              </>
            )
          })}
        </div>
      </>}
      {originalFurnitures.length === 0 && selectedCategory && <>
        <div className='list'>
          {selectedCategory.subcategories.map((subcategory) => {
            return (
              <>
                <span style={{ marginLeft: '5px' }} onClick={() => selectSubcategory(subcategory.name)}>
                  {subcategory.name}
                </span>
                <br />
              </>
            )
          })}
        </div>
      </>}
      {originalFurnitures.length > 0 && <>
        <input type='text' placeholder={t('searchHere')}
          value={searchFurnitures} onChange={(e) => setSearchFurnitures(e.target.value)} />
        <div className='list'>
          <table>
            <thead>
              <tr>
                <th style={{ width: '100%' }}></th>
                <th style={{ whiteSpace: 'nowrap' }}></th>
                <th style={{ whiteSpace: 'nowrap' }}></th>
                <th style={{ whiteSpace: 'nowrap' }}></th>
              </tr>
            </thead>
            <tbody>
              {furnitures.map((item) => {
                return (
                  <tr>
                    <td>{item.name}</td>
                    <td className='price'>${formatValue(item.value)}</td>
                    <td><button onClick={() => preview(item.model)} disabled={loading}><span className='fa fa-eye' /></button></td>
                    <td><button onClick={() => buy(item.id)} disabled={loading}><span className='fa fa-shopping-cart' /></button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </>}
    </>}
  </div>
};

export default PropertyFurnituresPage;