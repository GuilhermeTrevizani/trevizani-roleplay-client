import { configureEvent, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('StaffFactionEquipment:Show', (json: string) => {
  setPages([Constants.STAFF_FACTION_EQUIPMENT_PAGE], []);
  configureEvent(Constants.STAFF_FACTION_EQUIPMENT_PAGE_SHOW, () => {
    webView.call(Constants.STAFF_FACTION_EQUIPMENT_PAGE_SHOW, json);
  });
  configureEvent(Constants.STAFF_FACTION_EQUIPMENT_PAGE_CLOSE, () => {
    setPages([], [Constants.STAFF_FACTION_EQUIPMENT_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.STAFF_FACTION_EQUIPMENT_PAGE_SAVE, (id: string, name: string, factionName: string,
    propertyOrVehicle: boolean, swat: boolean, upr: boolean) => {
    callRemoteEvent('StaffFactionEquipmentSave', id, name, factionName, propertyOrVehicle, swat, upr);
  });
  configureEvent(Constants.STAFF_FACTION_EQUIPMENT_PAGE_REMOVE, (id: string) => {
    callRemoteEvent('StaffFactionEquipmentRemove', id);
  });
  configureEvent(Constants.STAFF_FACTION_EQUIPMENT_PAGE_SHOW_ITEMS, (id: string) => {
    callRemoteEvent('StaffFactionsEquipmentsItemsShow', id);
  });
  toggleView(true);
  webView.call(Constants.STAFF_FACTION_EQUIPMENT_PAGE_SHOW, json);
});

mp.events.add('StaffFactionEquipment:Update', (json: string) => {
  webView.call(Constants.STAFF_FACTION_EQUIPMENT_PAGE_SHOW, json);
});