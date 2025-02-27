import { configureEvent, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('StaffVehicle:Show', (vehiclesJson: string, modelsJson: string) => {
  setPages([Constants.STAFF_VEHICLE_PAGE], []);
  configureEvent(Constants.STAFF_VEHICLE_PAGE_SHOW, () => {
    webView.call(Constants.STAFF_VEHICLE_PAGE_SHOW, vehiclesJson, modelsJson);
  });
  configureEvent(Constants.STAFF_VEHICLE_PAGE_CLOSE, () => {
    setPages([], [Constants.STAFF_VEHICLE_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.STAFF_VEHICLE_PAGE_SAVE, (model, faction) => {
    callRemoteEvent('StaffVehicleSave', model, faction);
  });
  configureEvent(Constants.STAFF_VEHICLE_PAGE_REMOVE, (id) => {
    callRemoteEvent('StaffVehicleRemove', id);
  });
  toggleView(true);
  webView.call(Constants.STAFF_VEHICLE_PAGE_SHOW, vehiclesJson, modelsJson);
});

mp.events.add('StaffVehicle:Update', (vehiclesJson: string, modelsJson: string) => {
  webView.call(Constants.STAFF_VEHICLE_PAGE_SHOW, vehiclesJson, modelsJson);
});