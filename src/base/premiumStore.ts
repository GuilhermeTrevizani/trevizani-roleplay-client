import { configureEvent, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('PremiumStore:Show', (premiumPoints: number, json: string) => {
  setPages([Constants.PREMIUM_STORE_PAGE], []);
  configureEvent(Constants.PREMIUM_STORE_PAGE_SHOW, () => {
    webView.call(Constants.PREMIUM_STORE_PAGE_SHOW, premiumPoints, json);
  });
  configureEvent(Constants.PREMIUM_STORE_PAGE_CLOSE, () => {
    setPages([], [Constants.PREMIUM_STORE_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.PREMIUM_STORE_PAGE_BUY, (name: string) => {
    callRemoteEvent('BuyPremiumItem', name);
  });
  toggleView(true);
  webView.call(Constants.PREMIUM_STORE_PAGE_SHOW, premiumPoints, json);
});