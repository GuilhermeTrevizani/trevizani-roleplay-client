import { WeaponModel } from './weaponModel';

const player = mp.players.local;
const randomHorizontalRecoil = 0.1;

interface WeaponRecoil {
  weapon: number;
  recoil: number;
};

let recoils: WeaponRecoil[] = [];

const getWeaponModel = (weaponName: string) => {
  const weaponKey = Object.keys(WeaponModel).find(
    key => key.toLowerCase() === weaponName.toLowerCase()
  );

  return WeaponModel[weaponKey];
}

mp.events.add('UpdateWeaponRecoils', (json: string) => {
  const tempRecoils = JSON.parse(json);
  recoils = tempRecoils.map((x: any) => ({ weapon: getWeaponModel(x.name), recoil: x.recoil }));
});

mp.events.add('render', () => {
  if (!player.isShooting())
    return;

  let recoil = recoils.find(x => x.weapon === player.weapon)?.recoil ?? 0;
  if (recoil === 0)
    return;

  if (player.vehicle)
    recoil *= 3.5;

  const pitch = mp.game.cam.getGameplayRelativePitch();
  const heading = mp.game.cam.getGameplayCamRelativeHeading();
  mp.game.cam.setGameplayCamRelativePitch(pitch + recoil, 0.2);
  const random = Math.random();
  const newHeading = randomHorizontalRecoil * (random > 0.5 ? 1 : -1);
  mp.game.cam.setGameplayCamRelativeHeading(heading + newHeading);
});