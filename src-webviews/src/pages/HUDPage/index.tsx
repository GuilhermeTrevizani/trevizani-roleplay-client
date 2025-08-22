import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { configureEvent, emitEvent, formatValue } from '../../services/util';
import './index.scss'
import logo from '../../assets/logo.png'

interface Minimap {
  bottom: number;
  right: number;
}

const HUDPage = () => {
  const [fuel, setFuel] = useState(0);
  const [direction, setDirection] = useState('');
  const [street, setStreet] = useState('');
  const [speed, setSpeed] = useState(0);
  const [cruiseControl, setCruiseControl] = useState(false);
  const [inVehicle, setInVehicle] = useState(false);
  const [health, setHealth] = useState(0);
  const [armor, setArmor] = useState(0);
  const [playerCount, setPlayerCount] = useState(0);
  const [showWeapon, setShowWeapon] = useState(false);
  const [ammoInClip, setAmmoInClip] = useState(0);
  const [totalAmmo, setTotalAmmo] = useState(0);
  const [firingMode, setFiringMode] = useState('');
  const [minimap, setMinimap] = useState<Minimap>({
    bottom: 0,
    right: 0,
  });
  const [money, setMoney] = useState(0);
  const [bank, setBank] = useState(0);
  const [adminDuty, setAdminDuty] = useState(false);
  const [driftMode, setDriftMode] = useState(false);

  useEffect(() => {
    configureEvent(Constants.HUD_PAGE_UPDATE_DIRECTIONS, (direction: string, street: string) => {
      setDirection(direction);
      setStreet(street);
    });

    configureEvent(Constants.HUD_PAGE_UPDATE_VEHICLE_INFO, (fuel: number, speed: number, cruiseControl: boolean) => {
      setFuel(fuel);
      setSpeed(speed);
      setCruiseControl(cruiseControl);
    });

    configureEvent(Constants.HUD_PAGE_UPDATE_IN_VEHICLE, (state: boolean) => {
      setInVehicle(state);
    });

    configureEvent(Constants.HUD_PAGE_UPDATE_HEALTH_ARMOR, (health: number, armor: number) => {
      setHealth(health > 100 ? health - 100 : health);
      setArmor(armor);
    });

    configureEvent(Constants.HUD_PAGE_UPDATE_PLAYER_COUNT, (playerCount: number) => {
      setPlayerCount(playerCount);
    });

    configureEvent(Constants.HUD_PAGE_UPDATE_AMMO, (showWeapon: boolean, ammoInClip: number, totalAmmo: number) => {
      setShowWeapon(showWeapon);
      setAmmoInClip(ammoInClip);
      setTotalAmmo(totalAmmo - ammoInClip);
    });

    configureEvent(Constants.HUD_PAGE_UPDATE_FIRING_MODE, (firingMode: string) => {
      setFiringMode(firingMode);
    });

    configureEvent(Constants.HUD_PAGE_UPDATE_MINIMAP, (minimapJson: string) => {
      const minimap = JSON.parse(minimapJson);
      setMinimap({
        bottom: minimap.bottom,
        right: minimap.right + 15,
      });
    });

    configureEvent(Constants.HUD_PAGE_UPDATE_MONEY, (value: number) => {
      setMoney(value);
    });

    configureEvent(Constants.HUD_PAGE_UPDATE_BANK, (value: number) => {
      setBank(value);
    });

    configureEvent(Constants.HUD_PAGE_UPDATE_DRIFT_MODE, (state: boolean) => {
      setDriftMode(state);
    });

    configureEvent(Constants.HUD_PAGE_UPDATE_ADMIN_DUTY, (state: boolean) => {
      setAdminDuty(state);
    });

    emitEvent(Constants.HUD_PAGE_SHOW);
  }, []);

  const getFuelColor = () => {
    if (fuel > 50)
      return 'lime';

    if (fuel > 20)
      return 'yellow';

    return 'red';
  };

  return <div id='hud'>
    {minimap.bottom > 0 && <div className='leftBottom' style={{ top: `${minimap.bottom}px`, left: `${minimap.right}px` }}>
      {inVehicle && <div className='bottomFirstRow'>
        <div className='odometer'>
          <div className='odometerIcon'><i className='fa fa-gauge' /></div>
          <div className='odometerInfo'>{speed.toFixed(0)} {t('speedometer')}{cruiseControl && <><span> • </span><span style={{ color: 'lime' }}> {t('cruiseControl')}</span></>}{driftMode && <><span> • </span><span style={{ color: 'lime' }}> {t('driftMode')}</span></>}</div>
        </div>
        {fuel != null && <div className='fuelmeter'>
          <div className='fuelmeterIcon'><i className='fa fa-gas-pump' /></div>
          <div className='fuelmeterInfo'><span style={{ color: getFuelColor() }}>{fuel}%</span></div>
        </div>}
      </div>}
      <div className='bottomSecondRow'>
        <div className='location'>
          <div className='locationIcon'>{direction}</div>
          <div className='locationInfo'>{street}</div>
        </div>
      </div>
    </div>}

    <div className='rightTop'>
      <div className='topFirstRow'>
        {adminDuty && <div className='admin'>
          <div className='adminIcon'><i className="fa fa-gavel"></i></div>
          <div className='adminInfo'>{t('adminDuty')}</div>
        </div>}
        <div className='server'>
          <div className='serverIcon'><i className='fa fa-user' /></div>
          <div className='serverInfo'>{playerCount}/{Constants.MAX_PLAYERS}</div>
        </div>
      </div>

      <div className='topSecondRow'>
        <div className='health'>
          <div className='healthIcon'><i className='fa fa-heart' /></div>
          <div className='healthInfo'>{health}</div>
        </div>
        <div className='armor'>
          <div className='armorIcon'><i className='fa fa-shield' /></div>
          <div className='armorInfo'>{armor}</div>
        </div>
        <div className='wallet'>
          <div className='walletIcon'><i className='fa fa-wallet' /></div>
          <div className='walletInfo'>${formatValue(money)}</div>
        </div>
        <div className='bank'>
          <div className='bankIcon'><i className='fa fa-money-check-dollar' /></div>
          <div className='bankInfo'>${formatValue(bank)}</div>
        </div>
      </div>

      {showWeapon && <div className='topThirdRow'>
        <div className='firemode'>
          <div className='firemodeIcon'><i className='fa fa-shuffle' /></div>
          <div className='firemodeInfo'>{firingMode}</div>
        </div>
        <div className='ammo'>
          <div className='ammoIcon'><i className='fa fa-gun' /></div>
          <div className='ammoInfo'>{ammoInClip}/{totalAmmo}</div>
        </div>
      </div>}
    </div>

    <div className='rightBottom'>
      <img src={logo} className='logo' />
    </div>
  </div>
};

export default HUDPage;