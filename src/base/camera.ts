import { Constants } from './constants';
import { playPedAnimation, setAccessory, setCloth, setPedAcessory, setPedCloth, setPersonalization } from './ped';

let camera: CameraMp;
let zpos = 0;
let fov = 0;
let startPosition: Vector3;
let startCamPosition: Vector3;
let ped: PedMp | undefined = undefined;
const animDict = 'nm@hands';
const animName = 'hands_up';
const player = mp.players.local;

export function createPedEditCamera(sex: number, personalizationJson: string, outfitJson: string) {
  ped = mp.peds.new(mp.game.joaat(sex === 1 ? 'mp_f_freemode_01' : 'mp_m_freemode_01'), player.position, player.heading, player.dimension);
  ped.freezePosition(true);

  ped.setBlockingOfNonTemporaryEvents(true);
  ped.taskSetBlockingOfNonTemporaryEvents(true);
  ped.setInvincible(true);
  ped.setFleeAttributes(15, true);

  const personalization = JSON.parse(personalizationJson);

  setPersonalization(ped, personalization);

  const outfit = JSON.parse(outfitJson);

  setPedCloth(ped, 1, outfit.cloth1);
  setPedCloth(ped, 3, outfit.cloth3);
  setPedCloth(ped, 4, outfit.cloth4);
  setPedCloth(ped, 5, outfit.cloth5);
  setPedCloth(ped, 6, outfit.cloth6);
  setPedCloth(ped, 7, outfit.cloth7);
  setPedCloth(ped, 8, outfit.cloth8);
  setPedCloth(ped, 9, outfit.cloth9);
  setPedCloth(ped, 10, outfit.cloth10);
  setPedCloth(ped, 11, outfit.cloth11);

  setPedAcessory(ped, 0, outfit.accessory0);
  setPedAcessory(ped, 1, outfit.accessory1);
  setPedAcessory(ped, 2, outfit.accessory2);
  setPedAcessory(ped, 6, outfit.accessory6);
  setPedAcessory(ped, 7, outfit.accessory7);

  playPedAnimation(ped, animDict, animName, 1);

  ped.setHeading(161.06);
  startPosition = ped.position;
  zpos = 0.6;
  fov = 90;

  const forwardVector = ped.getForwardVector();
  startCamPosition = new mp.Vector3(
    startPosition.x + forwardVector.x * 1.2,
    startPosition.y + forwardVector.y * 1.2,
    startPosition.z
  );

  camera = mp.cameras.new(
    'DEFAULT_SCRIPTED_CAMERA',
    new mp.Vector3(startCamPosition.x, startCamPosition.y, startCamPosition.z + zpos),
    new mp.Vector3(0, 0, 0),
    fov
  );

  camera.pointAtCoord(startPosition.x, startPosition.y, startPosition.z + zpos);
  camera.setActive(true);
  mp.game.cam.renderScriptCams(true, false, 0, true, false, 0);

  mp.events.add('render', handleControls);
  mp.keys.bind(Constants.ALT_KEY, true, changeAnimation);
}

export const setPedTattoos = (personalization: any, tattoos: any) => {
  if (!ped)
    return;

  ped.clearDecorations();

  if (personalization.hairOverlay && personalization.hairCollection)
    ped.setDecoration(mp.game.joaat(personalization.hairCollection), mp.game.joaat(personalization.hairOverlay));

  tattoos.forEach((tattoo: any) => {
    ped?.setDecoration(mp.game.joaat(tattoo.collection), mp.game.joaat(tattoo.overlay));
  });
}

export const setPedPersonalization = (personalization: any) => {
  if (!ped)
    return;

  setPersonalization(ped, personalization);
}

export const setCurrentPedCloth = (component: number, drawable: number, texture: number, dlc?: string) => {
  if (!ped)
    return;

  setCloth(ped, component, drawable, texture, dlc);
};

export const setCurrentPedAccessory = (component: number, drawable: number, texture: number, dlc?: string) => {
  if (!ped)
    return;

  setAccessory(ped, component, drawable, texture, dlc);
};

const changeAnimation = () => {
  if (!ped)
    return;

  if (ped.isPlayingAnim(animDict, animName, 3))
    ped.clearTasksImmediately();
  else
    playPedAnimation(ped, animDict, animName, 1);
}

export function destroyPedEditCamera() {
  mp.keys.unbind(Constants.ALT_KEY, true, changeAnimation);
  mp.events.remove('render', handleControls);

  if (ped) {
    ped.destroy();
    ped = undefined;
  }

  mp.game.cam.destroyAllCams(true);
  mp.game.cam.renderScriptCams(false, false, 0, false, false, 0);
}

function handleControls() {
  mp.game.ui.hideAndRadarThisFrame();
  mp.game.controls.disableAllControlActions(0);
  mp.game.controls.disableAllControlActions(1);
  mp.game.controls.disableControlAction(0, 0, true);
  mp.game.controls.disableControlAction(0, 1, true);
  mp.game.controls.disableControlAction(0, 2, true);
  mp.game.controls.disableControlAction(0, 24, true);
  mp.game.controls.disableControlAction(0, 25, true);
  mp.game.controls.disableControlAction(0, 32, true); // w
  mp.game.controls.disableControlAction(0, 33, true); // s
  mp.game.controls.disableControlAction(0, 34, true); // a
  mp.game.controls.disableControlAction(0, 35, true); // d

  const resolution = mp.game.graphics.getScreenActiveResolution(0, 0);
  const width = resolution.x;
  const cursor = mp.gui.cursor.position;
  const _x = cursor[0];
  let oldHeading = ped?.getHeading() ?? 0;

  // Scroll Up
  if (mp.game.controls.isDisabledControlPressed(0, 15)) {
    if (_x < width / 2 + 250 && _x > width / 2 - 250) {
      fov -= 2;

      if (fov < 10)
        fov = 10;

      camera.setFov(fov);
      camera.setActive(true);
      mp.game.cam.renderScriptCams(true, false, 0, true, false, 0);
    }
  }

  // Scroll Down
  if (mp.game.controls.isDisabledControlPressed(0, 16)) {
    if (_x < width / 2 + 250 && _x > width / 2 - 250) {
      fov += 2;

      if (fov > 90)
        fov = 90;

      camera.setFov(fov);
      camera.setActive(true);
      mp.game.cam.renderScriptCams(true, false, 0, true, false, 0);
    }
  }

  // W
  if (mp.game.controls.isDisabledControlPressed(0, 32)) {
    zpos += 0.01;

    if (zpos > 0.9)
      zpos = 0.9;

    camera.setCoord(startCamPosition.x, startCamPosition.y, startCamPosition.z + zpos);
    camera.pointAtCoord(startPosition.x, startPosition.y, startPosition.z + zpos);
    camera.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, true, false, 0);
  }

  // S
  if (mp.game.controls.isDisabledControlPressed(0, 33)) {
    zpos -= 0.01;

    if (zpos < -0.9)
      zpos = -0.9;

    camera.setCoord(startCamPosition.x, startCamPosition.y, startCamPosition.z + zpos);
    camera.pointAtCoord(startPosition.x, startPosition.y, startPosition.z + zpos);
    camera.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, true, false, 0);
  }

  // D
  if (mp.game.controls.isDisabledControlPressed(0, 35)) {
    const newHeading = oldHeading + 2;
    ped?.setHeading(newHeading);
  }

  // A
  if (mp.game.controls.isDisabledControlPressed(0, 34)) {
    const newHeading = oldHeading - 2;
    ped?.setHeading(newHeading);
  }
}