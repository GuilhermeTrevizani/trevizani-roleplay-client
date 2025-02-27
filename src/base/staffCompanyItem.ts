import { toggleView, webView, configureEvent, setPages } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('StaffCompanyItem:Show', (itemsJson: string, templatesJson: string, companyId: string) => {
  setPages([Constants.STAFF_COMPANY_ITEM_PAGE], [Constants.STAFF_COMPANY_PAGE]);
  configureEvent(Constants.STAFF_COMPANY_ITEM_PAGE_SHOW, () => {
    webView.call(Constants.STAFF_COMPANY_ITEM_PAGE_SHOW, itemsJson);
    webView.call(Constants.STAFF_COMPANY_ITEM_PAGE_LOAD_TEMPLATES, templatesJson);
  });
  configureEvent(Constants.STAFF_COMPANY_ITEM_PAGE_CLOSE, () => {
    setPages([], [Constants.STAFF_COMPANY_ITEM_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.STAFF_COMPANY_ITEM_PAGE_SAVE, (companyItemId: string, itemTemplateId: string, costPrice: number) => {
    callRemoteEvent('StaffCompanyItemSave', companyId, companyItemId, itemTemplateId, costPrice);
  });
  configureEvent(Constants.STAFF_COMPANY_ITEM_PAGE_REMOVE, (companyItemId: string) => {
    callRemoteEvent('StaffCompanyItemRemove', companyId, companyItemId);
  });
  toggleView(true);
  webView.call(Constants.STAFF_COMPANY_ITEM_PAGE_SHOW, itemsJson);
  webView.call(Constants.STAFF_COMPANY_ITEM_PAGE_LOAD_TEMPLATES, templatesJson);
});