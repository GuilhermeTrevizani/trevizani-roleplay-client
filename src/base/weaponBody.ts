import { Constants } from './constants';
import { callRemoteEvent } from './cursor';
import { configureEvent, setPages, webView, toggleView } from './webView';

const player = mp.players.local;
const boneIndex = 0;
let attachedObject: ObjectMp;

mp.events.add('WeaponBody:Show', (weaponName: string, objectModel: string, json: string) => {
  const weaponBody = JSON.parse(json);
  attachedObject = mp.objects.new(objectModel, player.position);
  mp.game.waitForAsync(() => attachedObject?.handle !== 0 && attachedObject.doesExist(), 10_000)
    .then((res: any) => {
      if (!res)
        return;

      attachedObject.setCollision(false, false);
      attachedObject.attachTo(player.handle, boneIndex,
        weaponBody.posX, weaponBody.posY, weaponBody.posZ,
        weaponBody.rotR, weaponBody.rotP, weaponBody.rotY,
        false, false, false, false, 2, true);

      setPages([Constants.WEAPON_BODY_PAGE], []);
      configureEvent(Constants.WEAPON_BODY_PAGE_SHOW, () => {
        webView.call(Constants.WEAPON_BODY_PAGE_SHOW, json);
      });
      configureEvent(Constants.WEAPON_BODY_PAGE_CLOSE, () => {
        callRemoteEvent('SaveWeaponBody', false, weaponName, objectModel, '');
      });
      configureEvent(Constants.WEAPON_BODY_PAGE_SAVE, (json: string) => {
        callRemoteEvent('SaveWeaponBody', true, weaponName, objectModel, json);
      });
      configureEvent(Constants.WEAPON_BODY_PAGE_SET, (weaponBodyJson: string) => {
        const weaponBody = JSON.parse(weaponBodyJson);
        attachedObject.attachTo(player.handle, boneIndex,
          weaponBody.posX, weaponBody.posY, weaponBody.posZ,
          weaponBody.rotR, weaponBody.rotP, weaponBody.rotY,
          false, false, false, false, 2, true);
      });
      toggleView(true);
      webView.call(Constants.WEAPON_BODY_PAGE_SHOW, json);
    });
});

mp.events.add('WeaponBody:CloseServer', () => {
  attachedObject?.destroy();
  setPages([], [Constants.WEAPON_BODY_PAGE]);
  toggleView(false);
});