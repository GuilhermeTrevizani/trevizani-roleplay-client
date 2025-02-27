import { useEffect, useState } from 'react';
import { Constants } from '../../../../src/base/constants';
import { t } from 'i18next';
import { configureEvent, emitEvent, formatDateTime, formatValue } from '../../services/util';
import './index.scss';
import { Popover } from 'antd';
import moment from 'moment';

interface CharacterWound {
  date: Date;
  weapon: string;
  damage: number;
  bodyPart: string;
  author?: string;
  distance?: number;
};

const CharacterWoundsPage = () => {
  const [title, setTitle] = useState('');
  const [wounds, setWounds] = useState<CharacterWound[]>([]);
  const [staffVision, setStaffVision] = useState(false);

  useEffect(() => {
    // setTitle('Coral Teste');
    // setStaffVision(true);
    // const plys = [];
    // for (let index = 0; index < 100; index++) {
    //   plys.push({
    //     damage: index + 1,
    //     date: '10 minutos atrás',
    //     weapon: 'Fuzil de Assalto',
    //     bodyPart: 'Cabeça',
    //     author: 'Guilherme Trevizani',
    //     distance: 13.53,
    //   })
    // }
    // setWounds(plys);
    configureEvent(
      Constants.CHARACTER_WOUNDS_PAGE_SHOW,
      (name: string, woundsJson: string, staffVision: boolean) => {
        setTitle(name);
        setWounds(JSON.parse(woundsJson));
        setStaffVision(staffVision);
      }
    );

    document.addEventListener('keydown', keyDown);
    emitEvent(Constants.CHARACTER_WOUNDS_PAGE_SHOW);

    return () => {
      document.removeEventListener('keydown', keyDown);
    };
  }, []);

  const keyDown = (e: KeyboardEvent) => {
    if (e.key.toUpperCase() === 'ESCAPE')
      handleCancel();
  };

  const handleCancel = () => {
    emitEvent(Constants.CHARACTER_WOUNDS_PAGE_CLOSE);
  };

  return (
    <div id="woundsMenu">
      <div className="woundsHeader">
        <span>
          <i className="fa fa-user-injured"></i>&nbsp;&nbsp;{t('woundsOf')} <strong>{title}</strong>
        </span>
        <button className="closeButton" onClick={handleCancel}>
          <i className="fa fa-x"></i>
        </button>
      </div>
      <div className="woundsBody">
        <div className="woundsTable">
          <table>
            <thead>
              <tr>
                <th style={{ whiteSpace: 'nowrap' }}>{t('damage').toUpperCase()}</th>
                <th style={{ width: '50%' }}>{t('bodyPart').toUpperCase()}</th>
                <th style={{ width: '50%' }}>{t('weapon').toUpperCase()}</th>
                <th style={{ whiteSpace: 'nowrap' }}>{t('date').toUpperCase()}</th>
              </tr>
            </thead>
            <tbody>
              {wounds.map((wound) => {
                return (
                  <>
                    {staffVision && <Popover content={<>
                      <strong>{t('author')}:</strong> {wound.author}
                      <br />
                      <strong>{t('distance')}:</strong> {formatValue(wound.distance, 2)}m
                      <br />
                      <strong>{t('date')}:</strong> {formatDateTime(wound.date)}
                    </>} title={t('administrativeInformations')}>
                      <tr>
                        <td style={{ whiteSpace: 'nowrap', }}>{wound.damage}</td>
                        <td style={{ width: '50%' }}>{wound.bodyPart}</td>
                        <td style={{ width: '50%' }}>{wound.weapon}</td>
                        <td style={{ whiteSpace: 'nowrap' }}>{moment(wound.date).fromNow()}</td>
                      </tr>
                    </Popover>}

                    {!staffVision && <tr>
                      <td style={{ whiteSpace: 'nowrap', }}>{wound.damage}</td>
                      <td style={{ width: '50%' }}>{wound.bodyPart}</td>
                      <td style={{ width: '50%' }}>{wound.weapon}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{moment(wound.date).fromNow()}</td>
                    </tr>}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CharacterWoundsPage;