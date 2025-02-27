import { configureEvent, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

let objectHash = 0;
let objectPosition = new mp.Vector3(0, 0, 0);

export const detectObject = () => {
  mp.console.logInfo('[Informações do Objeto]');
  const entityFound = mp.game.player.getEntityIsFreeAimingAt();
  if (entityFound) {
    const entityNumber = (entityFound as EntityMp)?.handle ?? (entityFound as number);
    objectHash = mp.game.entity.getModel(entityNumber);
    mp.console.logInfo(`  Hash: ${objectHash.toString(10)}`);
    objectPosition = mp.game.entity.getCoords(entityNumber, false);
    mp.console.logInfo(`  Posição: (X: ${objectPosition.x} Y: ${objectPosition.y} Z: ${objectPosition.z})`);
  }
};

mp.events.add('StaffDoor:Show', (json: string) => {
  setPages([Constants.STAFF_DOOR_PAGE], []);
  configureEvent(Constants.STAFF_DOOR_PAGE_SHOW, () => {
    webView.call(Constants.STAFF_DOOR_PAGE_SHOW, json, objectHash, objectPosition);
  });
  configureEvent(Constants.STAFF_DOOR_PAGE_CLOSE, () => {
    setPages([], [Constants.STAFF_DOOR_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.STAFF_DOOR_PAGE_GO_TO, (id: string) => {
    callRemoteEvent('StaffDoorGoto', id);
  });
  configureEvent(Constants.STAFF_DOOR_PAGE_SAVE, (id: string, name: string, hash: number,
    posX: number, posY: number, posZ: number, factionName: string, companyName: string, locked: string) => {
    callRemoteEvent('StaffDoorSave', id, name, hash, new mp.Vector3(posX, posY, posZ), factionName, companyName, locked);
  });
  configureEvent(Constants.STAFF_DOOR_PAGE_REMOVE, (id: string) => {
    callRemoteEvent('StaffDoorRemove', id);
  });
  toggleView(true);
  webView.call(Constants.STAFF_DOOR_PAGE_SHOW, json, objectHash, objectPosition);
});

mp.events.add('StaffDoor:Update', (json: string) => {
  webView.call(Constants.STAFF_DOOR_PAGE_SHOW, json, objectHash, objectPosition);
});