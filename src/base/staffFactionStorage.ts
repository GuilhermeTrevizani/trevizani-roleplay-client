import { configureEvent, getPlayerPosition, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('StaffFactionStorage:Show', (json: string) => {
  setPages([Constants.STAFF_FACTION_STORAGE_PAGE], []);
  configureEvent(Constants.STAFF_FACTION_STORAGE_PAGE_SHOW, () => {
    webView.call(Constants.STAFF_FACTION_STORAGE_PAGE_SHOW, json, getPlayerPosition());
  });
  configureEvent(Constants.STAFF_FACTION_STORAGE_PAGE_CLOSE, () => {
    setPages([], [Constants.STAFF_FACTION_STORAGE_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.STAFF_FACTION_STORAGE_PAGE_GO_TO, (id) => {
    callRemoteEvent('StaffFactionStorageGoto', id);
  });
  configureEvent(Constants.STAFF_FACTION_STORAGE_PAGE_SAVE, (id, posX, posY, posZ, dimension, factionName) => {
    callRemoteEvent('StaffFactionStorageSave', id, new mp.Vector3(posX, posY, posZ), dimension, factionName);
  });
  configureEvent(Constants.STAFF_FACTION_STORAGE_PAGE_REMOVE, (id) => {
    callRemoteEvent('StaffFactionStorageRemove', id);
  });
  configureEvent(Constants.STAFF_FACTION_STORAGE_PAGE_SHOW_ITEMS, (id) => {
    callRemoteEvent('StaffFactionsStoragesItemsShow', id);
  });
  toggleView(true);
});

mp.events.add('StaffFactionStorage:Update', (json: string) => {
  webView.call(Constants.STAFF_FACTION_STORAGE_PAGE_SHOW, json, getPlayerPosition());
});