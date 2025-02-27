import { configureEvent, getPlayerPosition, getPlayerRotation, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('StaffPropertyEntrance:Show', (propertyId: string, json: string) => {
  setPages([Constants.STAFF_PROPERTY_ENTRANCE_PAGE], [Constants.STAFF_PROPERTY_PAGE]);
  configureEvent(Constants.STAFF_PROPERTY_ENTRANCE_PAGE_SHOW, () => {
    webView.call(Constants.STAFF_PROPERTY_ENTRANCE_PAGE_SHOW, json, getPlayerPosition(), getPlayerRotation());
  });
  configureEvent(Constants.STAFF_PROPERTY_ENTRANCE_PAGE_CLOSE, () => {
    setPages([], [Constants.STAFF_PROPERTY_ENTRANCE_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.STAFF_PROPERTY_ENTRANCE_PAGE_GO_TO, (id: string) => {
    callRemoteEvent('StaffPropertyEntranceGoto', propertyId, id);
  });
  configureEvent(Constants.STAFF_PROPERTY_ENTRANCE_PAGE_SAVE, (id: string,
    entrancePosX: number, entrancePosY: number, entrancePosZ: number,
    exitPosX: number, exitPosY: number, exitPosZ: number,
    entranceRotR: number, entranceRotP: number, entranceRotY: number,
    exitRotR: number, exitRotP: number, exitRotY: number) => {
    const entrancePos = new mp.Vector3(entrancePosX, entrancePosY, entrancePosZ);
    const exitPos = new mp.Vector3(exitPosX, exitPosY, exitPosZ);
    const entranceRot = new mp.Vector3(entranceRotR, entranceRotP, entranceRotY);
    const exitRot = new mp.Vector3(exitRotR, exitRotP, exitRotY);
    callRemoteEvent('StaffPropertyEntranceSave', propertyId, id, entrancePos, exitPos, entranceRot, exitRot);
  });
  configureEvent(Constants.STAFF_PROPERTY_ENTRANCE_PAGE_REMOVE, (id: string) => {
    callRemoteEvent('StaffPropertyEntranceRemove', propertyId, id);
  });
  toggleView(true);
  webView.call(Constants.STAFF_PROPERTY_ENTRANCE_PAGE_SHOW, json, getPlayerPosition(), getPlayerRotation());
});

mp.events.add('StaffPropertyEntrance:Update', (json: string) => {
  webView.call(Constants.STAFF_PROPERTY_ENTRANCE_PAGE_SHOW, json, getPlayerPosition(), getPlayerRotation());
});