import { toggleView, webView, configureEvent, getPlayerPosition, setPages, getPlayerRotation } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('StaffDealership:Show', (json: string) => {
  setPages([Constants.STAFF_DEALERSHIP_PAGE], []);
  configureEvent(Constants.STAFF_DEALERSHIP_PAGE_SHOW, () => {
    webView.call(Constants.STAFF_DEALERSHIP_PAGE_SHOW, json, getPlayerPosition(), getPlayerRotation());
  });
  configureEvent(Constants.STAFF_DEALERSHIP_PAGE_CLOSE, () => {
    setPages([], [Constants.STAFF_DEALERSHIP_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.STAFF_DEALERSHIP_PAGE_GO_TO, (id) => {
    callRemoteEvent('StaffDealershipGoto', id);
  });
  configureEvent(Constants.STAFF_DEALERSHIP_PAGE_SAVE, (id, name,
    posX, posY, posZ,
    vehiclePosX, vehiclePosY, vehiclePosZ,
    vehicleRotR, vehicleRotP, vehicleRotY) => {
    callRemoteEvent('StaffDealershipSave', id, name,
      new mp.Vector3(posX, posY, posZ),
      new mp.Vector3(vehiclePosX, vehiclePosY, vehiclePosZ),
      new mp.Vector3(vehicleRotR, vehicleRotP, vehicleRotY));
  });
  configureEvent(Constants.STAFF_DEALERSHIP_PAGE_REMOVE, (id) => {
    callRemoteEvent('StaffDealershipRemove', id);
  });
  configureEvent(Constants.STAFF_DEALERSHIP_PAGE_SHOW_VEHICLES, (id) => {
    callRemoteEvent('StaffDealershipsVehiclesShow', id);
  });
  toggleView(true);
});

mp.events.add('StaffDealership:Update', (json: string) => {
  webView.call(Constants.STAFF_DEALERSHIP_PAGE_SHOW, json, getPlayerPosition(), getPlayerRotation());
});