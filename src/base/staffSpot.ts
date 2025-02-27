import { configureEvent, getPlayerPosition, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('StaffSpot:Show', (spotsJson: string, typesJson: string) => {
  setPages([Constants.STAFF_SPOT_PAGE], []);
  configureEvent(Constants.STAFF_SPOT_PAGE_SHOW, () => {
    webView.call(Constants.STAFF_SPOT_PAGE_SHOW, spotsJson, getPlayerPosition());
    webView.call(Constants.STAFF_SPOT_PAGE_LOAD_TYPES, typesJson);
  });
  configureEvent(Constants.STAFF_SPOT_PAGE_CLOSE, () => {
    setPages([], [Constants.STAFF_SPOT_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.STAFF_SPOT_PAGE_GO_TO, (id: string) => {
    callRemoteEvent('StaffSpotGoto', id);
  });
  configureEvent(Constants.STAFF_SPOT_PAGE_SAVE, (id: string, type: number,
    posX: number, posY: number, posZ: number, dimension: number) => {
    callRemoteEvent('StaffSpotSave', id, type, new mp.Vector3(posX, posY, posZ), dimension);
  });
  toggleView(true);
});

mp.events.add('StaffSpot:Update', (json: string) => {
  webView.call(Constants.STAFF_SPOT_PAGE_SHOW, json, getPlayerPosition());
});