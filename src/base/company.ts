import { toggleView, webView, configureEvent, setPages } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

const closeCompaniesPage = () => {
  setPages([], [Constants.COMPANIES_PAGE]);
  toggleView(false);
};

mp.events.add('Company:Show', (companiesJson: string) => {
  setPages([Constants.COMPANIES_PAGE], []);
  webView.call(Constants.COMPANIES_PAGE_SHOW, companiesJson);
  configureEvent(Constants.COMPANIES_PAGE_CLOSE, closeCompaniesPage);
  configureEvent(Constants.COMPANIES_PAGE_SAVE, (id: string, color: string, blipType: number, blipColor: number) => {
    callRemoteEvent('CompanySave', id, color, blipType, blipColor);
  });
  configureEvent(Constants.COMPANIES_PAGE_EMPLOYEES, (id: string) => {
    closeCompaniesPage();
    callRemoteEvent('CompanyEmployees', id);
  });
  configureEvent(Constants.COMPANIES_PAGE_OPEN_CLOSE, (id: string) => {
    callRemoteEvent('CompanyOpenClose', id);
  });
  configureEvent(Constants.COMPANIES_PAGE_ANNOUNCE, (id: string, message: string) => {
    callRemoteEvent('CompanyAnnounce', id, message);
  });
  configureEvent(Constants.COMPANIES_PAGE_SHOW_ITEMS, (id: string) => {
    callRemoteEvent('CompanyShowItems', id);
  });
  configureEvent(Constants.COMPANIES_PAGE_WITHDRAW_SAFE, (id: string, value: number) => {
    callRemoteEvent('CompanySafeWithdraw', id, value);
  });
  toggleView(true);
});