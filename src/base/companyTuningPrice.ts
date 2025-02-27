import { toggleView, webView, configureEvent, setPages } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('CompanyTuningPrice:Show', (companyId: string, companyName: string, flagsJson: string, tuningPricesJson: string) => {
  setPages([Constants.COMPANY_TUNING_PRICES_PAGE], [Constants.COMPANIES_PAGE]);
  configureEvent(Constants.COMPANY_TUNING_PRICES_PAGE_SHOW, () => {
    webView.call(Constants.COMPANY_TUNING_PRICES_PAGE_SHOW, companyName, flagsJson, tuningPricesJson);
  });
  configureEvent(Constants.COMPANY_TUNING_PRICES_PAGE_CLOSE, () => {
    setPages([], [Constants.COMPANY_TUNING_PRICES_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.COMPANY_TUNING_PRICES_PAGE_SAVE, (companyTuningPriceId: string, sellPercentagePrice: number) => {
    callRemoteEvent('CompanyTuningPriceSave', companyId, companyTuningPriceId, sellPercentagePrice);
  });
  toggleView(true);
    webView.call(Constants.COMPANY_TUNING_PRICES_PAGE_SHOW, companyName, flagsJson, tuningPricesJson);
});