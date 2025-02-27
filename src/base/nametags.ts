import { Constants } from './constants';
import { distanceTo } from './cursor';
import { hexToRgb } from './webView';

const localPlayer = mp.players.local;
const drawDistance = 10;
let draw = false;
let showNametagId = false;
let showOwnNametag = false;
mp.nametags.enabled = false;

mp.events.add('nametags:Config', (showNametagIdSetting: boolean, showOwnNametagSetting: boolean) => {
  draw = true;
  showNametagId = showNametagIdSetting;
  showOwnNametag = showOwnNametagSetting;
});

mp.events.add('render', drawMarkers);

function drawMarkers() {
  if (!draw || mp.storage.data.f7)
    return;

  mp.players.forEachInStreamRange(drawMarker);
}

function drawMarker(entity: PlayerMp) {
  if (!showOwnNametag && entity.handle == localPlayer.handle)
    return;

  const aduty = mp.storage.data.aduty as boolean;
  const anametag = mp.storage.data.anametag as boolean;
  if (!aduty || !anametag) {
    if (distanceTo(localPlayer.position, entity.position) > drawDistance
      || !mp.game.cam.isSphereVisible(entity.position.x, entity.position.y, entity.position.z, 0.0099999998)
      || !mp.game.entity.hasClearLosToEntity(localPlayer.handle, entity.handle, 17))
      return;
  }

  let nametagData = entity.getVariable(Constants.PLAYER_META_DATA_NAMETAG) as string;
  if (!nametagData)
    return;

  const nametag = JSON.parse(nametagData);
  if (!nametag.show)
    return;

  let color = nametag.color;
  if (entity.getVariable(Constants.PLAYER_META_DATA_DAMAGED))
    color = '#FF6A4D';
  else if (entity.getVariable(Constants.PLAYER_META_DATA_GAME_UNFOCUSED))
    color = '#646464';
  const rgbColor = hexToRgb(color)!;

  let addZ = 0.4;

  let name = nametag.name;
  if (showNametagId)
    name += ` (${nametag.sessionId})`;

  if (nametag.photoMode)
    name += ` (MODO FOTO)`;

  name = `${name}`;
  const injured = entity.getVariable(Constants.PLAYER_META_DATA_INJURED) as number;
  if (injured == 1 || injured == 2)
    name = `~r~(( Este jogador está gravemente ferido. ))\n${name}`;
  else if (injured >= 3)
    name = `~r~(( Este jogador está morto. ))\n${name}`;

  if (entity.getVariable(Constants.PLAYER_META_DATA_CHATTING))
    name += `~y~*`;

  let action = entity.getVariable(Constants.PLAYER_META_DATA_TEXT_ACTION) as string;
  let actions: string[] = [];
  if (action) {
    const chunkSize = 70;
    actions = splitStringIntoChunks(action, chunkSize);
  }

  if (aduty) {
    name += `\n~c~V: ${entity.getHealth().toFixed(0)} | C: ${entity.getArmour().toFixed(0)} | UCP: ${nametag.userName}`;
    addZ += 0.05;
  }

  const position = entity.getBoneCoords(0x322c, 0, 0, 0);
  const vector = entity.getVelocity();
  const frameTime = mp.game.gameplay.getFrameTime();

  mp.game.graphics.drawText(name,
    [
      position.x + vector.x * frameTime,
      position.y + vector.y * frameTime,
      position.z + addZ + vector.z * frameTime,
    ], {
    font: 4,
    color: [rgbColor.r, rgbColor.g, rgbColor.b, 255],
    scale: [0.4, 0.4],
    outline: true,
    centre: true,
  });

  const defaultZAction = 0.07;
  let baseActionAddZ = 0.05;

  actions.forEach((text, index) => {
    const actionAddZ = baseActionAddZ + defaultZAction * (actions.length - index + 1);
    mp.game.graphics.drawText(text,
      [
        position.x + vector.x * frameTime,
        position.y + vector.y * frameTime,
        position.z + addZ + actionAddZ + vector.z * frameTime,
      ], {
      font: 4,
      color: [194, 162, 218, 255],
      scale: [0.38, 0.38],
      outline: true,
      centre: true,
    });
  });
}

const splitStringIntoChunks = (input: string, chunkSize: number): string[] => {
  const result: string[] = [];
  for (let i = 0; i < input.length; i += chunkSize)
    result.push(input.slice(i, i + chunkSize));
  return result;
}