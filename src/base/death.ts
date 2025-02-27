import { Constants } from './constants';
import { callRemoteEvent } from './cursor';
import { configureEvent, setPages, webView, toggleView } from './webView';

mp.events.add('DeathPage:ShowServer', (wound: number) => {
  setPages([Constants.DEATH_PAGE], []);
  configureEvent(Constants.DEATH_PAGE_SHOW, () => {
    webView.call(Constants.DEATH_PAGE_SHOW, wound);
  });
  configureEvent(Constants.DEATH_PAGE_PLAYER_KILL, () => {
    callRemoteEvent('AcceptPlayerKill');
  });
  configureEvent(Constants.DEATH_PAGE_CHARACTER_KILL, () => {
    callRemoteEvent('AcceptCharacterKill');
  });
  webView.call(Constants.DEATH_PAGE_SHOW, wound);
});

mp.events.add('DeathPage:CloseServer', () => {
  setPages([], [Constants.DEATH_PAGE]);
  toggleView(false);
});