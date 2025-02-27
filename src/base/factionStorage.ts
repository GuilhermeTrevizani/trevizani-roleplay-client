import { Constants } from './constants';
import { callRemoteEvent } from './cursor';
import { configureEvent, setPages, webView, toggleView } from './webView';

mp.events.add('ShowFactionStorage', (itemsJson: string, factionName: string) => {
  setPages([Constants.FACTION_STORAGE_PAGE], []);
  configureEvent(Constants.FACTION_STORAGE_PAGE_SHOW, () => {
    webView.call(Constants.FACTION_STORAGE_PAGE_SHOW, itemsJson, factionName);
  });
  configureEvent(Constants.FACTION_STORAGE_PAGE_CLOSE, () => {
    setPages([], [Constants.FACTION_STORAGE_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.FACTION_STORAGE_PAGE_EQUIP_ITEM, (factionStorageItemId: string) => {
    callRemoteEvent('FactionStorageEquipItem', factionStorageItemId);
  });
  toggleView(true);
  webView.call(Constants.FACTION_STORAGE_PAGE_SHOW, itemsJson, factionName);
});