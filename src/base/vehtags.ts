import { Constants } from './constants';
import { distanceTo } from './cursor';

const drawDistance = 10;
let draw = false;

mp.events.add('dl:Config', (active: boolean) => {
  draw = active;
});

mp.events.add('render', drawMarkers);

function drawMarkers() {
  if (!draw || mp.storage.data.f7)
    return;

  mp.vehicles.forEachInStreamRange(drawMarker);
}

function drawMarker(entity: VehicleMp) {
  if (distanceTo(mp.players.local.position, entity.position) > drawDistance
    || !mp.game.cam.isSphereVisible(entity.position.x, entity.position.y, entity.position.z, 0.0099999998)
    || !mp.game.entity.hasClearLosToEntity(mp.players.local.handle, entity.handle, 17))
    return;

  const plate = entity.getNumberPlateText().trim();
  const model = entity.getVariable(Constants.VEHICLE_META_DATA_MODEL);
  const engine = entity.getEngineHealth().toFixed(0);
  const vector = entity.getVelocity();
  const frameTime = mp.game.gameplay.getFrameTime();

  mp.game.graphics.drawText(`[id: ${entity.remoteId}, model: ${model}, plate: ${plate}, engine: ${engine}]`,
    [
      entity.position.x + vector.x * frameTime,
      entity.position.y + vector.y * frameTime,
      entity.position.z + vector.z * frameTime,
    ], {
    font: 4,
    color: [40, 139, 198, 255],
    scale: [0.3, 0.3],
    outline: true,
    centre: true,
  });
}