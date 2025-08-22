import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import './style.scss';
import { configureEvent, emitEvent } from '../../services/util';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);

  const requestDiscordToken = () => {
    setLoading(true);
    emitEvent(Constants.LOGIN_REQUEST_DISCORD_TOKEN);
  };

  useEffect(() => {
    configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
      setLoading(false);
    });
  }, []);

  return (
    <div className='bgPageCentered'>
      <div className='card' hidden={loading}>
        <div className='card-body fullPadding'>
          <div className='card-logo'>
            <div className="header-logo" />
          </div>
          <div className='card-content'>
            <div>
              {t('discordPlayTip')}
            </div>
            <div className='card-bottom'>
              <button className='primaryButton fw' onClick={requestDiscordToken}>
                {t('loginWithDiscord')}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='loadingContainer' hidden={!loading}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden"></span>
        </div><br />
        <span>{t('connectingWithDiscord')}</span>
      </div>
    </div>
  )
};

export default LoginPage;