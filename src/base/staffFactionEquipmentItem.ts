import { configureEvent, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('StaffFactionEquipmentItem:Show', (itemsJson: string, templatesJson: string, factionEquipmentId: string) => {
  setPages([Constants.STAFF_FACTION_EQUIPMENT_ITEM_PAGE], [Constants.STAFF_FACTION_EQUIPMENT_PAGE]);
  configureEvent(Constants.STAFF_FACTION_EQUIPMENT_ITEM_PAGE_SHOW, () => {
    webView.call(Constants.STAFF_FACTION_EQUIPMENT_ITEM_PAGE_SHOW, itemsJson);
    webView.call(Constants.STAFF_FACTION_EQUIPMENT_ITEM_PAGE_LOAD_TEMPLATES, templatesJson);
  });
  configureEvent(Constants.STAFF_FACTION_EQUIPMENT_ITEM_PAGE_CLOSE, () => {
    setPages([], [Constants.STAFF_FACTION_EQUIPMENT_ITEM_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.STAFF_FACTION_EQUIPMENT_ITEM_PAGE_SAVE, (factionEquipmentItemId: string, itemTemplateId: string, quantity: number) => {
    callRemoteEvent('StaffFactionEquipmentItemSave', factionEquipmentItemId, factionEquipmentId, itemTemplateId, quantity);
  });
  configureEvent(Constants.STAFF_FACTION_EQUIPMENT_ITEM_PAGE_REMOVE, (factionEquipmentItemId: string) => {
    callRemoteEvent('StaffFactionEquipmentItemRemove', factionEquipmentItemId, factionEquipmentId);
  });
  toggleView(true);
  webView.call(Constants.STAFF_FACTION_EQUIPMENT_ITEM_PAGE_SHOW, itemsJson);
  webView.call(Constants.STAFF_FACTION_EQUIPMENT_ITEM_PAGE_LOAD_TEMPLATES, templatesJson);
});