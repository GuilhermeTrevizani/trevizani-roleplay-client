
import { configureEvent, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('Circle:StartMinigame', (quantity: number, speed: number, size: number, icon: string, callbackEvent: string) => {
  setPages([Constants.CIRCLE_MINIGAME_PAGE], []);
  configureEvent(Constants.CIRCLE_MINIGAME_PAGE_SHOW, () => {
    webView.call(Constants.CIRCLE_MINIGAME_PAGE_SHOW, quantity, speed, size, icon);
  });
  configureEvent(Constants.CIRCLE_MINIGAME_PAGE_END, (success: boolean) => {
    setPages([], [Constants.CIRCLE_MINIGAME_PAGE]);
    toggleView(false);
    callRemoteEvent(callbackEvent, success);
  });
  toggleView(true);
  webView.call(Constants.CIRCLE_MINIGAME_PAGE_SHOW, quantity, speed, size, icon);
});