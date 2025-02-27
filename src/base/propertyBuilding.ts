import { toggleView, webView, configureEvent, setPages } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

const closeBuilding = () => {
  setPages([], [Constants.PROPERTY_BUILDING_PAGE]);
  toggleView(false);
};

mp.events.add('PropertyBuildingPage:ShowServer', (name: string, json: string) => {
  setPages([Constants.PROPERTY_BUILDING_PAGE], []);
  configureEvent(Constants.PROPERTY_BUILDING_PAGE_SHOW, () => {
    webView.call(Constants.PROPERTY_BUILDING_PAGE_SHOW, name, json);
  });
  configureEvent(Constants.PROPERTY_BUILDING_PAGE_CLOSE, closeBuilding);
  configureEvent(Constants.PROPERTY_BUILDING_PAGE_ENTER, (id: string) => {
    callRemoteEvent('BuildingPropertyEnter', id);
  });
  configureEvent(Constants.PROPERTY_BUILDING_PAGE_LOCK_UNLOCK, (id: string) => {
    callRemoteEvent('BuildingPropertyLockUnlock', id);
  });
  configureEvent(Constants.PROPERTY_BUILDING_PAGE_RELEASE, (id: string) => {
    callRemoteEvent('BuildingPropertyRelease', id);
  });
  configureEvent(Constants.PROPERTY_BUILDING_PAGE_BREAK_IN, (id: string) => {
    callRemoteEvent('BuildingPropertyBreakIn', id);
  });
  configureEvent(Constants.PROPERTY_BUILDING_PAGE_BUY, (id: string) => {
    callRemoteEvent('BuildingPropertyBuy', id);
  });
  toggleView(true);
  webView.call(Constants.PROPERTY_BUILDING_PAGE_SHOW, name, json);
});

mp.events.add('PropertyBuildingPage:CloseServer', closeBuilding);