import { configureEvent, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

const player = mp.players.local;
let pos = { x: 0, y: 0, z: 0 };
let rot = { x: 0, y: 0, z: 0 };

mp.events.add('animation:SetFreeze', (state: boolean) => {
  mp.storage.data.animationFreeze = state;
});

mp.events.add('animation:Clear', clearAnimation);
function clearAnimation() {
  player.freezePosition(false);
  player.setCollision(true, true);
  player.clearTasks();
  mp.storage.data.animationDic = null;
  mp.storage.data.animationName = null;
  mp.storage.data.animationFreeze = null;
  mp.storage.data.animationFlag = null;
  mp.storage.data.animationAllowPlayerControl = null;
}

export async function requestAnimDict(animDict: string) {
  mp.game.streaming.requestAnimDict(animDict);

  for (let i = 0; !mp.game.streaming.hasAnimDictLoaded(animDict) && i < 15; i++) {
    if (i === 14) return false;
    await mp.game.waitAsync(100);
  }

  return true;
}

export async function requestAnimSet(animSet: string) {
  mp.game.streaming.requestAnimSet(animSet);

  for (let i = 0; !mp.game.streaming.hasAnimSetLoaded(animSet) && i < 15; i++) {
    if (i === 14) return false;
    await mp.game.waitAsync(100);
  }

  return true;
}

mp.events.add('animation:Play', playAnimation);
function playAnimation(dict: string, name: string, flag: number, freeze: boolean, allowPlayerControl: boolean) {
  position = player.position;
  rotation = player.getRotation(2);
  pos = { x: 0, y: 0, z: 0 };
  rot = { x: 0, y: 0, z: 0 };

  requestAnimDict(dict).then(() => {
    // if (allowPlayerControl)
    //   player.taskPlayAnim(dict, name, 8, 8, -1, flag, 1, false, false, false);

    mp.storage.data.animationFreeze = freeze;
    mp.storage.data.animationFlag = flag;
    mp.storage.data.animationDic = dict;
    mp.storage.data.animationName = name;
    mp.storage.data.animationAllowPlayerControl = allowPlayerControl;

    if (!allowPlayerControl)
      editAnimation();
  });
}

setInterval(() => {
  if (mp.storage.data.animationDic) {
    const animationDic = mp.storage.data.animationDic as string;
    const animationName = mp.storage.data.animationName as string;
    if (!player.isPlayingAnim(animationDic, animationName, 3)) {
      const allowPlayerControl = mp.storage.data.animationAllowPlayerControl as boolean;
      if (!allowPlayerControl)
        playAnimAdvanced();
      else if (mp.storage.data.animationFreeze)
        playAnimation(animationDic, animationName, mp.storage.data.animationFlag as number, true,
          mp.storage.data.animationAllowPlayerControl as boolean);
      else
        callRemoteEvent('StopAnimation');
    }
  }
}, 1000);

mp.events.add('ViewAnimations', (categoriesJson, animationsJson: string) => {
  setPages([Constants.ANIMATION_PAGE], []);
  configureEvent(Constants.ANIMATION_PAGE_SHOW, () => {
    webView.call(Constants.ANIMATION_PAGE_SHOW, categoriesJson, animationsJson);
  });
  configureEvent(Constants.ANIMATION_PAGE_CLOSE, () => {
    toggleView(false);
    setPages([], [Constants.ANIMATION_PAGE]);
  });
  toggleView(true);
  webView.call(Constants.ANIMATION_PAGE_SHOW, categoriesJson, animationsJson);
});

function clearEditAnimation() {
  mp.keys.unbind(Constants.ESC_KEY, false, clearEditAnimation);
  mp.events.remove('render', processEditAnimation);
  setPages([], [Constants.ANIMATION_HELP_PAGE]);
  toggleView(false);
}

const rotSum = 0.5;
function setEditAnimationRotation(type: number) {
  if (type == 1)
    rot.z += rotSum;
  else if (type == 2)
    rot.z -= rotSum;
  else if (type == 3)
    rot.x += rotSum;
  else if (type == 4)
    rot.x -= rotSum;

  playAnimAdvanced();
}

const posSum = 0.005;
const maxDistance = 1.3;
function setEditAnimationPosition(type: number) {
  if (type == 1 && pos.x + posSum < maxDistance)
    pos.x += posSum;
  else if (type == 2 && pos.x - posSum > -maxDistance)
    pos.x -= posSum;
  else if (type == 3 && pos.y + posSum < maxDistance)
    pos.y += posSum;
  else if (type == 4 && pos.y - posSum > -maxDistance)
    pos.y -= posSum;
  else if (type == 5 && pos.z + posSum < maxDistance)
    pos.z += posSum;
  else if (type == 6 && pos.z - posSum > -maxDistance)
    pos.z -= posSum;

  playAnimAdvanced();
}

let position: Vector3;
let rotation: Vector3;

const playAnimAdvanced = () => {
  const dict = mp.storage.data.animationDic as string;
  const name = mp.storage.data.animationName as string;
  const flag = mp.storage.data.animationFlag as number;

  const forwardX = player.getForwardX();
  const forwardY = player.getForwardY();

  player.taskPlayAnimAdvanced(dict, name,
    position.x + forwardY * -pos.x + forwardX * pos.y,
    position.y + forwardX * pos.x + forwardY * pos.y,
    position.z + pos.z,
    rot.x,
    rotation.y + rot.y,
    rot.z,
    8, 8, -1, flag, 1.0, 1, 1);
};

const processEditAnimation = () => {
  if (mp.game.controls.isControlPressed(0, 44)) // Q
    setEditAnimationRotation(1);

  if (mp.game.controls.isControlPressed(0, 38)) // E
    setEditAnimationRotation(2);

  if (mp.game.controls.isControlPressed(0, 34)) // A
    setEditAnimationPosition(1);

  if (mp.game.controls.isControlPressed(0, 35)) // D 
    setEditAnimationPosition(2);

  if (mp.game.controls.isControlPressed(0, 32)) // W
    setEditAnimationPosition(3);

  if (mp.game.controls.isControlPressed(0, 33)) // S
    setEditAnimationPosition(4);

  if (mp.game.controls.isControlPressed(0, 21)) // SHIFT
    setEditAnimationPosition(5);

  if (mp.keys.isDown(Constants.CTRL_KEY))
    setEditAnimationPosition(6);

  if (mp.keys.isDown(Constants.PAGE_DOWN_KEY))
    setEditAnimationRotation(3);

  if (mp.keys.isDown(Constants.PAGE_UP_KEY))
    setEditAnimationRotation(4);
}

const editAnimation = () => {
  clearEditAnimation();
  const dict = mp.storage.data.animationDic as string;
  requestAnimDict(dict).then(() => {
    mp.keys.bind(Constants.ESC_KEY, true, clearEditAnimation);
    player.freezePosition(true);
    player.setCollision(false, false);
    playAnimAdvanced();

    setPages([Constants.ANIMATION_HELP_PAGE], []);
    mp.events.add('render', processEditAnimation);
  });
}
mp.events.add('EditAnimation', editAnimation);