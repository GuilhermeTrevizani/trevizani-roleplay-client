import { toggleView, webView, configureEvent, setPages } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('CompanyBuyItem:Show', (companyId: string, companyName: string, itemsJson: string) => {
  setPages([Constants.COMPANY_BUY_ITEMS_PAGE], []);
  configureEvent(Constants.COMPANY_BUY_ITEMS_PAGE_SHOW, () => {
    webView.call(Constants.COMPANY_BUY_ITEMS_PAGE_SHOW, companyName, itemsJson, true);
  });
  configureEvent(Constants.COMPANY_BUY_ITEMS_PAGE_CLOSE, () => {
    setPages([], [Constants.COMPANY_BUY_ITEMS_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.COMPANY_BUY_ITEMS_PAGE_BUY, (companyItemId: string) => {
    callRemoteEvent('CompanyBuyItem', companyId, companyItemId);
  });
  toggleView(true);
  webView.call(Constants.COMPANY_BUY_ITEMS_PAGE_SHOW, companyName, itemsJson, true);
});