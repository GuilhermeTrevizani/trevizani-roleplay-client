import { configureEvent, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('Server:SpawnarVeiculos', (title: string, vehiclesJson: string) => {
  setPages([Constants.VEHICLE_LIST_PAGE], []);
  configureEvent(Constants.VEHICLE_LIST_PAGE_SHOW, () => {
    webView.call(Constants.VEHICLE_LIST_PAGE_SHOW, title, vehiclesJson);
  });
  configureEvent(Constants.VEHICLE_LIST_PAGE_CLOSE, () => {
    setPages([], [Constants.VEHICLE_LIST_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.VEHICLE_LIST_PAGE_SPAWN, (id: string) => {
    callRemoteEvent('SpawnVehicle', id);
  });
  configureEvent(Constants.VEHICLE_LIST_PAGE_RELEASE, (id: string) => {
    callRemoteEvent('ReleaseVehicle', id);
  });
  configureEvent(Constants.VEHICLE_LIST_PAGE_TRACK, (id: string) => {
    callRemoteEvent('TrackVehicle', id);
  });
  configureEvent(Constants.VEHICLE_LIST_PAGE_CHANGE_PLATE, (id: string, plate: string) => {
    callRemoteEvent('ChangeVehiclePlate', id, plate);
  });
  configureEvent(Constants.VEHICLE_LIST_PAGE_SELL, (id: string) => {
    callRemoteEvent('SellVehicle', id);
  });
  toggleView(true);
  webView.call(Constants.VEHICLE_LIST_PAGE_SHOW, title, vehiclesJson);
});

mp.events.add('VehicleListPage:CloseServer', () => {
  setPages([], [Constants.VEHICLE_LIST_PAGE]);
  toggleView(false);
});