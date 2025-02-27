import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { configureEvent, emitEvent } from '../../services/util';
import './style.scss';

const PokerPage = () => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    configureEvent(Constants.POKER_PAGE_SHOW, (url: string) => {
      setUrl(url);
    });

    emitEvent(Constants.POKER_PAGE_SHOW);
  }, []);

  return <div id='pokerPage'>
    <img src={url} />
  </div>
};

export default PokerPage;