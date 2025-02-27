import { setPages, webView, configureEvent, toggleView, getPlayerPosition } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('StaffBlip:Show', (json: string) => {
  setPages([Constants.STAFF_BLIP_PAGE], []);
  configureEvent(Constants.STAFF_BLIP_PAGE_SHOW, () => {
    webView.call(Constants.STAFF_BLIP_PAGE_SHOW, json, getPlayerPosition());
  });
  configureEvent(Constants.STAFF_BLIP_PAGE_CLOSE, () => {
    setPages([], [Constants.STAFF_BLIP_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.STAFF_BLIP_PAGE_GO_TO, (id) => {
    callRemoteEvent('StaffBlipGoto', id);
  });
  configureEvent(Constants.STAFF_BLIP_PAGE_SAVE, (id, name, posX, posY, posZ, type, color) => {
    callRemoteEvent('StaffBlipSave', id, name, new mp.Vector3(posX, posY, posZ), type, color);
  });
  configureEvent(Constants.STAFF_BLIP_PAGE_REMOVE, (id) => {
    callRemoteEvent('StaffBlipRemove', id);
  });
  toggleView(true);
});

mp.events.add('StaffBlip:Update', (json: string) => {
  webView.call(Constants.STAFF_BLIP_PAGE_SHOW, json, getPlayerPosition());
});