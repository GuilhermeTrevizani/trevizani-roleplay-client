import { chatNotifiy } from './chat';
import { callRemoteEvent } from './cursor';

const player = mp.players.local;

mp.events.add('Fishing:Start', () => {
  if (player.isSwimming() || player.vehicle) {
    chatNotifiy('Você está em um veículo ou nadando.', 'error');
    return;
  }

  const bone = player.getBoneCoords(31086, 0, 0, 0);
  const matrix = player.getMatrix(null, null, null, null);

  const target = new mp.Vector3(
    matrix.forwardVector.x * 0.75 - matrix.upVector.x * 0.25,
    matrix.forwardVector.y * 0.75 - matrix.upVector.y * 0.25,
    matrix.forwardVector.z * 0.75 - matrix.upVector.z * 0.25
  );

  const target_mult = new mp.Vector3(
    bone.x + 25 * target.x,
    bone.y + 25 * target.y,
    bone.z + 25 * target.z
  );

  const result = mp.game.water.testProbeAgainstWater(bone.x, bone.y, bone.z, target_mult.x, target_mult.y, target_mult.z);
  if (!result) {
    chatNotifiy('Você não está próximo da água.', 'error');
    return;
  }

  callRemoteEvent('StartFishing');
});