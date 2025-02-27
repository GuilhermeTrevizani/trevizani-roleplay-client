import { configureEvent, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('TV:Config', (id: number, source: string, volume: number) => {
  setPages([Constants.TV_CONFIG_PAGE], []);
  configureEvent(Constants.TV_CONFIG_PAGE_SHOW, () => {
    webView.call(Constants.TV_CONFIG_PAGE_SHOW, source, volume);
  });
  configureEvent(Constants.TV_CONFIG_PAGE_CLOSE, () => {
    setPages([], [Constants.TV_CONFIG_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.TV_CONFIG_PAGE_SAVE, (source: string, volume: number) => {
    callRemoteEvent('TVConfigSave', id, source, volume);
  });
  toggleView(true);
  webView.call(Constants.TV_CONFIG_PAGE_SHOW, source, volume);
});