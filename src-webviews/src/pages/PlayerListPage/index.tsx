import { useEffect, useState } from 'react';
import { Constants } from '../../../../src/base/constants';
import { t } from 'i18next';
import { configureEvent, emitEvent } from '../../services/util';
import './index.scss';

interface Player {
  id: number;
  name: string;
  ping: number;
};

interface Footer {
  police: number;
  fire: number;
  mechanic: number;
  taxiDriver: number;
}

const PlayerListPage = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [footer, setFooter] = useState<Footer>({
    police: 0,
    fire: 0,
    mechanic: 0,
    taxiDriver: 0,
  });

  useEffect(() => {
    // setFooter({ // INICIO TESTE LISTA
    //   fire: 6,
    //   mechanic: 15,
    //   police: 18,
    //   taxiDriver: 3
    // })
    // const plys = [];
    // for (let index = 0; index < 100; index++) {
    //   plys.push({
    //     id: index,
    //     ping: 32,
    //     name: 'Nome Sobrenome ' + index,
    //   })
    // }
    // setPlayers(plys) // FINAL TESTE LISTA
    configureEvent(Constants.PLAYER_LIST_PAGE_SHOW, (playersJson: string, footerJson: string) => {
      setPlayers(JSON.parse(playersJson));
      setFooter(JSON.parse(footerJson));
    });

    document.addEventListener('keydown', keyDown);
    emitEvent(Constants.PLAYER_LIST_PAGE_SHOW);

    return () => {
      document.removeEventListener('keydown', keyDown);
    };
  }, []);

  const keyDown = (e: KeyboardEvent) => {
    if (e.key.toUpperCase() === 'O' || e.key.toUpperCase() === 'ESCAPE')
      emitEvent(Constants.PLAYER_LIST_PAGE_CLOSE);
  };

  return <div id='playerList'>
    <div className='header'>
      <div className='title'>
        {Constants.SERVER_NAME}
      </div>
      <div className='subtitle'>
        {t('online')}: {players.length}
      </div>
    </div>
    <div className='playerlistBody'>
      <div className='list'>
        <table>
          <thead>
            <tr>
              <th style={{ whiteSpace: 'nowrap', width: '10%' }}>{t('id').toUpperCase()}</th>
              <th style={{ width: '100%' }}>{t('name').toUpperCase()}</th>
              <th style={{ whiteSpace: 'nowrap', paddingRight: '10px' }}>{t('ping').toUpperCase()}</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => {
              return (
                <tr>
                  <td style={{ whiteSpace: 'nowrap', color: '#ababab', width: '10%' }}>{player.id}</td>
                  <td style={{ width: '100%' }}>{player.name}</td>
                  <td style={{ whiteSpace: 'nowrap', color: '#ababab', paddingRight: '10px' }}>{player.ping}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className='tipMouse'>{t('cursorTip')}</div>
    </div>
    <div className='footer'>
      <span>{t('onDuty')}:</span><br />
      <span className='onduty'>{t('lssd')}: {footer.police}, {t('lsfd')}: {footer.fire} {t('mechanics')}: {footer.mechanic}, {t('taxiDrivers')}: {footer.taxiDriver}</span>
    </div>
  </div>
};

export default PlayerListPage;