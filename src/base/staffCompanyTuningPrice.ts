import { toggleView, webView, configureEvent, setPages } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('StaffCompanyTuningPrice:Show', (itemsJson: string, companyId: string) => {
  setPages([Constants.STAFF_COMPANY_TUNING_PRICE_PAGE], [Constants.STAFF_COMPANY_PAGE]);
  configureEvent(Constants.STAFF_COMPANY_TUNING_PRICE_PAGE_SHOW, () => {
    webView.call(Constants.STAFF_COMPANY_TUNING_PRICE_PAGE_SHOW, itemsJson);
  });
  configureEvent(Constants.STAFF_COMPANY_TUNING_PRICE_PAGE_CLOSE, () => {
    setPages([], [Constants.STAFF_COMPANY_TUNING_PRICE_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.STAFF_COMPANY_TUNING_PRICE_PAGE_SAVE, (companyTuningPriceId: string, costPercentagePrice: number) => {
    callRemoteEvent('StaffCompanyTuningPriceSave', companyId, companyTuningPriceId, costPercentagePrice);
  });
  toggleView(true);
  webView.call(Constants.STAFF_COMPANY_TUNING_PRICE_PAGE_SHOW, itemsJson);});