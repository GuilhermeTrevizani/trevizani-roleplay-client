import { configureEvent, getPlayerPosition, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('StaffTruckerLocationDelivery:Show', (json: string, truckerLocationId: string) => {
  setPages([Constants.STAFF_TRUCKER_LOCATION_DELIVERY_PAGE], [Constants.STAFF_TRUCKER_LOCATION_PAGE])
  configureEvent(Constants.STAFF_TRUCKER_LOCATION_DELIVERY_PAGE_SHOW, () => {
    webView.call(Constants.STAFF_TRUCKER_LOCATION_DELIVERY_PAGE_SHOW, json, getPlayerPosition());
  });
  configureEvent(Constants.STAFF_TRUCKER_LOCATION_DELIVERY_PAGE_CLOSE, () => {
    setPages([], [Constants. STAFF_TRUCKER_LOCATION_DELIVERY_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.STAFF_TRUCKER_LOCATION_DELIVERY_PAGE_GO_TO, (id) => {
    callRemoteEvent('StaffTruckerLocationDeliveryGoto', id);
  });
  configureEvent(Constants.STAFF_TRUCKER_LOCATION_DELIVERY_PAGE_SAVE, (truckerLocationDeliveryId, posX, posY, posZ) => {
    callRemoteEvent('StaffTruckerLocationDeliverySave', truckerLocationDeliveryId, truckerLocationId, new mp.Vector3(posX, posY, posZ));
  });
  configureEvent(Constants.STAFF_TRUCKER_LOCATION_DELIVERY_PAGE_REMOVE, (truckerLocationDeliveryId) => {
    callRemoteEvent('StaffTruckerLocationDeliveryRemove', truckerLocationDeliveryId);
  });
  toggleView(true);
});

mp.events.add('StaffTruckerLocationDelivery:Update', (json: string) => {
  webView.call(Constants.STAFF_TRUCKER_LOCATION_DELIVERY_PAGE_SHOW, json, getPlayerPosition());
});