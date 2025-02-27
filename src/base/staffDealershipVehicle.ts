import { toggleView, webView, configureEvent, setPages } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('StaffDealershipVehicle:Show', (dealershipId: string, json: string) => {
  setPages([Constants.STAFF_DEALERSHIP_VEHICLE_PAGE], [Constants.STAFF_DEALERSHIP_PAGE]);
  configureEvent(Constants.STAFF_DEALERSHIP_VEHICLE_PAGE_SHOW, () => {
    webView.call(Constants.STAFF_DEALERSHIP_VEHICLE_PAGE_SHOW, json);
  });
  configureEvent(Constants.STAFF_DEALERSHIP_VEHICLE_PAGE_CLOSE, () => {
    setPages([], [Constants.STAFF_DEALERSHIP_VEHICLE_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.STAFF_DEALERSHIP_VEHICLE_PAGE_SAVE, (id, name, value) => {
    callRemoteEvent('StaffDealershipVehicleSave', dealershipId, id, name, value);
  });
  configureEvent(Constants.STAFF_DEALERSHIP_VEHICLE_PAGE_REMOVE, (id) => {
    callRemoteEvent('StaffDealershipVehicleRemove', dealershipId, id);
  });
  toggleView(true);
});

mp.events.add('StaffDealershipVehicle:Update', (json: string) => {
  webView.call(Constants.STAFF_DEALERSHIP_VEHICLE_PAGE_SHOW, json);
});