import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { configureEvent, emitEvent } from '../../services/util';
import './style.scss';

enum CharacterWound {
  None = 1,
  SeriouslyInjuredInvincible = 2,
  SeriouslyInjured = 3,
  PK = 4,
  CanHospitalCK = 5,
}

const DeathPage = () => {
  const [loading, setLoading] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [wound, setWound] = useState<CharacterWound>(CharacterWound.SeriouslyInjured);
  let interval: NodeJS.Timeout = undefined;

  useEffect(() => {
    configureEvent(Constants.DEATH_PAGE_SHOW, (wound: CharacterWound) => {
      setWound(wound);

      if (!interval) {
        setSeconds(wound < CharacterWound.CanHospitalCK ? 300 : 0);
        interval = setInterval(() => {
          setSeconds(value => value - 1);
        }, 1000);
      }

      setLoading(false);
    });

    emitEvent(Constants.DEATH_PAGE_SHOW);

    return () => {
      if (interval)
        clearInterval(interval);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  const acceptPlayerKill = () => {
    setLoading(true);
    emitEvent(Constants.DEATH_PAGE_PLAYER_KILL);
  }

  const acceptCharacterKill = () => {
    setLoading(true);
    emitEvent(Constants.DEATH_PAGE_CHARACTER_KILL);
  }

  return <div id='deathPage'>
    <div className='page'>
      <div className='header'>
        {wound < CharacterWound.PK && <span>Você está gravemente ferido!</span>}
        {wound >= CharacterWound.PK && <span>Você está morto!</span>}
      </div>
      <div className='body'>
        {wound < CharacterWound.PK && <span>Você foi gravemente ferido. Você deverá ser socorrido em 5 minutos ou sofrerá um PK.</span>}
        {wound >= CharacterWound.PK && <span>Você morreu e perdeu a memória.</span>}
        <br />
        {seconds > 0 && <span>Para respawnar, aguarde <strong>{formatTime(seconds)}</strong>.</span>}
        {seconds <= 0 && <span>Você já pode respawnar.</span>}
        <br />
        <div className='buttons'>
          <button className='button' disabled={loading || seconds > 0} onClick={acceptPlayerKill}>Aceitar Morte (Player Kill)</button>
          <button className='button' disabled={loading || seconds > 0} onClick={acceptCharacterKill}>Aceitar Morte (Character Kill)</button>
        </div>
      </div>
    </div>
  </div>
};

export default DeathPage;