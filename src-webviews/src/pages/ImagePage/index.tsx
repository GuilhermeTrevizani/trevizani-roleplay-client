import { Constants } from '../../../../src/base/constants';
import { useEffect, useState } from 'react';
import { configureEvent, emitEvent } from '../../services/util';
import './style.scss';

const ImagePage = () => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    configureEvent(Constants.IMAGE_PAGE_SHOW, (url: string) => {
      setUrl(url);
    });

    document.addEventListener('keydown', keyDown);
    emitEvent(Constants.IMAGE_PAGE_SHOW);

    return () => {
      document.removeEventListener('keydown', keyDown);
    };
  }, []);

  const keyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape')
      emitEvent(Constants.IMAGE_PAGE_CLOSE);
  };

  return <div id='imagePage'>
    <img src={url} />
  </div>
};

export default ImagePage;