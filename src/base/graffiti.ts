import { configureEvent, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

let previewGraffitiTextLabel: TextLabelMp | null = null;
let graffitiText: string;
let graffitiFontType: number;
let graffitiFontText: string;
let graffitiSize: number;
let graffitiColor: RGBA;

mp.events.add('Graffiti:Config', (fontsJson: string) => {
  setPages([Constants.GRAFFITI_PAGE], []);
  configureEvent(Constants.GRAFFITI_PAGE_SHOW, () => {
    webView.call(Constants.GRAFFITI_PAGE_SHOW, fontsJson);
  });
  configureEvent(Constants.GRAFFITI_PAGE_CLOSE, () => {
    setPages([], [Constants.GRAFFITI_PAGE, Constants.GRAFFITI_COMMANDS_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.GRAFFITI_PAGE_SAVE, start);
  toggleView(true);
  webView.call(Constants.GRAFFITI_PAGE_SHOW, fontsJson);
});

const start = (text: string, fontType: number, fontText: string, size: number,
  colorR: number, colorG: number, colorB: number, colorA: number) => {
  graffitiText = text;
  graffitiFontType = fontType;
  graffitiFontText = fontText;
  graffitiSize = size;
  graffitiColor = [colorR, colorG, colorB, colorA];

  clear();
  toggleView(false);
  setPages([Constants.GRAFFITI_COMMANDS_PAGE], [Constants.GRAFFITI_PAGE]);

  const response = getRaycast();

  const rotFromNormal = calculateRotationFromNormal(response.surfaceNormal);
  const baseGraffitiRotation = new mp.Vector3(0, 0, rotFromNormal.z);

  previewGraffitiTextLabel = mp.labels.new(graffitiText, response.endCoords, {
    color: graffitiColor,
    font: 1,
    los: false,
  });
  previewGraffitiTextLabel!.rotation = baseGraffitiRotation;
  // TODO: graffitiSize,

  mp.events.add('render', renderGraffiti);
  mp.keys.bind(Constants.ENTER_KEY, true, save);
  mp.keys.bind(Constants.ESC_KEY, true, clear);
};

const renderGraffiti = () => {
  if (!previewGraffitiTextLabel) return;

  const response = getRaycast();
  const rotFromNormal = calculateRotationFromNormal(response.surfaceNormal);

  mp.game.controls.disableControlAction(0, 24, true); // LMB
  mp.game.controls.disableControlAction(0, 25, true); // RMB

  let rotY = 0;
  if (mp.game.controls.isDisabledControlPressed(0, 24))
    rotY -= 0.1;

  if (mp.game.controls.isDisabledControlPressed(0, 25))
    rotY += 0.1;

  if (rotY < 0)
    rotY = 360;
  else if (rotY > 360)
    rotY = 0;

  const baseGraffitiRotation = new mp.Vector3(0, rotY, rotFromNormal.z);

  previewGraffitiTextLabel.position = response.endCoords;
  previewGraffitiTextLabel.rotation = baseGraffitiRotation;
}

const save = () => {
  if (!previewGraffitiTextLabel)
    return;

  const pos = previewGraffitiTextLabel.position;
  const rot = previewGraffitiTextLabel.getRotation(2);

  clear();

  callRemoteEvent('GraffitiSave', JSON.stringify({
    text: graffitiText,
    size: graffitiSize,
    font: graffitiFontType,
    posX: pos.x,
    posY: pos.y,
    posZ: pos.z,
    rotR: rot.x,
    rotP: rot.y,
    rotY: rot.z,
    colorR: graffitiColor[0],
    colorG: graffitiColor[1],
    colorB: graffitiColor[2],
    colorA: graffitiColor[3],
  }));
}

const clear = () => {
  setPages([], [Constants.GRAFFITI_COMMANDS_PAGE]);
  mp.events.remove('render', renderGraffiti);
  mp.keys.unbind(Constants.ENTER_KEY, true, save);
  mp.keys.unbind(Constants.ESC_KEY, true, clear);

  previewGraffitiTextLabel?.destroy();
  previewGraffitiTextLabel = null;
};

function calculateRotationFromNormal(oldNormal: Vector3) {
  const length = Math.sqrt(oldNormal.x * oldNormal.x + oldNormal.y * oldNormal.y + oldNormal.z * oldNormal.z);
  const newX = oldNormal.x / length;
  const newY = oldNormal.y / length;
  const newZ = oldNormal.z / length;

  const newNormal = new mp.Vector3(newX, newY, newZ);

  const pitchValue = Math.asin(-newNormal.z);
  const rollValue = Math.atan2(newNormal.y, newNormal.x);
  const yawValue = Math.atan2(-newNormal.x, newNormal.y);

  const pitchDeg = (pitchValue * 180 / Math.PI + 360) % 360;
  const rollDeg = (rollValue * 180 / Math.PI + 360) % 360;
  const yawDeg = (yawValue * 180 / Math.PI + 360) % 360;

  return new mp.Vector3(pitchDeg, rollDeg, yawDeg);
};

function getRaycast() {
  const startPosition = mp.game.cam.getFinalRenderedCoord();
  const cameraRotation = mp.game.cam.getFinalRenderedRot(2);
  const fwdVector = getDirectionFromRotation(cameraRotation);
  const frontOf = new mp.Vector3(
    (startPosition.x + (fwdVector.x * 10)),
    (startPosition.y + (fwdVector.y * 10)),
    (startPosition.z + (fwdVector.z * 10))
  );

  const gameplayCoord = mp.game.cam.getGameplayCoord();
  const raycastTest = mp.game.shapetest.startExpensiveSynchronousShapeTestLosProbe(
    gameplayCoord.x, gameplayCoord.y, gameplayCoord.z,
    frontOf.x, frontOf.y, frontOf.z,
    -1, mp.players.local.handle, 4);
  const getRaycast = mp.game.shapetest.getShapeTestResultIncludingMaterial(raycastTest);

  return getRaycast;
};

function getDirectionFromRotation(rotation: Vector3) {
  const z = rotation.z * (Math.PI / 180.0);
  const x = rotation.x * (Math.PI / 180.0);
  const num = Math.abs(Math.cos(x));

  return new mp.Vector3(
    (-Math.sin(z) * num),
    (Math.cos(z) * num),
    Math.sin(x)
  );
}