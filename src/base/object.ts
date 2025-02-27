import { Constants } from './constants';
import { chatNotifiy } from './chat';
import { configureEvent } from './webView';

const tvs: { render: number, browser: BrowserMp, remoteId: number, texture: string }[] = [];

mp.events.add('entityStreamIn', (entity) => {
  if (entity.type !== RageEnums.EntityType.OBJECT)
    return;

  try {
    const frozen = entity.getVariable('Frozen') as boolean;
    const collision = entity.getVariable('Collision') as boolean;
    const propertyFurnitureId = entity.getVariable('PropertyFurnitureId') as string;

    const object = entity as ObjectMp;
    object.freezePosition(frozen);
    object.setCollision(collision, collision);

    if (entity.getVariable('Door') as boolean) {
      const doorId = mp.game.joaat(propertyFurnitureId);
      mp.game.object.addDoorToSystem(doorId, object.model, object.position.x, object.position.y, object.position.z, false, false, false);
      mp.game.wait(500);
      mp.game.object.setStateOfClosestDoorOfType(entity.model, entity.position.x, entity.position.y, entity.position.z,
        entity.getVariable('DoorLocked') as boolean, 0.0, false);
    }

    const tvJson = entity.getVariable('TV') as string;
    if (tvJson) {
      const tv = JSON.parse(tvJson);
      startTv(entity.model, tv, entity.remoteId);
    }
  } catch (ex: any) {
    chatNotifiy(ex, 'error');
    mp.console.logError(ex);
  }
});

mp.events.add('entityStreamOut', (entity) => {
  if (entity.type !== RageEnums.EntityType.OBJECT)
    return;

  const tvJson = entity.getVariable('TV') as string;
  if (tvJson)
    stopTv(entity.remoteId);
});

// I can't release TV system
// Use this (https://wiki.rage.mp/wiki/Render_Targets) to implement TODOs below
// Feel free to contribute with a PR

const createRenderTarget = (name: string, model: number) => {
  // TODO: Implement here
  return -1;
}

const startTv = (model: number, tv: any, remoteId: number) => {
  const browser = mp.browsers.newHeadless('http://package/webviews/index.html', 1920, 1080);
  browser.inputEnabled = false;
  browser.mouseInputEnabled = false;
  configureEvent(Constants.TV_PAGE_TURN_ON, () => {
    browser.call(Constants.TV_PAGE_TURN_ON, tv.source, tv.volume);
  });

  const render = createRenderTarget(tv.texture, model);

  tvs.push({ render, browser, remoteId, texture: tv.texture });
};

mp.events.add('render', () => {
  tvs.forEach((tv) => {
    // TODO: Implement here
  });
});

const stopTv = (remoteId: number) => {
  const tv = tvs.find(x => x.remoteId == remoteId);
  if (!tv)
    return;

  // TODO: Implement here
  tv.browser.destroy();
  tvs.splice(tvs.indexOf(tv), 1);
}

mp.events.addDataHandler('DoorLocked', (entity, value, oldValue) => {
  if (entity.type != RageEnums.EntityType.OBJECT)
    return;

  mp.game.object.setStateOfClosestDoorOfType(entity.model, entity.position.x, entity.position.y, entity.position.z, value, 0.0, false);
});

mp.events.addDataHandler('TV', (entity, value, oldValue) => {
  if (entity.type != RageEnums.EntityType.OBJECT)
    return;

  if (value) {
    const tv = JSON.parse(value);
    const tvHandle = tvs.find(x => x.remoteId == entity.remoteId);
    if (!tvHandle) {
      startTv(entity.model, tv, entity.remoteId);
      return;
    }

    const oldTv = JSON.parse(oldValue);
    if (tv.source != oldTv?.source)
      tvHandle.browser.call(Constants.TV_PAGE_TURN_ON, tv.source);
    else
      tvHandle.browser.call(Constants.TV_PAGE_SET_VOLUME, tv.volume);
  } else {
    stopTv(entity.remoteId);
  }
});

mp.events.add('DoorControl', (hash: number, pos: Vector3, closed: boolean) => {
  mp.game.object.setStateOfClosestDoorOfType(hash, pos.x, pos.y, pos.z, closed, 0, false);
});