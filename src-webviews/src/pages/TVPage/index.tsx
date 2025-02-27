import { Constants } from '../../../../src/base/constants';
import { useEffect, useRef, useState } from 'react';
import { configureEvent, emitEvent } from '../../services/util';
import YouTube from 'react-youtube';

const TVPage = () => {
  const [volume, setVolume] = useState(100);
  const [url, setUrl] = useState('');
  const player = useRef(null);

  useEffect(() => {
    configureEvent(Constants.TV_PAGE_TURN_ON, (url: string, volume: number) => {
      setVolume(volume);
      setUrl(url);
    });

    configureEvent(Constants.TV_PAGE_SET_VOLUME, (volume: number) => {
      player.current.internalPlayer.setVolume(volume);
    });

    emitEvent(Constants.TV_PAGE_TURN_ON);
  }, []);

  const opts = {
    height: window.screen.availHeight,
    width: window.screen.availWidth,
    playerVars: {
      autoplay: 1,
      controls: 0,
      showinfo: 0,
      disablekb: 1,
      modestbranding: 1,
      rel: 0,
      enablejsapi: 1,
    },
  };

  return url && <YouTube ref={player} videoId={url} opts={opts} onReady={(e) => e.target.setVolume(volume)} />
};

export default TVPage;