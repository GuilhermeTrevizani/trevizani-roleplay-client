import { configureEvent, getPlayerPosition, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('StaffCrackDen:Show', (json: string) => {
  setPages([Constants.STAFF_CRACK_DEN_PAGE], []);
  configureEvent(Constants.STAFF_CRACK_DEN_PAGE_SHOW, () => {
    webView.call(Constants.STAFF_CRACK_DEN_PAGE_SHOW, json);
  });
  configureEvent(Constants.STAFF_CRACK_DEN_PAGE_CLOSE, () => {
    setPages([], [Constants.STAFF_CRACK_DEN_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.STAFF_CRACK_DEN_PAGE_GO_TO, (id) => {
    callRemoteEvent('StaffCrackDenGoto', id);
  });
  configureEvent(Constants.STAFF_CRACK_DEN_PAGE_SAVE, (id, posX, posY, posZ, dimension, onlinePoliceOfficers, cooldownQuantityLimit, cooldownHours) => {
    callRemoteEvent('StaffCrackDenSave', id, new mp.Vector3(posX, posY, posZ), dimension,
      onlinePoliceOfficers, cooldownQuantityLimit, cooldownHours);
  });
  configureEvent(Constants.STAFF_CRACK_DEN_PAGE_REMOVE, (id) => {
    callRemoteEvent('StaffCrackDenRemove', id);
  });
  configureEvent(Constants.STAFF_CRACK_DEN_PAGE_SHOW_ITEMS, (id) => {
    callRemoteEvent('StaffCrackDensItemsShow', id);
  });
  configureEvent(Constants.STAFF_CRACK_DEN_PAGE_REVOKE_COOLDOWN, (id) => {
    callRemoteEvent('StaffCrackDenRevokeCooldown', id);
  });
  toggleView(true);
});

mp.events.add('StaffCrackDen:Update', (json: string) => {
  webView.call(Constants.STAFF_CRACK_DEN_PAGE_SHOW, json, getPlayerPosition());
});