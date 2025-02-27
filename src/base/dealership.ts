import { configureEvent, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';
import { activateChat, activateCurrentHUD } from './chat';

let vehiclePosition: Vector3;

mp.events.add('OpenDealership', (name: string, vehiclesJson: string, x: number, y: number, z: number) => {
  vehiclePosition = new mp.Vector3(x, y, z);
  activateChat(false);
  mp.game.ui.displayHud(false);
  mp.game.ui.displayRadar(false);
  setPages([Constants.DEALERSHIP_PAGE], []);
  configureEvent(Constants.DEALERSHIP_PAGE_SHOW, () => {
    webView.call(Constants.DEALERSHIP_PAGE_SHOW, name, vehiclesJson);
  });
  configureEvent(Constants.DEALERSHIP_PAGE_CLOSE, () => {
    callRemoteEvent('CloseDealership');
  });
  configureEvent(Constants.DEALERSHIP_PAGE_CONFIRM, (vehicle: string, r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) => {
    callRemoteEvent('BuyDealershipVehicle', vehicle, r1, g1, b1, r2, g2, b2);
  });
  configureEvent(Constants.DEALERSHIP_PAGE_TEST_DRIVE, (vehicle: string, r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) => {
    callRemoteEvent('VehicleTestDrive', vehicle, r1, g1, b1, r2, g2, b2);
  });
  configureEvent(Constants.DEALERSHIP_PAGE_SELECT, selectVehicle);
  toggleView(true);
  webView.call(Constants.DEALERSHIP_PAGE_SHOW, name, vehiclesJson);
});

const close = () => {
  vehicle?.destroy();
  vehicle = null;
  setPages([], [Constants.DEALERSHIP_PAGE]);
  activateCurrentHUD();
  toggleView(false);
  mp.events.remove('render', renderDealership);
};

mp.events.add('DealershipPage:CloseServer', close);

const renderDealership = () => {
  mp.game.controls.disableControlAction(0, 75, true); // F
}

let vehicle: VehicleMp | null = null;

const selectVehicle = (model: string, r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) => {
  if (vehicle?.model !== mp.game.joaat(model)) {
    vehicle?.destroy();
    vehicle = mp.vehicles.new(model, vehiclePosition, {
      dimension: mp.players.local.dimension,
      color: [[r1, g1, b1], [r2, g2, b2]],
    });
    mp.game.waitForAsync(() => vehicle?.handle !== 0, 10_000)
      .then((res: any) => {
        if (!res)
          return;

        mp.players.local.setIntoVehicle(vehicle!.handle, -1);
      });
  } else {
    if (vehicle) {
      vehicle.setCustomPrimaryColour(r1, g1, b1);
      vehicle.setCustomSecondaryColour(r2, g2, b2);
    }
  }
  mp.events.add('render', renderDealership);
};