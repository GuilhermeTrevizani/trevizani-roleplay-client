import { configureEvent, getPlayerPosition, getPlayerRotation, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('StaffSmuggler:Show', (json: string) => {
  setPages([Constants.STAFF_SMUGGLER_PAGE], []);
  toggleView(false);
  configureEvent(Constants.STAFF_SMUGGLER_PAGE_SHOW, () => {
    webView.call(Constants.STAFF_SMUGGLER_PAGE_SHOW, json, getPlayerPosition(), getPlayerRotation());
  });
  configureEvent(Constants.STAFF_SMUGGLER_PAGE_CLOSE, () => {
    setPages([], [Constants.STAFF_SMUGGLER_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.STAFF_SMUGGLER_PAGE_GO_TO, (id) => {
    callRemoteEvent('StaffSmugglerGoto', id);
  });
  configureEvent(Constants.STAFF_SMUGGLER_PAGE_SAVE, (id: string, model: string, dimension: number,
    posX: number, posY: number, posZ: number, rotR: number, rotP: number, rotY: number,
    value: number, cooldownQuantityLimit: number, cooldownMinutes: number, allowedCharacters: string) => {
    callRemoteEvent('StaffSmugglerSave', id, model, dimension,
      new mp.Vector3(posX, posY, posZ), new mp.Vector3(rotR, rotP, rotY),
      value, cooldownQuantityLimit, cooldownMinutes, JSON.stringify(allowedCharacters));
  });
  configureEvent(Constants.STAFF_SMUGGLER_PAGE_REMOVE, (id) => {
    callRemoteEvent('StaffSmugglerRemove', id);
  });
  toggleView(true);
});

mp.events.add('StaffSmuggler:Update', (json: string) => {
  webView.call(Constants.STAFF_SMUGGLER_PAGE_SHOW, json, getPlayerPosition(), getPlayerRotation());
});