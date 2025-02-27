import { configureEvent, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('PickLock:Start', (difficulty: number, pins: number, strength: number, type: string) => {
  setPages([Constants.PICK_LOCK_PAGE], []);
  configureEvent(Constants.PICK_LOCK_PAGE_SHOW, () => {
    webView.call(Constants.PICK_LOCK_PAGE_SHOW, difficulty, pins, strength);
  });
  configureEvent(Constants.PICK_LOCK_PAGE_CLOSE, (success: boolean) => {
    setPages([], [Constants.PICK_LOCK_PAGE]);
    toggleView(false);
    callRemoteEvent('FinishPickLock', success, type);
  });
  toggleView(true);
  webView.call(Constants.PICK_LOCK_PAGE_SHOW, difficulty, pins, strength);
});