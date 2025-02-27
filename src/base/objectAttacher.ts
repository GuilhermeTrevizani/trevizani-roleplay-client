import { Constants } from './constants';
import { chatNotifiy } from './chat';

interface AttachedObject {
  model: string, boneId: number,
  posX: number, posY: number, posZ: number,
  rotX: number, rotY: number, rotZ: number,
  remoteId: number, object: ObjectMp
};
const attachedObjects: AttachedObject[] = [];

mp.events.add('entityStreamIn', (entity) => {
  if (entity.type !== RageEnums.EntityType.PLAYER)
    return;

  addFromPlayer(entity as PlayerMp);
});

mp.events.addDataHandler(Constants.PLAYER_META_DATA_ATTACHED_OBJECTS, (entity, value, oldValue) => {
  if (entity.type !== RageEnums.EntityType.PLAYER)
    return;

  removeFromPlayer(entity.remoteId);
  addFromPlayer(entity as PlayerMp);
});

mp.events.add('entityStreamOut', (entity) => {
  if (entity.type !== RageEnums.EntityType.PLAYER)
    return;

  removeFromPlayer(entity.remoteId);
});

const addFromPlayer = async (player: PlayerMp) => {
  const value = (player.getVariable(Constants.PLAYER_META_DATA_ATTACHED_OBJECTS) as string) ?? '[]';
  const objects = JSON.parse(value) as AttachedObject[];
  objects.forEach(attachedObject => {
    const boneIndex = player.getBoneIndex(attachedObject.boneId);

    try {
      attachedObject.object = mp.objects.new(attachedObject.model, player.position);
    } catch (ex: any) {
      chatNotifiy(`Objeto do item (${attachedObject.model}) não foi configurado corretamente. Por favor, reporte o bug.`, 'error');
      mp.console.logError(ex);
      return;
    }

    mp.game.waitForAsync(() => attachedObject.object?.handle !== 0, 10_000)
      .then((res: any) => {
        if (!res)
          return;

        attachedObject.object.setCollision(false, false);
        attachedObject.object.attachTo(player.handle, boneIndex,
          attachedObject.posX, attachedObject.posY, attachedObject.posZ,
          attachedObject.rotX, attachedObject.rotY, attachedObject.rotZ,
          false, false, false, false, 2, true);

        attachedObject.remoteId = player.remoteId;

        attachedObjects.push(attachedObject);
      });
  });
};

const removeFromPlayer = (remoteId: number) => {
  const objects = [...attachedObjects.filter(x => x.remoteId === remoteId)];
  objects.forEach(attachedObject => {
    attachedObject.object.destroy();
    delete attachedObjects[attachedObjects.indexOf(attachedObject)];
  });
};