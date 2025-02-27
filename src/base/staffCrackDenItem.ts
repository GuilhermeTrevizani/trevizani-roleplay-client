import { configureEvent, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('StaffCrackDenItem:Show', (crackDenId: string, itemsJson: string, templatesJson: string) => {
  setPages([Constants.STAFF_CRACK_DEN_ITEM_PAGE], [Constants.STAFF_CRACK_DEN_PAGE]);
  configureEvent(Constants.STAFF_CRACK_DEN_ITEM_PAGE_SHOW, () => {
    webView.call(Constants.STAFF_CRACK_DEN_ITEM_PAGE_SHOW, itemsJson);
    webView.call(Constants.STAFF_CRACK_DEN_ITEM_PAGE_LOAD_TEMPLATES, templatesJson);
  });
  configureEvent(Constants.STAFF_CRACK_DEN_ITEM_PAGE_CLOSE, () => {
    setPages([], [Constants.STAFF_CRACK_DEN_ITEM_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.STAFF_CRACK_DEN_ITEM_PAGE_SAVE, (crackDenItemId: string, itemTemplateId: string, value: number) => {
    callRemoteEvent('StaffCrackDenItemSave', crackDenId, crackDenItemId, itemTemplateId, value);
  });
  configureEvent(Constants.STAFF_CRACK_DEN_ITEM_PAGE_REMOVE, (crackDenItemId: string) => {
    callRemoteEvent('StaffCrackDenItemRemove', crackDenItemId);
  });
  toggleView(true);
  webView.call(Constants.STAFF_CRACK_DEN_ITEM_PAGE_SHOW, itemsJson);
  webView.call(Constants.STAFF_CRACK_DEN_ITEM_PAGE_LOAD_TEMPLATES, templatesJson);
});

mp.events.add('StaffCrackDenItem:Update', (itemsJson: string) => {
  webView.call(Constants.STAFF_CRACK_DEN_ITEM_PAGE_SHOW, itemsJson);
});