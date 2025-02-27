import { useEffect, useState } from 'react';
import { Constants } from '../../../../src/base/constants';
import { Popover } from 'antd';
import { t } from 'i18next';
import { configureEvent, emitEvent, formatDateTime, formatValue } from '../../services/util';
import '../CharacterWoundsPage/index.scss';
import moment from 'moment';

interface VehicleDamage {
  date: Date,
  weapon: string;
  bodyHealthDamage: number;
  additionalBodyHealthDamage: number;
  engineHealthDamage: number;
  petrolTankDamage: number;
  author?: string;
  distance?: number;
};

const VehicleDamagesPage = () => {
  const [title, setTitle] = useState('');
  const [damages, setDamages] = useState<VehicleDamage[]>([]);
  const [staffVision, setStaffVision] = useState(false);

  useEffect(() => {
    // setTitle('ADDER ABC123');
    // setDamages([{
    //   additionalBodyHealthDamage: 1,
    //   bodyHealthDamage: 2,
    //   engineHealthDamage: 3,
    //   date: new Date(),
    //   petrolTankDamage: 4,
    //   weapon: 'Weapon',
    //   author: 'Author',
    //   distance: 32.3122,
    // }]);
    // setStaffVision(true);
    configureEvent(Constants.VEHICLE_DAMAGES_PAGE_SHOW, (name: string, damagesJson: string, staffVision: boolean) => {
      setTitle(name);
      setDamages(JSON.parse(damagesJson));
      setStaffVision(staffVision);
    });

    document.addEventListener('keydown', keyDown);
    emitEvent(Constants.VEHICLE_DAMAGES_PAGE_SHOW);

    return () => {
      document.removeEventListener('keydown', keyDown);
    };
  }, []);

  const keyDown = (e: KeyboardEvent) => {
    if (e.key.toUpperCase() === 'ESCAPE')
      handleCancel();
  };

  const handleCancel = () => {
    emitEvent(Constants.VEHICLE_DAMAGES_PAGE_CLOSE);
  };

  return (
    <div id="woundsMenu">
      <div className="woundsHeader">
        <span>
          <i className="fa fa-user-injured"></i>&nbsp;&nbsp;{t('vehiclesDamageOf')} <strong>{title}</strong>
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
                <th style={{ whiteSpace: 'nowrap' }}>{t('engine').toUpperCase()}</th>
                <th style={{ width: 'nowrap' }}>{t('vehicleBody').toUpperCase()}</th>
                <th style={{ width: '100%' }}>{t('weapon').toUpperCase()}</th>
                <th style={{ whiteSpace: 'nowrap' }}>{t('date').toUpperCase()}</th>
              </tr>
            </thead>
            <tbody>
              {damages.map((damage) => {
                return (
                  <Popover content={<>
                    <strong>{t('additionalBodyHealthDamage')}:</strong> {damage.additionalBodyHealthDamage}
                    <br />
                    <strong>{t('petrolTankDamage')}:</strong> {damage.petrolTankDamage}
                    {staffVision && <>
                      <br />
                      <strong>{t('date')}:</strong> {formatDateTime(damage.date)}
                      <br />
                      <strong>{t('author')}:</strong> {damage.author}
                      <br />
                      <strong>{t('distance')}:</strong> {formatValue(damage.distance, 2)}m
                    </>}
                  </>} title={t('informations')}>
                    <tr>
                      <td style={{ whiteSpace: 'nowrap', }}>{damage.engineHealthDamage}</td>
                      <td style={{ whiteSpace: 'nowrap', }}>{damage.bodyHealthDamage}</td>
                      <td style={{ width: '100%' }}>{damage.weapon}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{moment(damage.date).fromNow()}</td>
                    </tr>
                  </Popover>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VehicleDamagesPage;