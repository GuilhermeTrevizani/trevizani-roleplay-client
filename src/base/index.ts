import { callRemoteEvent, getAddress, getRightCoordsZ } from './cursor';
import { activateChat, chatNotifiy } from './chat';
import { enterVehicleAsDriver, enterVehicleAsPassenger } from './enterVehicles';
import { updateCellphone } from './cellphone';
import { Constants } from './constants';
import Fingerpointing from './fingerpointing';
import { configureEvent, hasPageOpened, setPages, webView, toggleView } from './webView';
import { changeFiringMode } from './firingMode';
import { detectObject } from './staffDoor';
import { toggleMarkers } from './marker';
import { handleCharacterEdit } from './charCreator';
import { handleTattoosEdit } from './tattoos';
import { handleClothesEdit } from './clothes';
import { requestAnimDict, requestAnimSet } from './animation';

const bombasCombustivel = [mp.game.joaat('prop_gas_pump_1a'), mp.game.joaat('prop_gas_pump_1b'), mp.game.joaat('prop_gas_pump_1c'), mp.game.joaat('prop_gas_pump_1d'),
mp.game.joaat('prop_gas_pump_old2'), mp.game.joaat('prop_gas_pump_old3'), mp.game.joaat('prop_vintage_pump'),
  3586947594 // LSSD Davis
];
const directions = [
  { name: 'Norte', value: 0 },
  { name: 'Oeste', value: 90 },
  { name: 'Sul', value: 180 },
  { name: 'Leste', value: 270 },
  { name: 'Norte', value: 360 }
];
const player = mp.players.local;
const pointing = new Fingerpointing();
let streetName: string, zoneName: string, directionName: string, address: string;
let melee = false;
let money = 0;
let bank = 0;

mp.storage.data.animationDic = null;
mp.storage.data.animationName = null;
mp.storage.data.animationFreeze = null;
mp.storage.data.animationFlag = null;
mp.storage.data.animationAllowPlayerControl = null;
mp.storage.data.f7 = false;
mp.storage.data.movement = null;
mp.storage.data.aduty = false;
mp.storage.data.anametag = false;

function isDriver() {
  return player.vehicle && player.vehicle.getPedInSeat(-1) == player.handle;
}

setInterval(() => {
  if (!player.hasVariable(Constants.PLAYER_META_DATA_NAMETAG))
    return;

  webView.call(Constants.HUD_PAGE_UPDATE_PLAYER_COUNT, mp.players.length);
  updateHudWeaponAmmo();
  updateCellphone();

  melee = false;
}, 1_000);

mp.events.add('render', () => {
  if (!player.hasVariable(Constants.PLAYER_META_DATA_NAMETAG))
    return;

  [zoneName, streetName] = getAddress(player.position);

  mp.game.controls.disableControlAction(0, 200, true); // ESC
  mp.game.ui.displayAmmoThisFrame(false);
  mp.game.ui.hideHudComponentThisFrame(6);
  mp.game.ui.hideHudComponentThisFrame(7);
  mp.game.ui.hideHudComponentThisFrame(8);
  mp.game.ui.hideHudComponentThisFrame(9);

  player.setConfigFlag(429, true); // PED_FLAG_DISABLE_STARTING_VEH_ENGINE
  player.setConfigFlag(241, true); // PED_FLAG_DISABLE_STOPPING_VEH_ENGINE
  player.setConfigFlag(184, true); // PED_FLAG_DISABLE_SHUFFLING_TO_DRIVER_SEAT

  player.setSuffersCriticalHits(false);
  mp.game.player.setHealthRechargeMultiplier(0.0);

  if (player.isPerformingStealthKill())
    player.clearTasksImmediately();

  mp.players.local.setStealthMovement(false, "0");
  mp.game.controls.disableControlAction(0, 36, true); // disable stealth mode

  if (!mp.game.ui.isRadarHidden()) { // Hidden health and armour
    mp.game.graphics.pushScaleformMovieFunction(1, 'SETUP_HEALTH_ARMOUR');
    mp.game.graphics.scaleformMovieMethodAddParamInt(3);
    mp.game.graphics.endScaleformMovieMethod();
  }

  if (player.vehicle) {
    if (player.vehicle.hasVariable(Constants.VEHICLE_META_DATA_ATTACHED)) {
      mp.game.controls.disableControlAction(0, 71, true); // INPUT_VEH_ACCELERATE
      mp.game.controls.disableControlAction(0, 72, true); // INPUT_VEH_BRAKE
    }

    player.setHelmet(false);

    if (isDriver()) {
      // Desabilitar X em motos
      if (player.vehicle.wheelCount == 2) {
        mp.game.controls.disableControlAction(0, 73, true); // INPUT_VEH_DUCK
        mp.game.controls.disableControlAction(0, 345, true); // INPUT_VEH_MELEE_HOLD
        mp.game.controls.disableControlAction(0, 346, true); // INPUT_VEH_MELEE_LEFT
        mp.game.controls.disableControlAction(0, 347, true); // INPUT_VEH_MELEE_RIGHT
      }

      const roll = player.vehicle.getRoll();
      if ((roll > 75.0 || roll < -75.0) && player.vehicle.getSpeed() < 2) {
        mp.game.controls.disableControlAction(0, 59, true);
        mp.game.controls.disableControlAction(0, 60, true);
      }
    }
  } else {
    // Desabilitar coronhada
    if (mp.game.weapon.isPedArmed(player.handle, 6)) {
      mp.game.controls.disableControlAction(0, 140, true);
      mp.game.controls.disableControlAction(0, 141, true);
      mp.game.controls.disableControlAction(0, 142, true);
    }

    // Desabilitar tiro as cegas
    if (player.isInCover(true) && !player.isAimingFromCover()) {
      mp.game.controls.disableControlAction(0, 24, true);
      mp.game.controls.disableControlAction(0, 142, true);
      mp.game.controls.disableControlAction(0, 257, true);
    }

    // Desabilitar rolamento
    if (player.isReloading() ||
      player.getConfigFlag(78, true) ||
      mp.game.player.isFreeAiming() ||
      mp.game.controls.isControlJustPressed(1, 25))
      mp.game.controls.disableControlAction(0, 22, true); // Space Bar

    // Melee Shift + G
    if (mp.game.event.isShockingInSphere(112, player.position.x, player.position.y, player.position.z, 1.0)) {
      melee = true;
      if (melee)
        mp.game.controls.disableControlAction(0, 24, true);
    }

    mp.game.controls.disableControlAction(0, 23, true); // F

    if (mp.storage.data.animationDic) {
      mp.game.controls.disableControlAction(0, 22, true); // Space Bar
      mp.game.controls.disableControlAction(0, 24, true);
      mp.game.controls.disableControlAction(0, 25, true);
      mp.game.controls.disableControlAction(0, 140, true);
      mp.game.controls.disableControlAction(0, 141, true);
      mp.game.controls.disableControlAction(0, 142, true);
      mp.game.controls.disableControlAction(0, 257, true);
    }
  }
});

setInterval(() => {
  if (mp.storage.data.f7)
    return;

  webView.call(Constants.HUD_PAGE_UPDATE_MINIMAP, JSON.stringify(getMinimap()));
  webView.call(Constants.HUD_PAGE_UPDATE_HEALTH_ARMOR, player.getHealth(), player.getArmour());
  webView.call(Constants.HUD_PAGE_UPDATE_MONEY, money);
  webView.call(Constants.HUD_PAGE_UPDATE_BANK, bank);

  if (streetName != '' && zoneName != '') {
    const direction = player.vehicle ? player.vehicle.getHeading() : player.getHeading();
    directions.forEach(x => {
      if (Math.abs(direction - x.value) < 45)
        directionName = x.name;
    });

    webView.call(Constants.HUD_PAGE_UPDATE_DIRECTIONS, directionName, address ? address : `${zoneName}, ${streetName}`);
  }

  const isDriverValue = isDriver();
  if (isDriverValue) {
    const fuel = player.vehicle.getVariable(Constants.VEHICLE_META_DATA_FUEL) as number;
    webView.call(Constants.HUD_PAGE_UPDATE_VEHICLE_INFO, fuel, player.vehicle.getSpeed() * 3.6, cruiseSpeed > 0);
  }

  webView.call(Constants.HUD_PAGE_UPDATE_IN_VEHICLE, isDriverValue);
}, 500);

mp.events.add('SetAddress', (setAddress: string) => {
  address = setAddress;
});

mp.keys.bind(Constants.ESC_KEY, true, () => {
  if (checkKey(Constants.ESC_KEY))
    return;

  mp.game.ui.setFrontendActive(true);
});

// F5
mp.keys.bind(116, true, () => {
  if (checkKey(116))
    return;

  callRemoteEvent('NoClip');
});

// F6
mp.keys.bind(117, true, () => {
  if (checkKey(117))
    return;

  changeFiringMode();
});

// HOME
mp.keys.bind(36, true, () => {
  if (checkKey(36))
    return;

  callRemoteEvent('OpenCellphone');
});

mp.keys.bind(Constants.DELETE_KEY, true, () => {
  if (checkKey(Constants.DELETE_KEY))
    return;

  callRemoteEvent('KeyDelete');
});

// K
mp.keys.bind(75, true, () => {
  if (checkKey(75))
    return;

  callRemoteEvent('KeyK');
});

// Y
mp.keys.bind(89, true, () => {
  if (checkKey(89))
    return;

  callRemoteEvent('KeyY');
});

// E
mp.keys.bind(69, true, () => {
  if (checkKey(69))
    return;

  detectObject();
});

// O
mp.keys.bind(79, true, () => {
  if (checkKey(79))
    return;

  callRemoteEvent('ShowPlayerList');
});

// F4
mp.keys.bind(115, true, () => {
  if (checkKey(115))
    return;

  mp.console.logInfo('F4 keydown');
});

// J
mp.keys.bind(74, true, () => {
  if (checkKey(74))
    return;

  toggleCruise();
});

// Z
mp.keys.bind(90, true, () => {
  if (checkKey(90))
    return;

  toggleCrouch();
});

// L
mp.keys.bind(76, true, () => {
  if (checkKey(76))
    return;

  callRemoteEvent('KeyL');
});

// I
mp.keys.bind(73, true, () => {
  if (checkKey(73))
    return;

  callRemoteEvent('ShowInventory');
});

mp.keys.bind(Constants.F2_KEY, true, () => {
  if (checkKey(Constants.F2_KEY))
    return;

  toggleView(!mp.gui.cursor.visible);
});

// B
mp.keys.bind(66, true, () => {
  if (checkKey(66))
    return;

  if (mp.storage.data.animationDic) return;

  if (pointing.active) pointing.stop();
  else if (!player.vehicle) pointing.start();
});

// F7
mp.keys.bind(118, true, () => {
  if (checkKey(118))
    return;

  const f7 = !mp.storage.data.f7 as boolean;
  mp.storage.data.f7 = f7;
  activateChat(!f7);
  mp.game.ui.displayHud(!f7);
  mp.game.ui.displayRadar(!f7);
  toggleMarkers(!f7);
});

// Q
mp.keys.bind(81, true, () => {
  if (checkKey(81))
    return;

  if (isDriver()) {
    const hasMutedSirens = !(player.vehicle.getVariable(Constants.VEHICLE_META_DATA_HAS_MUTED_SIRENS) as boolean);
    callRemoteEvent('SetVehicleHasMutedSirens', hasMutedSirens);
  }
});

// G
mp.keys.bind(71, true, () => {
  if (checkKey(71))
    return;

  enterVehicleAsPassenger().catch((res) => {
    mp.console.logError(res);
  });
});

// F
mp.keys.bind(70, true, () => {
  if (checkKey(70))
    return;

  enterVehicleAsDriver().catch((res) => {
    mp.console.logError(res);
  });
});

mp.keys.bind(Constants.SHIFT_KEY, true, () => {
  if (isDriver())
    callRemoteEvent('ActiveVehicleDriftMode');
});

mp.keys.bind(Constants.SHIFT_KEY, false, () => {
  if (checkKey(Constants.SHIFT_KEY))
    return;

  if (isDriver())
    callRemoteEvent('DeactiveVehicleDriftMode');
});

// F8
mp.keys.bind(119, true, () => {
  if (checkKey(119))
    return;

  const time = mp.game.time.getLocalTime();
  const screenName = `lsc-${time.year}-${time.month}-${time.day}-${time.hour}-${time.minute}-${time.second}.png`;
  mp.gui.takeScreenshot(screenName, 1, 100, 0);
  chatNotifiy('Screenshot salva com sucesso.', 'success');
});

const checkKey = (key: number) => {
  return (!player.hasVariable(Constants.PLAYER_META_DATA_NAMETAG) && key !== Constants.F2_KEY)
    || player.getVariable(Constants.PLAYER_META_DATA_CHATTING)
    || (hasPageOpened() && key !== Constants.F2_KEY)
    || mp.game.ui.isPauseMenuActive()
    || (player.getVariable('Frozen') && key !== Constants.DELETE_KEY && key !== Constants.F2_KEY);
};

mp.events.add(Constants.HUD_PAGE_UPDATE_DRIFT_MODE, (state: boolean) => {
  webView.call(Constants.HUD_PAGE_UPDATE_DRIFT_MODE, state);
});

let crouch = false;
function toggleCrouch() {
  if (player.vehicle || player.getVariable(Constants.PLAYER_META_DATA_INJURED) != 0)
    return;

  requestAnimSet('move_ped_crouched').then(() => {
    requestAnimSet('move_ped_crouched_strafing').then(() => {
      if (crouch) {
        player.resetStrafeClipset();
        player.resetMovementClipset(0.2);

        const movement = mp.storage.data.movement as string;
        if (movement)
          player.setMovementClipset(movement, 0.2);
      } else {
        player.setStrafeClipset('move_ped_crouched_strafing');
        player.setMovementClipset('move_ped_crouched', 0.2);
      }

      crouch = !crouch;
    });
  });
}

let cruiseSpeed = 0;

function renderCruise() {
  if (!player.vehicle || mp.game.controls.isControlJustPressed(2, 76) || mp.game.controls.isControlJustPressed(2, 72)
    || mp.game.controls.isControlJustPressed(2, 75) || mp.game.controls.isControlJustPressed(2, 71)
    || player.vehicle.isInAir() || player.vehicle.hasCollidedWithAnything()
    || !player.vehicle.getIsEngineRunning() || player.vehicle.isInWater()) {
    toggleCruise();
    return;
  }

  player.vehicle.setForwardSpeed(cruiseSpeed);
}

function toggleCruise() {
  if (!isDriver())
    return;

  if (cruiseSpeed == 0) {
    const speed = player.vehicle.getSpeed();
    if (speed <= 19.5 && speed > 0 && player.vehicle.gear > 0) { // 70 KM/H
      cruiseSpeed = speed;
      mp.events.add('render', renderCruise);
    } else {
      chatNotifiy('Veículo precisa estar em movimento e abaixo de 70 km/h.', 'error');
    }
  } else {
    cruiseSpeed = 0;
    mp.events.remove('render', renderCruise);
  }
}

mp.events.add('Server:RequestIpl', (ipl: string) => {
  mp.game.streaming.requestIpl(ipl);
});

mp.events.add('Server:RemoveIpl', (ipl: string) => {
  mp.game.streaming.removeIpl(ipl);
});

mp.events.add('Server:SetWaypoint', (x, y) => {
  mp.game.ui.setNewWaypoint(x, y);
});

mp.events.add('SetVehicleDoorState', (vehicle: VehicleMp, door: number, state: boolean) => {
  if (state)
    vehicle.setDoorShut(door, false);
  else
    vehicle.setDoorOpen(door, false, false);
});

mp.events.add('Server:setArtificialLightsState', (state) => {
  mp.game.graphics.setBlackout(state);
  mp.game.graphics.setArtificialLightsStateAffectsVehicles(false);
  mp.game.graphics.setArtificialLightsState(state);
});

mp.events.add('SetVehicleMaxSpeed', (speed) => {
  player.vehicle.setMaxSpeed(speed);
});

mp.events.add('SetPlayerCanDoDriveBy', (state) => {
  mp.game.player.setCanDoDriveBy(state);
});

mp.events.add('TaskRappelFromHeli', () => {
  player.taskRappelFromHeli(10.0);
});

mp.events.add('Server:DisableHUD', disableHud);
function disableHud() {
  mp.game.ui.displayHud(false);
  mp.game.ui.displayRadar(false);
  activateChat(false);
  mp.storage.data.f7 = false;
}

disableHud();
configureEvent(Constants.LOGIN_REQUEST_DISCORD_TOKEN, requestDiscordToken);
toggleView(true);

async function requestDiscordToken() {
  try {
    const token = await mp.discord.requestOAuth2(Constants.DISCORD_APP_ID);
    const resolution = mp.game.graphics.getActiveScreenResolution();
    callRemoteEvent('ValidateDiscordToken', token, resolution.x, resolution.y);
  } catch (ex: any) {
    mp.console.logError(ex);
    chatNotifiy(ex.toString(), 'error');
  }
}

mp.events.add('Server:ListarPersonagens', (charactersJson: string, slots: number) => {
  setPages([Constants.CHARACTERS_PAGE], [Constants.LOGIN_PAGE, Constants.AJAIL_INFO_PAGE]);
  toggleView(true);
  configureEvent(Constants.CHARACTERS_PAGE_SHOW, () => {
    webView.call(Constants.CHARACTERS_PAGE_SHOW, charactersJson, slots);
  });
  configureEvent(Constants.CHARACTERS_PAGE_SELECT_CHARACTER, (id: string) => {
    callRemoteEvent('SelectCharacter', id);
  });
  configureEvent(Constants.CHARACTERS_PAGE_REFRESH, () => {
    callRemoteEvent('ListCharacters');
  });
  webView.call(Constants.CHARACTERS_PAGE_SHOW, charactersJson, slots);
});

mp.events.add('ShowAjailInfo', (message: string) => {
  setPages([Constants.AJAIL_INFO_PAGE], []);
  configureEvent(Constants.AJAIL_INFO_PAGE_SHOW, () => {
    webView.call(Constants.AJAIL_INFO_PAGE_SHOW, message);
  });
  webView.call(Constants.AJAIL_INFO_PAGE_SHOW, message);
  toggleView(true);
});

mp.events.add('Server:SelecionarPersonagem', (personalizationStep: number, sex: number, personalizationJson: string,
  outfitsJson: string, outfitJson: string, maxOutfit: number) => {
  setPages([], [Constants.CHARACTERS_PAGE]);
  toggleView(false);

  mp.game.cam.destroyAllCams(true);
  mp.game.cam.renderScriptCams(false, false, 0, false, false, 0);

  if (personalizationStep == 4) {
    setPages([], [Constants.CHARACTERS_PAGE]);
    activateChat(true);
    mp.game.ui.displayHud(true);
    mp.game.ui.displayRadar(true);
  } else if (personalizationStep == 1) {
    handleCharacterEdit(sex, personalizationJson, outfitJson, 1);
  } else if (personalizationStep == 2) {
    handleTattoosEdit(sex, personalizationJson, outfitJson, false);
  } else if (personalizationStep == 3) {
    handleClothesEdit(1, maxOutfit, outfitsJson, 0, sex, 0, personalizationJson, outfitJson);
  }
});

mp.events.add('alt:log', (msg) => {
  mp.console.logInfo(msg);
});

mp.events.add('RefuelVehicle', (vehicle: number, percentage: number) => {
  let hasFuelPumpNearby = false;
  bombasCombustivel.forEach(bomb => {
    if (hasFuelPumpNearby)
      return;

    const object = mp.game.object.getClosestObjectOfType(player.position.x, player.position.y, player.position.z, 2.0, bomb, false, false, false);
    hasFuelPumpNearby = object != 0;
  });

  if (!hasFuelPumpNearby) {
    chatNotifiy('Você não está próximo de uma bomba de combustível.', 'error');
    return;
  }

  callRemoteEvent('RefuelVehicle', vehicle, percentage);
});

mp.events.add('Server:VerificarSoltarSacoLixo', (vehicle: VehicleMp) => {
  const bone = vehicle.getBoneIndexByName('platelight');
  const pos = vehicle.getWorldPositionOfBone(bone);
  callRemoteEvent('SoltarSacoLixo', pos.x, pos.y, pos.z);
});

mp.events.add('Waypoint', () => {
  const waypoint = mp.game.ui.getFirstBlipInfoId(8);

  if (mp.game.ui.doesBlipExist(waypoint)) {
    const coords = mp.game.ui.getBlipInfoIdCoord(waypoint);
    getRightCoordsZ(coords.x, coords.y, coords.z).then((res) => {
      callRemoteEvent('Waypoint', res.x, res.y, res.z);
    });
    return;
  }

  chatNotifiy('Você não possui um waypoint marcado no mapa.', 'error');
});

mp.events.add('Server:ListarPlayers', (playersJson: string, footerJson: string) => {
  setPages([Constants.PLAYER_LIST_PAGE], []);
  configureEvent(Constants.PLAYER_LIST_PAGE_SHOW, () => {
    webView.call(Constants.PLAYER_LIST_PAGE_SHOW, playersJson, footerJson);
  });
  configureEvent(Constants.PLAYER_LIST_PAGE_CLOSE, () => {
    setPages([], [Constants.PLAYER_LIST_PAGE]);
    toggleView(false);
  });
  webView.call(Constants.PLAYER_LIST_PAGE_SHOW, playersJson, footerJson);
});

mp.events.add('SyncWeather', (weather: string) => {
  mp.game.gameplay.setOverrideWeather(weather);
});

let currentHour = 0;
let currentMinute = 0;
let currentSecond = 0;
mp.events.add('SyncTime', (hour: number, minute: number, second: number) => {
  currentHour = hour;
  currentMinute = hour;
  currentSecond = hour;
  mp.game.time.setTime(currentHour, currentMinute, currentSecond);
});

mp.events.add('playerSpawn', (player) => {
  mp.game.time.setTime(currentHour, currentMinute, currentSecond);
});

mp.events.add('SetMovement', (movement: string) => {
  player.resetStrafeClipset()
  player.resetMovementClipset(0.2);
  mp.storage.data.movement = movement;
  crouch = false;

  if (!movement)
    return;

  requestAnimSet(movement).then(() => {
    player.setMovementClipset(movement, 0.2);
  });
});

mp.events.add('PropertyUpgrade', (title: string, propertyId: string, itemsJson: string) => {
  setPages([Constants.PROPERTY_UPGRADE_PAGE], []);
  webView.call(Constants.PROPERTY_UPGRADE_PAGE_SHOW, title, itemsJson);
  configureEvent(Constants.PROPERTY_UPGRADE_PAGE_CLOSE, () => {
    setPages([], [Constants.PROPERTY_UPGRADE_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.PROPERTY_UPGRADE_PAGE_CONFIRM, (name: string) => {
    callRemoteEvent('BuyPropertyUpgrade', propertyId, name);
  });
  toggleView(true);
});

mp.events.add('SetAreaName', () => {
  callRemoteEvent('SetAreaName', `${streetName}, ${zoneName}`);
});

let isFocused = true;
setInterval(() => {
  if (isFocused != mp.system.isFocused) {
    isFocused = mp.system.isFocused;
    callRemoteEvent('SetGameFocused', isFocused);
  }
}, 1000);

const updateHudWeaponAmmo = () => {
  webView.call(Constants.HUD_PAGE_UPDATE_AMMO,
    player.weapon != mp.game.joaat('weapon_unarmed'),
    player.getAmmoInClip(player.weapon),
    player.weaponAmmo);
}

mp.events.add('playerWeaponShot', (targetPosition, targetEntity) => {
  updateHudWeaponAmmo();
  getRightCoordsZ(player.position.x, player.position.y, player.position.z).then(pos => {
    callRemoteEvent('UpdateWeaponAmmo', player.weapon.toString(), pos);
  });
});

mp.events.add('SpawnFactionVehicle', (factionName: string, vehiclesJson: string) => {
  setPages([Constants.FACTION_VEHICLES_PAGE], []);
  configureEvent(Constants.FACTION_VEHICLES_PAGE_SHOW, () => {
    webView.call(Constants.FACTION_VEHICLES_PAGE_SHOW, factionName, vehiclesJson);
  });
  configureEvent(Constants.FACTION_VEHICLES_PAGE_CLOSE, () => {
    setPages([], [Constants.FACTION_VEHICLES_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.FACTION_VEHICLES_PAGE_SPAWN, (vehicleId: string) => {
    callRemoteEvent('SpawnFactionVehicle', vehicleId);
  });
  toggleView(true);
  webView.call(Constants.FACTION_VEHICLES_PAGE_SHOW, factionName, vehiclesJson);
});

mp.events.add('FactionVehiclesPage:CloseServer', () => {
  setPages([], [Constants.FACTION_VEHICLES_PAGE]);
  toggleView(false);
});

const closeCrackDenPage = () => {
  setPages([], [Constants.CRACK_DEN_PAGE]);
  toggleView(false);
};

mp.events.add('ShowCrackDen', (itemsJson: string, crackDenId: string) => {
  setPages([Constants.CRACK_DEN_PAGE], []);
  webView.call(Constants.CRACK_DEN_PAGE_SHOW, itemsJson);
  configureEvent(Constants.CRACK_DEN_PAGE_CLOSE, closeCrackDenPage);
  configureEvent(Constants.CRACK_DEN_PAGE_SELL_ITEM, (crackDenItemId: string, quantity: number) => {
    callRemoteEvent('CrackDenSellItem', crackDenItemId, quantity);
  });
  configureEvent(Constants.CRACK_DEN_PAGE_VIEW_SALES, () => {
    closeCrackDenPage();
    callRemoteEvent('CrackDenShowSales', crackDenId);
  });
  toggleView(true);
});

mp.events.add('TruckerLocations', (locationsJson: string) => {
  setPages([Constants.TRUCKER_LOCATIONS_PAGE], []);
  webView.call(Constants.TRUCKER_LOCATIONS_PAGE_SHOW, locationsJson);
  configureEvent(Constants.TRUCKER_LOCATIONS_PAGE_CLOSE, () => {
    setPages([], [Constants.TRUCKER_LOCATIONS_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.TRUCKER_LOCATIONS_PAGE_TRACK, (posX: number, posZ: number) => {
    chatNotifiy('Localização marcada no GPS.', 'success');
    mp.game.ui.setNewWaypoint(posX, posZ);
  });
  toggleView(true);
});

mp.events.add('ViewCharacterWounds', (name: string, woundsJson: string, staffVision: boolean) => {
  setPages([Constants.CHARACTER_WOUNDS_PAGE], []);
  configureEvent(Constants.CHARACTER_WOUNDS_PAGE_SHOW, () => {
    webView.call(Constants.CHARACTER_WOUNDS_PAGE_SHOW, name, woundsJson, staffVision);
  });
  configureEvent(Constants.CHARACTER_WOUNDS_PAGE_CLOSE, () => {
    toggleView(false);
    setPages([], [Constants.CHARACTER_WOUNDS_PAGE]);
  });
  toggleView(true);
  webView.call(Constants.CHARACTER_WOUNDS_PAGE_SHOW, name, woundsJson, staffVision);
});

mp.events.add('ViewVehicleDamages', (name: string, damagesJson: string, staffVision: boolean) => {
  setPages([Constants.VEHICLE_DAMAGES_PAGE], []);
  configureEvent(Constants.VEHICLE_DAMAGES_PAGE_SHOW, () => {
    webView.call(Constants.VEHICLE_DAMAGES_PAGE_SHOW, name, damagesJson, staffVision);
  });
  configureEvent(Constants.VEHICLE_DAMAGES_PAGE_CLOSE, () => {
    toggleView(false);
    setPages([], [Constants.VEHICLE_DAMAGES_PAGE]);
  });
  toggleView(true);
  webView.call(Constants.VEHICLE_DAMAGES_PAGE_SHOW, name, damagesJson, staffVision);
});

mp.events.add('ViewCrackDenSales', (title: string, salesJson: string) => {
  setPages([Constants.CRACK_DEN_SALES_PAGE], []);
  webView.call(Constants.CRACK_DEN_SALES_PAGE_SHOW, title, salesJson);
  configureEvent(Constants.CRACK_DEN_SALES_PAGE_CLOSE, () => {
    toggleView(false);
    setPages([], [Constants.CRACK_DEN_SALES_PAGE]);
  });
  toggleView(true);
});

mp.events.add('ViewBanishmentInfo', (banishmentJson: string) => {
  setPages([Constants.BANISHMENT_INFO_PAGE], [Constants.LOGIN_PAGE]);
  webView.call(Constants.BANISHMENT_INFO_PAGE_SHOW, banishmentJson);
  toggleView(true);
});

mp.events.add('ToggleAduty', (toggle: boolean) => {
  mp.storage.data.aduty = toggle;
  webView.call(Constants.HUD_PAGE_UPDATE_ADMIN_DUTY, toggle);
});

function getMinimap() {
  const aspectRatio = mp.game.graphics.getAspectRatio(false);
  const { x: w, y: h } = mp.game.graphics.getActiveScreenResolution();
  let width = w / (4 * aspectRatio);
  let height = h / 5.674;
  mp.game.graphics.setScriptGfxAlign(76, 66);
  const response = mp.game.graphics.getScriptGfxPosition(-0.0045, 0.002 + -0.188888);
  let x = response.calculatedX;
  let y = response.calculatedY;
  x = x * w + h * 0.0074;
  y += y * h + h * 0.0095;
  mp.game.graphics.resetScriptGfxAlign();
  const safeZone = mp.game.graphics.getSafeZoneSize();

  // if needed uncomment this for big map
  // width = (width / w) * 1.587 * w;
  // y -= height * 1.34;
  // height = (height / h) * 2.34 * h;

  return {
    x,
    y,
    top: y,
    left: x,
    bottom: y + height,
    right: x + width,
    width,
    height,
    aspectRatio,
    safeZone,
    screenWidth: w,
    screenHeight: h,
  };
}

mp.events.add('CreateBlood', () => {
  getRightCoordsZ(player.position.x, player.position.y, player.position.z).then(pos => {
    callRemoteEvent('CreateBlood', pos);
  });
});

mp.events.add('AcceptDeath', (ck: boolean) => {
  callRemoteEvent('AcceptDeath', ck, `${zoneName}, ${streetName}`);
});

mp.events.add(Constants.HUD_PAGE_UPDATE_MONEY, (value: number) => {
  money = value;
});

mp.events.add(Constants.HUD_PAGE_UPDATE_BANK, (value: number) => {
  bank = value;
});

mp.events.add('ToggleAmbientSound', (active: boolean) => {
  if (active) {
    mp.game.audio.stopAudioScene("DLC_MPHEIST_TRANSITION_TO_APT_FADE_IN_RADIO_SCENE") // removes the music
    mp.game.audio.setStaticEmitterEnabled("LOS_SANTOS_VANILLA_UNICORN_01_STAGE", true) // disables the audio from unicorn
    mp.game.audio.setStaticEmitterEnabled("LOS_SANTOS_VANILLA_UNICORN_02_MAIN_ROOM", true) // disables the audio from unicorn
    mp.game.audio.setStaticEmitterEnabled("LOS_SANTOS_VANILLA_UNICORN_03_BACK_ROOM", true) // disables the audio from unicorn
    mp.game.audio.clearAmbientZoneState("AZL_DLC_Hei4_Island_Zones", false) // cayo ambient
    mp.game.audio.clearAmbientZoneState("AZL_DLC_Hei4_Island_Disabled_Zones", false)  // cayo ambient
    mp.game.audio.stopAudioScene("FBI_HEIST_H5_MUTE_AMBIENCE_SCENE") // mute fib ambience
    mp.game.audio.stopAudioScene("CHARACTER_CHANGE_IN_SKY_SCENE") // starts the sky scene audio if you use a another audio scene e.g DLC_VW_Casino_General you must stop the CHARACTER_CHANGE_IN_SKY_SCENE audio scene before starting the another scene
    mp.game.audio.setAudioFlag("PoliceScannerDisabled", false) // Disables the police scanner audio functionality
    mp.game.audio.setAudioFlag("DisableFlightMusic", false) // Disables the flight audio functionality  game.startAudioScene("FBI_HEIST_H5_MUTE_AMBIENCE_SCENE"); // Used to stop police sound in town
    mp.game.audio.setAmbientZoneState("AZ_COUNTRYSIDE_PRISON_01_ANNOUNCER_GENERAL", true, true); // Turn off prison sound
    mp.game.audio.setAmbientZoneState("AZ_COUNTRYSIDE_PRISON_01_ANNOUNCER_WARNING", true, true); // Turn off prison sound
    mp.game.audio.setAmbientZoneState("AZ_COUNTRYSIDE_PRISON_01_ANNOUNCER_ALARM", true, true); // Turn off prison sound
    mp.game.audio.setAmbientZoneState("AZ_DISTANT_SASQUATCH", true, true); // Turn off sasquatch sounds
  } else {
    mp.game.audio.startAudioScene("DLC_MPHEIST_TRANSITION_TO_APT_FADE_IN_RADIO_SCENE") // removes the music
    mp.game.audio.setStaticEmitterEnabled("LOS_SANTOS_VANILLA_UNICORN_01_STAGE", false) // disables the audio from unicorn
    mp.game.audio.setStaticEmitterEnabled("LOS_SANTOS_VANILLA_UNICORN_02_MAIN_ROOM", false) // disables the audio from unicorn
    mp.game.audio.setStaticEmitterEnabled("LOS_SANTOS_VANILLA_UNICORN_03_BACK_ROOM", false) // disables the audio from unicorn
    mp.game.audio.setAmbientZoneListStatePersistent("AZL_DLC_Hei4_Island_Zones", true, true) // cayo ambient
    mp.game.audio.setAmbientZoneListStatePersistent("AZL_DLC_Hei4_Island_Disabled_Zones", false, true)  // cayo ambien
    mp.game.audio.startAudioScene("FBI_HEIST_H5_MUTE_AMBIENCE_SCENE") // mute fib ambience
    mp.game.audio.startAudioScene("CHARACTER_CHANGE_IN_SKY_SCENE") // starts the sky scene audio if you use a another audio scene e.g DLC_VW_Casino_General you must stop the CHARACTER_CHANGE_IN_SKY_SCENE audio scene before starting the another scene
    mp.game.audio.setAudioFlag("PoliceScannerDisabled", true) // Disables the police scanner audio functionality
    mp.game.audio.setAudioFlag("DisableFlightMusic", true) // Disables the flight audio functionality  game.startAudioScene("FBI_HEIST_H5_MUTE_AMBIENCE_SCENE"); // Used to stop police sound in town
    mp.game.audio.cancelCurrentPoliceReport(); // Used to stop default police radio around/In police vehicle
    mp.game.audio.clearAmbientZoneState("AZ_COUNTRYSIDE_PRISON_01_ANNOUNCER_GENERAL", false); // Turn off prison sound
    mp.game.audio.clearAmbientZoneState("AZ_COUNTRYSIDE_PRISON_01_ANNOUNCER_WARNING", false); // Turn off prison sound
    mp.game.audio.clearAmbientZoneState("AZ_COUNTRYSIDE_PRISON_01_ANNOUNCER_ALARM", false); // Turn off prison sound
    mp.game.audio.clearAmbientZoneState("AZ_DISTANT_SASQUATCH", false); // Turn off sasquatch sounds
  }
});

mp.events.add('ToggleSeatbelt', (state: boolean) => {
  player.setConfigFlag(32, state);
})

mp.events.add('RemoveFromVehicle', () => {
  player.taskLeaveVehicle(player.vehicle.handle, 0);
});

mp.events.add('ToggleDebug', (debug: boolean) => {
  Constants.DEBUG = debug;
  webView.call(Constants.WEB_VIEW_SET_DEBUG, debug);
});

mp.events.add('SpectatePlayer', (target: PlayerMp, toggle: boolean) => {
  if (!toggle) {
    mp.game.invoke('0x423DE3854BB50894', false, player.handle);
    return;
  }

  mp.game.invoke('0x423DE3854BB50894', false, target.handle);
});

mp.events.add('GetScreenTarget', (targetId: number) => {
  const time = mp.game.time.getLocalTime();
  const screenName = `lsc-${time.year}-${time.month}-${time.day}-${time.hour}-${time.minute}-${time.second}.png`;
  mp.gui.takeScreenshot(screenName, 1, 100, 0);
  configureEvent('SendScreenTarget', (targetId: number, value: string, index: number, length: number) => {
    callRemoteEvent('SendScreenTarget', targetId, value, index, length);
  });
  setTimeout(() => {
    webView.call(Constants.WEB_VIEW_GET_SCREEN, targetId, `http://screenshots/${screenName}`);
  }, 10_000);
});

let screens: { info: string, index: number }[] = [];
mp.events.add('GetScreenStaff', (info: string, index: number, length: number) => {
  screens.push({ info, index });
  if (screens.length != length)
    return;

  const url = `data:image/jpeg;base64,${screens.sort((a, b) => a.index - b.index).map(x => x.info).join('')}`;
  screens = [];

  setPages([Constants.IMAGE_PAGE], []);
  configureEvent(Constants.IMAGE_PAGE_SHOW, () => {
    webView.call(Constants.IMAGE_PAGE_SHOW, url);
  });
  configureEvent(Constants.IMAGE_PAGE_CLOSE, () => {
    setPages([], [Constants.IMAGE_PAGE]);
    toggleView(false);
  });
  toggleView(true);
  webView.call(Constants.IMAGE_PAGE_SHOW, url);
});

mp.events.add('ToggleAnametag', (toggle: boolean) => {
  mp.storage.data.anametag = toggle;
});

mp.events.add('ClearBloodDamage', () => {
  player.clearBloodDamage();
});

mp.events.add('entityStreamIn', (entity) => {
  if (entity.type !== RageEnums.EntityType.PLAYER)
    return;

  checkPlayerVisible(entity, entity.getVariable('Visible') as boolean);
  entity.freezePosition(entity.getVariable('Frozen') as boolean);
  checkPlayerAttach(entity, entity.getVariable('AttachToPlayer') as string);
  checkPlayerAnimation(entity, entity.getVariable('Animation') as string);
  checkPlayerAccessories(entity, entity.getVariable('Accessories') as string);
});

mp.events.addDataHandler('Visible', (entity, value, oldValue) => {
  if (entity.type !== RageEnums.EntityType.PLAYER || entity.handle == 0 || !entity.doesExist())
    return;

  checkPlayerVisible(entity, value);
});

mp.events.addDataHandler('Frozen', (entity, value, oldValue) => {
  if (entity.type !== RageEnums.EntityType.PLAYER || entity.handle == 0 || !entity.doesExist())
    return;

  entity.freezePosition(value);
});

mp.events.addDataHandler('AttachToPlayer', (entity, value, oldValue) => {
  if (entity.type !== RageEnums.EntityType.PLAYER || entity.handle == 0 || !entity.doesExist())
    return;

  checkPlayerAttach(entity, value);
});

mp.events.addDataHandler('Animation', (entity, value, oldValue) => {
  if (entity.type !== RageEnums.EntityType.PLAYER || entity.handle == 0 || !entity.doesExist())
    return;

  checkPlayerAnimation(entity, value);
});

mp.events.addDataHandler('Accessories', (entity, value, oldValue) => {
  if (entity.type !== RageEnums.EntityType.PLAYER || entity.handle == 0 || !entity.doesExist())
    return;

  checkPlayerAccessories(entity, value);
});

const checkPlayerVisible = (entity: EntityMp, visible: boolean) => {
  entity.freezePosition(!visible);
  entity.setInvincible(!visible);
  entity.setVisible(visible, false);
  entity.setCollision(visible, visible);
  entity.setHasGravity(visible);
}

const checkPlayerAttach = (carried: EntityMp, attachJson: string) => {
  if (!attachJson) {
    carried.detach(false, false);
    return;
  }

  const attach = JSON.parse(attachJson);
  const carrier = mp.players.atRemoteId(attach.id);
  mp.game.waitForAsync(() => carrier?.handle !== 0 && carrier.doesExist(), 10_000)
    .then((res: any) => {
      if (!res)
        return;

      carried.attachTo(carrier.handle, attach.bone,
        attach.position.x, attach.position.y, attach.position.z,
        attach.rotation.x, attach.rotation.y, attach.rotation.z,
        false, false, false, false, 2, false);
      carried.setCollision(false, false);
    });
}

const checkPlayerAnimation = (entity: EntityMp, animationJson: string) => {
  const target = entity as PlayerMp;
  if (!animationJson) {
    target.clearTasks();
    return;
  }

  const animation = JSON.parse(animationJson);
  requestAnimDict(animation.dictionary).then(() => {
    target.taskPlayAnim(animation.dictionary, animation.name, 8, 8, -1, animation.flag, 1, false, false, false);
  });
}

mp.events.add('outgoingDamage', (sourceEntity, targetEntity, targetPlayer, weapon, boneIndex, damage) => {
  if (targetEntity?.type === 'player') {
    callRemoteEvent('OnPlayerDamage', targetEntity.remoteId, weapon.toString(), boneIndex);
    return true;
  }

  if (targetEntity?.type === 'vehicle') {
    callRemoteEvent('OnVehicleDamage', targetEntity.remoteId, weapon.toString(), boneIndex, damage);
    return false;
  }

  return true;
});

mp.events.add('RemoveWeapon', (weaponHash: number) => {
  player.removeWeapon(weaponHash);
});

mp.events.add('playerReady', () => {
  mp.game.vehicle.setExperimentalAttachmentSyncEnabled(true);
  mp.game.vehicle.setExperimentalHornSyncEnabled(true);
  mp.game.weapon.unequipEmptyWeapons = false;
  mp.game.hud.setScriptVariableColour(174, 106, 178, 255);
  mp.game.invoke('0x2ACCB195F3CCD9DE', 30);
  mp.game.clock.pauseClock(true);
  mp.game.stats.statSetInt(mp.game.joaat("SP0_STAMINA"), 50, false);
  mp.game.stats.statSetInt(mp.game.joaat("SP0_STRENGTH"), 10, false);
  mp.game.stats.statSetInt(mp.game.joaat("MP0_FLYING_ABILITY"), 100, false);
  mp.game.stats.statSetInt(mp.game.joaat("SP0_SHOOTING_ABILITY"), 20, false);
  mp.discord.update('Los Santos Chronicles', 'discord.gg/ls-chronicles');
});

mp.events.add('playerEnterVehicle', (vehicle, seat) => {
  mp.game.audio.setVehRadioStation(vehicle.handle, 'OFF');
});

setInterval(() => {
  // Disable idle camera
  mp.game.invoke('0x9E4CFFF989258472');
  mp.game.invoke('0xF4F2C0D4EE209E20');
}, 5_000);

mp.events.add('SetRagdoll', () => {
  player.setToRagdoll(2500, 5000, 1, false, false, false);
});

const checkPlayerAccessories = (entity: EntityMp, accessoriesJson: string) => {
  if (!accessoriesJson)
    return;
  const target = entity as PlayerMp;
  const accessories = JSON.parse(accessoriesJson);
  checkPlayerAccessory(target, 0, accessories.accessory0);
  checkPlayerAccessory(target, 1, accessories.accessory1);
  checkPlayerAccessory(target, 2, accessories.accessory2);
  checkPlayerAccessory(target, 6, accessories.accessory6);
  checkPlayerAccessory(target, 7, accessories.accessory7);
};

const checkPlayerAccessory = (target: PlayerMp, component: number, accessory: any) => {
  if (accessory.using && accessory.drawable != -1)
    target.setPropIndex(component, accessory.drawable, accessory.texture, true);
  else
    target.clearProp(component);
}