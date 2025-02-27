import { toggleView, webView, configureEvent, setPages } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('CompanyItem:Show', (companyId: string, companyName: string, flagsJson: string, itemsJson: string) => {
  setPages([Constants.COMPANY_ITEMS_PAGE], [Constants.COMPANIES_PAGE]);
  configureEvent(Constants.COMPANY_ITEMS_PAGE_SHOW, () => {
    webView.call(Constants.COMPANY_ITEMS_PAGE_SHOW, companyName, flagsJson, itemsJson);
  });
  configureEvent(Constants.COMPANY_ITEMS_PAGE_CLOSE, () => {
    setPages([], [Constants.COMPANY_ITEMS_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.COMPANY_ITEMS_PAGE_SAVE, (companyItemId: string, sellPrice: number) => {
    callRemoteEvent('CompanyItemSave', companyId, companyItemId, sellPrice);
  });
  toggleView(true);
    webView.call(Constants.COMPANY_ITEMS_PAGE_SHOW, companyName, flagsJson, itemsJson);
});