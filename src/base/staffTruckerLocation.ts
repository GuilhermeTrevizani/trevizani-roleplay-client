import { configureEvent, getPlayerPosition, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('StaffTruckerLocation:Show', (json: string) => {
  setPages([Constants.STAFF_TRUCKER_LOCATION_PAGE], []);
  toggleView(false);
  configureEvent(Constants.STAFF_TRUCKER_LOCATION_PAGE_SHOW, () => {
    webView.call(Constants.STAFF_TRUCKER_LOCATION_PAGE_SHOW, json, getPlayerPosition());
  });
  configureEvent(Constants.STAFF_TRUCKER_LOCATION_PAGE_CLOSE, () => {
    setPages([], [Constants.STAFF_TRUCKER_LOCATION_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.STAFF_TRUCKER_LOCATION_PAGE_GO_TO, (id) => {
    callRemoteEvent('StaffTruckerLocationGoto', id);
  });
  configureEvent(Constants.STAFF_TRUCKER_LOCATION_PAGE_SAVE, (id, name, posX, posY, posZ, deliveryValue, loadWaitTime, unloadWaitTime, allowedVehicles) => {
    callRemoteEvent('StaffTruckerLocationSave', id, name, new mp.Vector3(posX, posY, posZ),
      deliveryValue, loadWaitTime, unloadWaitTime, JSON.stringify(allowedVehicles));
  });
  configureEvent(Constants.STAFF_TRUCKER_LOCATION_PAGE_REMOVE, (id) => {
    callRemoteEvent('StaffTruckerLocationRemove', id);
  });
  configureEvent(Constants.STAFF_TRUCKER_LOCATION_PAGE_SHOW_DELIVERIES, (id) => {
    callRemoteEvent('StaffTruckerLocationsDeliveriesShow', id);
  });
  toggleView(true);
});

mp.events.add('StaffTruckerLocation:Update', (json: string) => {
  webView.call(Constants.STAFF_TRUCKER_LOCATION_PAGE_SHOW, json, getPlayerPosition());
});