import { configureEvent, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('StaffFactionStorageItem:Show', (itemsJson: string, templatesJson: string, factionStorageId: string) => {
  setPages([Constants.STAFF_FACTION_STORAGE_ITEM_PAGE], [Constants.STAFF_FACTION_STORAGE_PAGE]);
  configureEvent(Constants.STAFF_FACTION_STORAGE_ITEM_PAGE_SHOW, () => {
    webView.call(Constants.STAFF_FACTION_STORAGE_ITEM_PAGE_SHOW, itemsJson);
    webView.call(Constants.STAFF_FACTION_STORAGE_ITEM_PAGE_LOAD_TEMPLATES, templatesJson);
  });
  configureEvent(Constants.STAFF_FACTION_STORAGE_ITEM_PAGE_CLOSE, () => {
    setPages([], [Constants.STAFF_FACTION_STORAGE_ITEM_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.STAFF_FACTION_STORAGE_ITEM_PAGE_SAVE, (factionStorageItemId: string, itemTemplateId: string, quantity: number, price: number) => {
    callRemoteEvent('StaffFactionStorageItemSave', factionStorageItemId, factionStorageId, itemTemplateId, quantity, price);
  });
  configureEvent(Constants.STAFF_FACTION_STORAGE_ITEM_PAGE_REMOVE, (factionStorageItemId: string) => {
    callRemoteEvent('StaffFactionStorageItemRemove', factionStorageItemId);
  });
  toggleView(true);
  webView.call(Constants.STAFF_FACTION_STORAGE_ITEM_PAGE_SHOW, itemsJson);
  webView.call(Constants.STAFF_FACTION_STORAGE_ITEM_PAGE_LOAD_TEMPLATES, templatesJson);
});