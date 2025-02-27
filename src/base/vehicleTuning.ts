import { callRemoteEvent } from './cursor';
import { activateChat, activateCurrentHUD } from './chat';
import { Constants } from './constants';
import { configureEvent, setPages, webView, toggleView, hexToRgb } from './webView';

let closing = false;

const renderTuning = () => {
  mp.game.controls.disableControlAction(0, 71, true); // INPUT_VEH_ACCELERATE
  mp.game.controls.disableControlAction(0, 72, true); // INPUT_VEH_BRAKE
}

mp.events.add('VehicleTuning', (tuningJson: string) => {
  closing = false;
  mp.events.add('render', renderTuning);

  const vehicle = mp.players.local.vehicle;
  const maxLivery = vehicle.getLiveryCount();
  const classType = vehicle.getClass();
  const canUseDrift = classType != 8; // Motorcycles

  const extras: number[] = [];
  for (let index = 1; index < 14; index++) {
    if (vehicle.doesExtraExist(index))
      extras.push(index);
  }

  const tuning = JSON.parse(tuningJson);
  tuning.currentMods.forEach((currentMod: any) => {
    currentMod.maxMod = vehicle.getNumMods(currentMod.type) - 1;
  });
  tuning.currentMods = tuning.currentMods.filter((x: any) => x.maxMod > -1);
  tuningJson = JSON.stringify(tuning);

  mp.game.ui.displayHud(false);
  mp.game.ui.displayRadar(false);
  activateChat(false);

  setPages([Constants.VEHICLE_TUNING_PAGE], []);
  configureEvent(Constants.VEHICLE_TUNING_PAGE_SHOW, () => {
    webView.call(Constants.VEHICLE_TUNING_PAGE_SHOW, tuningJson, maxLivery, JSON.stringify(extras), canUseDrift);
  });
  configureEvent(Constants.VEHICLE_TUNING_PAGE_CONFIRM, (confirm: boolean, tuningJson: string) => {
    closing = true;
    callRemoteEvent('ConfirmTuning', confirm, tuningJson);
  });
  configureEvent(Constants.VEHICLE_TUNING_PAGE_SYNC_MOD, (type: number, selected: number) => {
    if (closing)
      return;

    vehicle.setMod(type, selected);
  });
  configureEvent(Constants.VEHICLE_TUNING_PAGE_SYNC_COLOR, (primaryColor: string, secondaryColor: string) => {
    if (closing)
      return;

    const color1 = hexToRgb(primaryColor)!;
    const color2 = hexToRgb(secondaryColor)!;
    vehicle.setCustomPrimaryColour(color1.r, color1.g, color1.b);
    vehicle.setCustomSecondaryColour(color2.r, color2.g, color2.b);
  });
  configureEvent(Constants.VEHICLE_TUNING_PAGE_SYNC_WHEEL, (wheelType: number, wheelVariation: number, wheelColor: number) => {
    if (closing)
      return;

    vehicle.setWheelType(wheelType);
    vehicle.setExtraColours(0, wheelColor);
    vehicle.setMod(23, wheelVariation);
    vehicle.setMod(24, wheelVariation);
  });
  configureEvent(Constants.VEHICLE_TUNING_PAGE_SYNC_NEON, (neonColor: string, neonLeft: number, neonRight: number, neonFront: number, neonBack: number) => {
    if (closing)
      return;

    const color = hexToRgb(neonColor)!;
    vehicle.setNeonLightsColour(color.r, color.g, color.b);
    vehicle.setNeonLightEnabled(0, neonLeft == 1 ? true : false);
    vehicle.setNeonLightEnabled(1, neonRight == 1 ? true : false);
    vehicle.setNeonLightEnabled(2, neonFront == 1 ? true : false);
    vehicle.setNeonLightEnabled(3, neonBack == 1 ? true : false);
  });
  configureEvent(Constants.VEHICLE_TUNING_PAGE_SYNC_XENON_COLOR, (headlightColor: number, lightsMultiplier: number) => {
    if (closing)
      return;

    vehicle.toggleMod(22, true);
    mp.game.invoke("0xE41033B25D003A07", vehicle.handle, headlightColor);
    vehicle.setLightMultiplier(lightsMultiplier);
  });
  configureEvent(Constants.VEHICLE_TUNING_PAGE_SYNC_WINDOW_TINT, (windowTint: number) => {
    if (closing)
      return;

    vehicle.setWindowTint(windowTint);
  });
  configureEvent(Constants.VEHICLE_TUNING_PAGE_SYNC_TIRE_SMOKE_COLOR, (tireSmokeColor: string) => {
    if (closing)
      return;

    const color = hexToRgb(tireSmokeColor)!;
    vehicle.toggleMod(20, true);
    vehicle.setTyreSmokeColor(color.r, color.g, color.b);
  });
  configureEvent(Constants.VEHICLE_TUNING_PAGE_SYNC_LIVERY, (livery: number) => {
    if (closing)
      return;

    vehicle.setLivery(livery);
  });
  configureEvent(Constants.VEHICLE_TUNING_PAGE_SYNC_EXTRAS, (extrasJson: string) => {
    if (closing)
      return;

    let index = 1;
    const extras = JSON.parse(extrasJson);
    extras.forEach((extra: boolean) => {
      if (vehicle.doesExtraExist(index))
        vehicle.setExtra(index, extra ? 1 : 0);
      index++;
    });
  });
  toggleView(true);
  webView.call(Constants.VEHICLE_TUNING_PAGE_SHOW, tuningJson, maxLivery, JSON.stringify(extras), canUseDrift);
});

mp.events.add('VehicleTuningPage:CloseServer', () => {
  mp.events.remove('render', renderTuning);
  activateCurrentHUD();

  setPages([], [Constants.VEHICLE_TUNING_PAGE]);
  toggleView(false);
});