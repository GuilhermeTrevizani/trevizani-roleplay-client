import { chatNotifiy } from './chat';
import { Constants } from './constants';
import { configureEvent, setPages, toggleView, webView } from './webView';
import { setCanClose } from './propertyFurniture';
import { callRemoteEvent, distanceTo } from './cursor';

const player = mp.players.local;
let usingPosition = true;
let dropObject: ObjectMp;
let dropObjectMinZ: number;
let dropObjectType: number;
let dropObjectSpeed = 0.005;

mp.events.add('Inventory:Show', (update: boolean,
  leftTitle: string, leftItemsJson: string, maxLeftItemsWeight: number, leftSlots: number,
  rightTitle: string, rightItemsJson: string, rightSlots: number) => {
  if (update) {
    webView.call(Constants.INVENTORY_PAGE_SHOW, leftTitle, leftItemsJson, maxLeftItemsWeight, leftSlots, rightTitle, rightItemsJson, rightSlots);
    return;
  }

  setPages([Constants.INVENTORY_PAGE], []);
  configureEvent(Constants.INVENTORY_PAGE_SHOW, () => {
    webView.call(Constants.INVENTORY_PAGE_SHOW, leftTitle, leftItemsJson, maxLeftItemsWeight, leftSlots, rightTitle, rightItemsJson, rightSlots);
  });
  configureEvent(Constants.INVENTORY_PAGE_CLOSE, () => {
    callRemoteEvent('CloseInventory');
  });
  configureEvent(Constants.INVENTORY_PAGE_MOVE_ITEM, (id: string, leftOrigin: boolean, leftTarget: boolean, targetSlot: number, quantity: number) => {
    callRemoteEvent('MoveItem', id, leftOrigin, leftTarget, targetSlot, quantity);
  });
  configureEvent(Constants.INVENTORY_PAGE_GIVE_ITEM, (id: string, quantity: number, targetSessionId: number) => {
    callRemoteEvent('GiveItem', id, quantity, targetSessionId);
  });
  configureEvent(Constants.INVENTORY_PAGE_USE_ITEM, (id: string, quantity: number) => {
    callRemoteEvent('UseItem', id, quantity);
  });
  configureEvent(Constants.INVENTORY_PAGE_GET_NEARBY_CHARACTERS, () => {
    callRemoteEvent('InventoryGetNearbyCharacters');
  });
  configureEvent(Constants.INVENTORY_PAGE_USE_ITEM_SELECT, (id: string, targetId: string) => {
    callRemoteEvent('InventoryUseItemSelect', id, targetId);
  });
  toggleView(true);
  webView.call(Constants.INVENTORY_PAGE_SHOW, leftTitle, leftItemsJson, maxLeftItemsWeight, leftSlots, rightTitle, rightItemsJson, rightSlots);
});

mp.events.add('InventoryPage:GetNearbyCharactersServer', (charactersJson: string) => {
  webView.call(Constants.INVENTORY_PAGE_GET_NEARBY_CHARACTERS, charactersJson);
});

mp.events.add('InventoryPage:UseItemSelectServer', (itemId: string, itemsJson: string) => {
  webView.call(Constants.INVENTORY_PAGE_USE_ITEM_SELECT, itemId, itemsJson);
});

function closeInventory() {
  setPages([], [Constants.INVENTORY_PAGE]);
  toggleView(false);
}

mp.events.add('Inventory:CloseServer', closeInventory);

function clearDropObject() {
  mp.keys.unbind(Constants.ESC_KEY, true, cancelDrop);
  mp.keys.unbind(Constants.ENTER_KEY, true, confirmDrop);
  mp.keys.unbind(Constants.ALT_KEY, true, changeUsingPosition);
  mp.events.remove('render', renderDrop);
  setPages([], [Constants.DROP_ITEM_PAGE]);
  toggleView(false);
  dropObject?.destroy();
  dropObject = undefined;
  setCanClose(true);
}
mp.events.add('ClearDropObject', clearDropObject);

function cancelDrop() {
  let name = 'CancelDropItem';
  if (dropObjectType === 1)
    name = 'CancelDropBarrier';
  else if (dropObjectType === 2)
    name = 'CancelDropFurniture';
  else if (dropObjectType === 3)
    name = 'CancelDropStaffObject';
  callRemoteEvent(name);
  clearDropObject();
}

function confirmDrop() {
  let name = 'ConfirmDropItem';
  if (dropObjectType == 1)
    name = 'ConfirmDropBarrier';
  else if (dropObjectType === 2)
    name = 'ConfirmDropFurniture';
  else if (dropObjectType === 3)
    name = 'ConfirmDropStaffObject';
  callRemoteEvent(name, dropObject.getCoords(true), dropObject.getRotation(2));
  clearDropObject();
}

function changeUsingPosition() {
  usingPosition = !usingPosition;
  webView.call(Constants.DROP_ITEM_PAGE_SHOW, usingPosition);
}

function renderDrop() {
  if (mp.game.controls.isControlPressed(0, 189)) { // LEFT
    if (usingPosition)
      setDropObjectPosition(1);
    else
      setDropObjectRotation(1);
  }

  if (mp.game.controls.isControlPressed(0, 190)) { // RIGHT 
    if (usingPosition)
      setDropObjectPosition(2);
    else
      setDropObjectRotation(2);
  }

  if (mp.game.controls.isControlPressed(0, 188)) { // UP
    if (usingPosition)
      setDropObjectPosition(3);
    else
      setDropObjectRotation(3);
  }

  if (mp.game.controls.isControlPressed(0, 187)) { // DOWN
    if (usingPosition)
      setDropObjectPosition(4);
    else
      setDropObjectRotation(4);
  }

  if (mp.keys.isDown(Constants.PAGE_UP_KEY)) {
    if (usingPosition)
      setDropObjectPosition(5);
    else
      setDropObjectRotation(5);
  }

  if (mp.keys.isDown(Constants.PAGE_DOWN_KEY)) {
    if (usingPosition)
      setDropObjectPosition(6);
    else
      setDropObjectRotation(6);
  }

  if (mp.game.controls.isControlPressed(0, 21)) { // SHIFT
    dropObjectSpeed += 0.00001;
    webView.call(Constants.DROP_ITEM_PAGE_UPDATE_VELOCITY, dropObjectSpeed);
  }

  if (mp.keys.isDown(Constants.CTRL_KEY)) {
    dropObjectSpeed -= 0.00001;
    webView.call(Constants.DROP_ITEM_PAGE_UPDATE_VELOCITY, dropObjectSpeed);
  }
}

function setDropObjectRotation(type: number) {
  const rot = { ...dropObject.getRotation(2) };
  const dropObjectRotationSpeed = dropObjectSpeed * 100;

  if (type == 1)
    rot.x += dropObjectRotationSpeed;
  else if (type == 2)
    rot.x -= dropObjectRotationSpeed;
  else if (type == 3)
    rot.y += dropObjectRotationSpeed;
  else if (type == 4)
    rot.y -= dropObjectRotationSpeed;
  else if (type == 5)
    rot.z += dropObjectRotationSpeed;
  else if (type == 6)
    rot.z -= dropObjectRotationSpeed;

  dropObject.setRotation(rot.x, rot.y, rot.z, 2, false);
  webView.call(Constants.DROP_ITEM_PAGE_UPDATE_ROTATION, JSON.stringify(rot));
}

function setDropObjectPosition(type: number) {
  const pos = dropObject.getCoords(true);

  if (type == 1)
    pos.x += dropObjectSpeed;
  else if (type == 2)
    pos.x -= dropObjectSpeed;
  else if (type == 3)
    pos.y += dropObjectSpeed;
  else if (type == 4)
    pos.y -= dropObjectSpeed;
  else if (type == 5)
    pos.z += dropObjectSpeed;
  else if (type == 6)
    pos.z -= dropObjectSpeed;

  const maxDistance = dropObjectType === 2 || dropObjectType === 3 ? 10 : 2;
  if (distanceTo(player.position, pos) <= maxDistance && pos.z >= dropObjectMinZ) {
    dropObject.position = new mp.Vector3(pos.x, pos.y, pos.z);
    webView.call(Constants.DROP_ITEM_PAGE_UPDATE_POSITION, JSON.stringify(pos));
  }
}

mp.events.add('DropObject', (model: string, type: number, position: Vector3 | undefined = undefined, rotation: Vector3 | undefined = undefined) => {
  clearDropObject();
  setCanClose(false);
  dropObjectType = type;
  mp.keys.bind(Constants.ESC_KEY, true, cancelDrop);
  mp.keys.bind(Constants.ENTER_KEY, true, confirmDrop);
  mp.keys.bind(Constants.ALT_KEY, true, changeUsingPosition);
  usingPosition = true;

  player.setHeading(0);

  let pos = player.position;
  let rot = player.getRotation(2);

  if (position && rotation) {
    pos = position;
    rot = rotation;
  }

  setPages([Constants.DROP_ITEM_PAGE], []);
  configureEvent(Constants.DROP_ITEM_PAGE_SHOW, () => {
    webView.call(Constants.DROP_ITEM_PAGE_SHOW, usingPosition);
    webView.call(Constants.DROP_ITEM_PAGE_UPDATE_POSITION, JSON.stringify(pos));
    webView.call(Constants.DROP_ITEM_PAGE_UPDATE_ROTATION, JSON.stringify(rot));
    webView.call(Constants.DROP_ITEM_PAGE_UPDATE_VELOCITY, dropObjectSpeed);
  });
  webView.call(Constants.DROP_ITEM_PAGE_SHOW, usingPosition);

  try {
    dropObject = mp.objects.new(model, pos, { rotation: rot, dimension: player.dimension });
    mp.game.waitForAsync(() => dropObject?.handle !== 0, 10_000)
      .then((res: any) => {
        if (!res)
          return;

        if (!position && !rotation)
          dropObject.placeOnGroundProperly();
        dropObjectMinZ = dropObjectType === 2 || dropObjectType === 3 ? -1000 : dropObject.getCoords(true).z;

        dropObject.freezePosition(true);
        dropObject.setCollision(false, false);
        mp.events.add('render', renderDrop);

        if (dropObjectType === 2)
          webView.call(Constants.WEB_VIEW_END_LOADING);
      });
  } catch (ex: any) {
    cancelDrop();
    chatNotifiy(`Objeto do item (${model}) não foi configurado corretamente. Por favor, reporte o bug.`, 'error');
    mp.console.logError(ex);
    return;
  }
});