import { Constants } from './constants';

mp.events.add('entityStreamIn', (entity) => {
  if (entity.type !== RageEnums.EntityType.VEHICLE)
    return;

  const vehicle = entity as VehicleMp;

  mp.game.vehicle.setDriftTyresEnabled(entity.handle,
    entity.getVariable('DriftMode') as boolean ?? false);

  mp.game.vehicle.setHasMutedSirens(entity.handle,
    entity.getVariable(Constants.VEHICLE_META_DATA_HAS_MUTED_SIRENS) as boolean ?? false);

  vehicle.setVehicleRadioEnabled(
    entity.getVariable(Constants.VEHICLE_META_DATA_RADIO_ENABLED) as boolean ?? false);

  entity.freezePosition(
    entity.getVariable('Frozen') as boolean ?? false);

  configureWindows(entity,
    entity.getVariable('Windows') as string);

  checkVehicleAttach(entity,
    entity.getVariable(Constants.VEHICLE_META_DATA_ATTACHED) as string);

  configureMods(entity,
    entity.getVariable('Mods') as string);

  checkTyres(entity,
    entity.getVariable('TyresBurst') as boolean)
});

mp.events.addDataHandler('DriftMode', (entity, value, oldValue) => {
  if (entity.type !== RageEnums.EntityType.VEHICLE || entity.handle == 0 || !entity.doesExist())
    return;

  mp.game.vehicle.setDriftTyresEnabled(entity.handle, value);
});

mp.events.addDataHandler(Constants.VEHICLE_META_DATA_HAS_MUTED_SIRENS, (entity, value, oldValue) => {
  if (entity.type !== RageEnums.EntityType.VEHICLE || entity.handle == 0 || !entity.doesExist())
    return;

  mp.game.vehicle.setHasMutedSirens(entity.handle, value);
});

mp.events.addDataHandler(Constants.VEHICLE_META_DATA_RADIO_ENABLED, (entity, value, oldValue) => {
  if (entity.type !== RageEnums.EntityType.VEHICLE || entity.handle == 0 || !entity.doesExist())
    return;

  const vehicle = entity as VehicleMp;
  vehicle.setVehicleRadioEnabled(value);
});

mp.events.addDataHandler('Frozen', (entity, value, oldValue) => {
  if (entity.type !== RageEnums.EntityType.VEHICLE || entity.handle == 0 || !entity.doesExist())
    return;

  entity.freezePosition(value);
});

mp.events.addDataHandler('Windows', (entity, value, oldValue) => {
  if (entity.type !== RageEnums.EntityType.VEHICLE || entity.handle == 0 || !entity.doesExist())
    return;

  configureWindows(entity, value);
});

mp.events.addDataHandler(Constants.VEHICLE_META_DATA_ATTACHED, (entity, value, oldValue) => {
  if (entity.type !== RageEnums.EntityType.VEHICLE || entity.handle == 0 || !entity.doesExist())

    checkVehicleAttach(entity, value);
});

mp.events.addDataHandler('Mods', (entity, value, oldValue) => {
  if (entity.type !== RageEnums.EntityType.VEHICLE || entity.handle == 0 || !entity.doesExist())
    return;

  configureMods(entity, value);
});

mp.events.addDataHandler('TyresBurst', (entity, value, oldValue) => {
  if (entity.type !== RageEnums.EntityType.VEHICLE || entity.handle == 0 || !entity.doesExist())
    return;

  checkTyres(entity, value);
});

const configureWindows = (entity: EntityMp, windowsJson: string) => {
  if (!windowsJson)
    return;

  const windows = JSON.parse(windowsJson) as boolean[];
  windows.forEach((opened, index) => {
    if (opened) {
      mp.game.vehicle.rollDownWindow(entity.handle, index);
    } else {
      mp.game.vehicle.fixWindow(entity.handle, index);
      mp.game.vehicle.rollUpWindow(entity.handle, index);
    }
  });
}

const checkVehicleAttach = (carried: EntityMp, attachJson: string) => {
  if (!attachJson) {
    carried.detach(false, false);
    return;
  }

  const attach = JSON.parse(attachJson);
  const carrier = mp.vehicles.atRemoteId(attach.id);
  mp.game.waitForAsync(() => carrier?.handle !== 0 && carrier.doesExist(), 10_000)
    .then((res: any) => {
      if (!res)
        return;

      carried.attachTo(carrier.handle, attach.bone,
        attach.position.x, attach.position.y, attach.position.z,
        attach.rotation.x, attach.rotation.y, attach.rotation.z,
        false, false, false, false, 0, true);
    });
}

const configureMods = (entity: EntityMp, modsJson: string) => {
  if (!modsJson)
    return;

  const mods = JSON.parse(modsJson);
  const vehicle = entity as VehicleMp;

  vehicle.setNeonLightEnabled(0, mods.neonLeft);
  vehicle.setNeonLightEnabled(1, mods.neonRight);
  vehicle.setNeonLightEnabled(2, mods.neonFront);
  vehicle.setNeonLightEnabled(3, mods.neonBack);

  vehicle.toggleMod(22, true);
  mp.game.invoke("0xE41033B25D003A07", vehicle.handle, mods.headlightColor);
  vehicle.setLightMultiplier(mods.lightsMultiplier);

  vehicle.toggleMod(20, true);
  vehicle.setTyreSmokeColor(mods.tireSmokeColorR, mods.tireSmokeColorG, mods.tireSmokeColorB);
}

const checkTyres = (entity: EntityMp, tyresBurst: boolean) => {
  const vehicle = entity as VehicleMp;
  if (!tyresBurst) {
    for (let i = 0; i <= 7; i++)
      vehicle.fixWheel(i);
    return;
  }

  for (let i = 0; i <= 7; i++)
    vehicle.setTyreBurst(i, true, 1_000);
}