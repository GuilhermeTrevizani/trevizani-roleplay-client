import { Constants } from './constants';
import { distanceTo } from './cursor';

const player = mp.players.local;
const timeout = 7000;

function getClosestVehicle(radius: number): VehicleMp | null {
  try {
    let closestVeh = null;

    mp.vehicles.forEachInStreamRange(v => {
      const dist = mp.game.system.vdist(player.position.x, player.position.y, player.position.z,
        v.position.x, v.position.y, v.position.z);

      if (dist < radius) {
        radius = dist;
        closestVeh = v;
      }
    });

    return closestVeh;
  } catch (ex: any) {
    mp.console.logError(ex);
    return null;
  }
}

export async function enterVehicleAsDriver() {
  if (player.vehicle)
    return;

  if (mp.storage.data.animationFreeze) {
    if (Constants.DEBUG)
      mp.console.logInfo('enterVehicleAsDriver x1');
    return;
  }

  if (player.getVariable(Constants.PLAYER_META_DATA_INJURED) != 0) {
    if (Constants.DEBUG)
      mp.console.logInfo('enterVehicleAsDriver x2');
    return;
  }

  const vehicle = getClosestVehicle(7);
  if (!vehicle) {
    if (Constants.DEBUG)
      mp.console.logInfo('enterVehicleAsDriver x3');
    return;
  }

  if (!vehicle.isSeatFree(-1)) {
    if (Constants.DEBUG)
      mp.console.logInfo('enterVehicleAsDriver x4');
    return;
  }

  if (!mp.game.entity.hasClearLosToEntity(player.handle, vehicle.handle, 17)) {
    if (Constants.DEBUG)
      mp.console.logInfo('enterVehicleAsDriver x5');
    return;
  }

  if (Constants.DEBUG)
    mp.console.logInfo('enterVehicleAsDriver x6');
  player.taskEnterVehicle(vehicle.handle, timeout, -1, 1, 1, 0);
}

export async function enterVehicleAsPassenger() {
  if (player.vehicle)
    return;

  if (mp.storage.data.animationFreeze) {
    if (Constants.DEBUG)
      mp.console.logInfo('enterVehicleAsPassenger x1');
    return;
  }

  if (player.getVariable(Constants.PLAYER_META_DATA_INJURED) != 0) {
    if (Constants.DEBUG)
      mp.console.logInfo('enterVehicleAsPassenger x2');
    return;
  }

  const vehicle = getClosestVehicle(7);
  if (!vehicle) {
    if (Constants.DEBUG)
      mp.console.logInfo('enterVehicleAsPassenger x3');
    return;
  }

  if (!mp.game.entity.hasClearLosToEntity(player.handle, vehicle.handle, 17)) {
    if (Constants.DEBUG)
      mp.console.logInfo('enterVehicleAsPassenger x4');
    return;
  }

  if (mp.game.vehicle.isThisModelABike(vehicle.model)) {
    if (Constants.DEBUG)
      mp.console.logInfo('enterVehicleAsPassenger x5');

    if (!vehicle.isSeatFree(0)) {
      if (Constants.DEBUG)
        mp.console.logInfo('enterVehicleAsPassenger x6');
      return;
    }

    if (Constants.DEBUG)
      mp.console.logInfo('enterVehicleAsPassenger x7');
    player.taskEnterVehicle(vehicle.handle, timeout, 0, 1, 1, 0);
    return;
  }

  const seatRear = vehicle.getBoneIndexByName('seat_r');
  const seatFrontPassenger = vehicle.getBoneIndexByName('seat_pside_f');
  const seatRearDriver = vehicle.getBoneIndexByName('seat_dside_r');
  const seatRearDriver1 = vehicle.getBoneIndexByName('seat_dside_r1');
  const seatRearDriver2 = vehicle.getBoneIndexByName('seat_dside_r2');
  const seatRearDriver3 = vehicle.getBoneIndexByName('seat_dside_r3');
  const seatRearDriver4 = vehicle.getBoneIndexByName('seat_dside_r4');
  const seatRearDriver5 = vehicle.getBoneIndexByName('seat_dside_r5');
  const seatRearDriver6 = vehicle.getBoneIndexByName('seat_dside_r6');
  const seatRearDriver7 = vehicle.getBoneIndexByName('seat_dside_r7');
  const seatRearPassenger = vehicle.getBoneIndexByName('seat_pside_r');
  const seatRearPassenger1 = vehicle.getBoneIndexByName('seat_pside_r1');
  const seatRearPassenger2 = vehicle.getBoneIndexByName('seat_pside_r2');
  const seatRearPassenger3 = vehicle.getBoneIndexByName('seat_pside_r3');
  const seatRearPassenger4 = vehicle.getBoneIndexByName('seat_pside_r4');
  const seatRearPassenger5 = vehicle.getBoneIndexByName('seat_pside_r5');
  const seatRearPassenger6 = vehicle.getBoneIndexByName('seat_pside_r6');
  const seatRearPassenger7 = vehicle.getBoneIndexByName('seat_pside_r7');

  const seatRearPosition = seatRear === -1 ? null : vehicle.getWorldPositionOfBone(seatRear);
  const seatFrontPassengerPosition = seatFrontPassenger === -1 ? null : vehicle.getWorldPositionOfBone(seatFrontPassenger);
  const seatRearDriverPosition = seatRearDriver === -1 ? null : vehicle.getWorldPositionOfBone(seatRearDriver);
  const seatRearDriver1Position = seatRearDriver1 === -1 ? null : vehicle.getWorldPositionOfBone(seatRearDriver1);
  const seatRearDriver2Position = seatRearDriver2 === -1 ? null : vehicle.getWorldPositionOfBone(seatRearDriver2);
  const seatRearDriver3Position = seatRearDriver3 === -1 ? null : vehicle.getWorldPositionOfBone(seatRearDriver3);
  const seatRearDriver4Position = seatRearDriver4 === -1 ? null : vehicle.getWorldPositionOfBone(seatRearDriver4);
  const seatRearDriver5Position = seatRearDriver5 === -1 ? null : vehicle.getWorldPositionOfBone(seatRearDriver5);
  const seatRearDriver6Position = seatRearDriver6 === -1 ? null : vehicle.getWorldPositionOfBone(seatRearDriver6);
  const seatRearDriver7Position = seatRearDriver7 === -1 ? null : vehicle.getWorldPositionOfBone(seatRearDriver7);
  const seatRearPassengerPosition = seatRearPassenger === -1 ? null : vehicle.getWorldPositionOfBone(seatRearPassenger);
  const seatRearPassenger1Position = seatRearPassenger1 === -1 ? null : vehicle.getWorldPositionOfBone(seatRearPassenger1);
  const seatRearPassenger2Position = seatRearPassenger2 === -1 ? null : vehicle.getWorldPositionOfBone(seatRearPassenger2);
  const seatRearPassenger3Position = seatRearPassenger3 === -1 ? null : vehicle.getWorldPositionOfBone(seatRearPassenger3);
  const seatRearPassenger4Position = seatRearPassenger4 === -1 ? null : vehicle.getWorldPositionOfBone(seatRearPassenger4);
  const seatRearPassenger5Position = seatRearPassenger5 === -1 ? null : vehicle.getWorldPositionOfBone(seatRearPassenger5);
  const seatRearPassenger6Position = seatRearPassenger6 === -1 ? null : vehicle.getWorldPositionOfBone(seatRearPassenger6);
  const seatRearPassenger7Position = seatRearPassenger7 === -1 ? null : vehicle.getWorldPositionOfBone(seatRearPassenger7);

  let closestFreeSeatNumber = -1;
  let seatIndex = -1;
  let closestSeatDistance = Number.MAX_SAFE_INTEGER;
  let calculatedDistance = null;
  const playerPos = player.position;

  // Inline Rear
  calculatedDistance = seatRearPosition === null ? null : distanceTo(playerPos, seatRearPosition);
  seatIndex = seatRear === -1 ? seatIndex : seatIndex + 1;
  if (calculatedDistance !== null && vehicle.isSeatFree(seatIndex) && calculatedDistance < closestSeatDistance) {
    closestSeatDistance = calculatedDistance;
    closestFreeSeatNumber = seatIndex;
  }

  // Side by Side vehicles
  calculatedDistance = seatFrontPassengerPosition === null ? null : distanceTo(playerPos, seatFrontPassengerPosition);
  seatIndex = seatFrontPassenger === -1 ? seatIndex : seatIndex + 1;
  if (calculatedDistance !== null && vehicle.isSeatFree(seatIndex) && calculatedDistance < closestSeatDistance) {
    closestSeatDistance = calculatedDistance;
    closestFreeSeatNumber = seatIndex;
  }

  calculatedDistance = seatRearDriverPosition === null ? null : distanceTo(playerPos, seatRearDriverPosition);
  seatIndex = seatRearDriver === -1 ? seatIndex : seatIndex + 1;
  if (calculatedDistance !== null && vehicle.isSeatFree(seatIndex) && calculatedDistance < closestSeatDistance) {
    closestSeatDistance = calculatedDistance;
    closestFreeSeatNumber = seatIndex;
  }

  calculatedDistance = seatRearPassengerPosition === null ? null : distanceTo(playerPos, seatRearPassengerPosition);
  seatIndex = seatRearPassenger === -1 ? seatIndex : seatIndex + 1;
  if (calculatedDistance !== null && vehicle.isSeatFree(seatIndex) && calculatedDistance < closestSeatDistance) {
    closestSeatDistance = calculatedDistance;
    closestFreeSeatNumber = seatIndex;
  }

  // Force inner seats before outer grab holds if shift not pressed
  calculatedDistance = seatRearDriver1Position === null ? null : distanceTo(playerPos, seatRearDriver1Position);
  seatIndex = seatRearDriver1 === -1 ? seatIndex : seatIndex + 1; // 3
  if (!vehicle.isSeatFree(seatIndex - 2) || mp.keys.isDown(Constants.SHIFT_KEY)) {
    if (calculatedDistance !== null && vehicle.isSeatFree(seatIndex) && calculatedDistance < closestSeatDistance) {
      closestSeatDistance = calculatedDistance;
      closestFreeSeatNumber = seatIndex;
    }
  }

  // Force inner seats before outer grab holds if shift not pressed
  calculatedDistance = seatRearPassenger1Position === null ? null : distanceTo(playerPos, seatRearPassenger1Position);
  seatIndex = seatRearPassenger1 === -1 ? seatIndex : seatIndex + 1; // 4
  if (!vehicle.isSeatFree(seatIndex - 2) || mp.keys.isDown(Constants.SHIFT_KEY)) {
    if (calculatedDistance !== null && vehicle.isSeatFree(seatIndex) && calculatedDistance < closestSeatDistance) {
      closestSeatDistance = calculatedDistance;
      closestFreeSeatNumber = seatIndex;
    }
  }

  // Force inner seats before outer grab holds if shift not pressed
  calculatedDistance = seatRearDriver2Position === null ? null : distanceTo(playerPos, seatRearDriver2Position);
  seatIndex = seatRearDriver2 === -1 ? seatIndex : seatIndex + 1; // 5
  if (!vehicle.isSeatFree(seatIndex - 4) || mp.keys.isDown(Constants.SHIFT_KEY)) {
    if (calculatedDistance !== null && vehicle.isSeatFree(seatIndex) && calculatedDistance < closestSeatDistance) {
      closestSeatDistance = calculatedDistance;
      closestFreeSeatNumber = seatIndex;
    }
  }

  // Force inner seats before outer grab holds if shift not pressed
  calculatedDistance = seatRearPassenger2Position === null ? null : distanceTo(playerPos, seatRearPassenger2Position);
  seatIndex = seatRearPassenger2 === -1 ? seatIndex : seatIndex + 1; // 6
  if (!vehicle.isSeatFree(seatIndex - 4) || mp.keys.isDown(Constants.SHIFT_KEY)) {
    if (calculatedDistance !== null && vehicle.isSeatFree(seatIndex) && calculatedDistance < closestSeatDistance) {
      closestSeatDistance = calculatedDistance;
      closestFreeSeatNumber = seatIndex;
    }
  }

  calculatedDistance = seatRearDriver3Position === null ? null : distanceTo(playerPos, seatRearDriver3Position);
  seatIndex = seatRearDriver3 === -1 ? seatIndex : seatIndex + 1;
  if (calculatedDistance !== null && vehicle.isSeatFree(seatIndex) && calculatedDistance < closestSeatDistance) {
    closestSeatDistance = calculatedDistance;
    closestFreeSeatNumber = seatIndex;
  }

  calculatedDistance = seatRearPassenger3Position === null ? null : distanceTo(playerPos, seatRearPassenger3Position);
  seatIndex = seatRearPassenger3 === -1 ? seatIndex : seatIndex + 1;
  if (calculatedDistance !== null && vehicle.isSeatFree(seatIndex) && calculatedDistance < closestSeatDistance) {
    closestSeatDistance = calculatedDistance;
    closestFreeSeatNumber = seatIndex;
  }

  calculatedDistance = seatRearDriver4Position === null ? null : distanceTo(playerPos, seatRearDriver4Position);
  seatIndex = seatRearDriver4 === -1 ? seatIndex : seatIndex + 1;
  if (calculatedDistance !== null && vehicle.isSeatFree(seatIndex) && calculatedDistance < closestSeatDistance) {
    closestSeatDistance = calculatedDistance;
    closestFreeSeatNumber = seatIndex;
  }

  calculatedDistance = seatRearPassenger4Position === null ? null : distanceTo(playerPos, seatRearPassenger4Position);
  seatIndex = seatRearPassenger4 === -1 ? seatIndex : seatIndex + 1;
  if (calculatedDistance !== null && vehicle.isSeatFree(seatIndex) && calculatedDistance < closestSeatDistance) {
    closestSeatDistance = calculatedDistance;
    closestFreeSeatNumber = seatIndex;
  }

  calculatedDistance = seatRearDriver5Position === null ? null : distanceTo(playerPos, seatRearDriver5Position);
  seatIndex = seatRearDriver5 === -1 ? seatIndex : seatIndex + 1;
  if (calculatedDistance !== null && vehicle.isSeatFree(seatIndex) && calculatedDistance < closestSeatDistance) {
    closestSeatDistance = calculatedDistance;
    closestFreeSeatNumber = seatIndex;
  }

  calculatedDistance = seatRearPassenger5Position === null ? null : distanceTo(playerPos, seatRearPassenger5Position);
  seatIndex = seatRearPassenger5 === -1 ? seatIndex : seatIndex + 1;
  if (calculatedDistance !== null && vehicle.isSeatFree(seatIndex) && calculatedDistance < closestSeatDistance) {
    closestSeatDistance = calculatedDistance;
    closestFreeSeatNumber = seatIndex;
  }

  calculatedDistance = seatRearDriver6Position === null ? null : distanceTo(playerPos, seatRearDriver6Position);
  seatIndex = seatRearDriver6 === -1 ? seatIndex : seatIndex + 1;
  if (calculatedDistance !== null && vehicle.isSeatFree(seatIndex) && calculatedDistance < closestSeatDistance) {
    closestSeatDistance = calculatedDistance;
    closestFreeSeatNumber = seatIndex;
  }

  calculatedDistance = seatRearPassenger6Position === null ? null : distanceTo(playerPos, seatRearPassenger6Position);
  seatIndex = seatRearPassenger6 === -1 ? seatIndex : seatIndex + 1;
  if (calculatedDistance !== null && vehicle.isSeatFree(seatIndex) && calculatedDistance < closestSeatDistance) {
    closestSeatDistance = calculatedDistance;
    closestFreeSeatNumber = seatIndex;
  }

  calculatedDistance = seatRearDriver7Position === null ? null : distanceTo(playerPos, seatRearDriver7Position);
  seatIndex = seatRearDriver7 === -1 ? seatIndex : seatIndex + 1;
  if (calculatedDistance !== null && vehicle.isSeatFree(seatIndex) && calculatedDistance < closestSeatDistance) {
    closestSeatDistance = calculatedDistance;
    closestFreeSeatNumber = seatIndex;
  }

  calculatedDistance = seatRearPassenger7Position === null ? null : distanceTo(playerPos, seatRearPassenger7Position);
  seatIndex = seatRearPassenger7 === -1 ? seatIndex : seatIndex + 1;
  if (calculatedDistance !== null && vehicle.isSeatFree(seatIndex) && calculatedDistance < closestSeatDistance) {
    closestSeatDistance = calculatedDistance;
    closestFreeSeatNumber = seatIndex;
  }

  if (closestFreeSeatNumber === -1) {
    if (Constants.DEBUG)
      mp.console.logInfo('enterVehicleAsPassenger x8');
    return;
  }

  if (Constants.DEBUG)
    mp.console.logInfo('enterVehicleAsPassenger x9');
  player.taskEnterVehicle(vehicle.handle, timeout, closestFreeSeatNumber, 1, 1, 0);
}