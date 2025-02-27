import { requestAnimDict } from './animation';
import { Constants } from './constants';
import { distanceTo } from './cursor';

const peds: {
  localPed?: PedMp, remoteId: string, model: number, heading: number, position: Vector3, dimension: number,
  personalizationJson: string, outfitJson: string
}[] = [];

setInterval(() => {
  peds.forEach(ped => {
    if (distanceTo(mp.players.local.position, ped.position) >= 250) {
      ped.localPed?.destroy();
      ped.localPed = undefined;
    } else {
      if (ped.localPed)
        return;

      ped.localPed = mp.peds.new(ped.model, ped.position, ped.heading, ped.dimension);
      mp.game.waitForAsync(() => ped.localPed?.handle !== 0 && ped.localPed?.doesExist(), 10_000)
        .then((res: any) => {
          if (!res)
            return;

          const localPed = ped.localPed!;
          localPed.freezePosition(true);
          localPed.setBlockingOfNonTemporaryEvents(true);
          localPed.taskSetBlockingOfNonTemporaryEvents(true);
          localPed.setInvincible(true);
          localPed.setFleeAttributes(15, true);

          if (ped.personalizationJson) {
            const personalization = JSON.parse(ped.personalizationJson);

            setPersonalization(localPed, personalization);

            const outfit = JSON.parse(ped.outfitJson);

            setPedCloth(localPed, 1, outfit.cloth1);
            setPedCloth(localPed, 3, outfit.cloth3);
            setPedCloth(localPed, 4, outfit.cloth4);
            setPedCloth(localPed, 5, outfit.cloth5);
            setPedCloth(localPed, 6, outfit.cloth6);
            setPedCloth(localPed, 7, outfit.cloth7);
            setPedCloth(localPed, 8, outfit.cloth8);
            setPedCloth(localPed, 9, outfit.cloth9);
            setPedCloth(localPed, 10, outfit.cloth10);
            setPedCloth(localPed, 11, outfit.cloth11);

            setPedAcessory(localPed, 0, outfit.accessory0);
            setPedAcessory(localPed, 1, outfit.accessory1);
            setPedAcessory(localPed, 2, outfit.accessory2);
            setPedAcessory(localPed, 6, outfit.accessory6);
            setPedAcessory(localPed, 7, outfit.accessory7);

            playPedAnimation(localPed, 'dead', 'dead_d', 2);
          }
        });
    }
  });
}, 2_000);

mp.events.add('Ped:Setup', (remoteId: string, model: number, heading: number, position: Vector3, dimension: number,
  personalizationJson: string, outfitJson: string) => {
  const ped = peds.find(x => x.remoteId == remoteId);
  if (ped)
    return;

  peds.push({ remoteId, model, heading, position, dimension, personalizationJson, outfitJson });
});

mp.events.add('Ped:Remove', (remoteId: string) => {
  const ped = peds.find(x => x.remoteId == remoteId);
  if (!ped)
    return;

  ped.localPed?.destroy();
  peds.splice(peds.indexOf(ped), 1);
});

export function setPedCloth(ped: PedMp, component: number, cloth: any) {
  if (!cloth.using) {
    cloth.texture = 0;
    cloth.dlc = null;

    if (component === 3 || component === 8 || component === 11)
      cloth.drawable = Constants.CLOTH_3_8_11_DEFAULT_DRAWABLE;
    else if (component === 4)
      cloth.drawable = ped.model === Constants.MALE_MODEL ?
        Constants.CLOTH_4_DEFAULT_DRAWABLE_MALE
        :
        Constants.CLOTH_4_DEFAULT_DRAWABLE_FEMALE;
    else if (component === 6)
      cloth.drawable = ped.model === Constants.MALE_MODEL ?
        Constants.CLOTH_6_DEFAULT_DRAWABLE_MALE
        :
        Constants.CLOTH_6_DEFAULT_DRAWABLE_FEMALE;
    else
      cloth.drawable = 0;
  }

  setCloth(ped, component, cloth.drawable, cloth.texture, cloth.dlc);
}

export function setCloth(ped: PedMp, component: number, drawable: number, texture: number, dlc?: string) {
  ped.setComponentVariation(component, drawable, texture, 0);
}

export function setPedAcessory(ped: PedMp, component: number, accessory: any) {
  const drawable = accessory.using ? accessory.drawable : -1;
  setAccessory(ped, component, drawable, accessory.texture, accessory.dlc);
}

export function setAccessory(ped: PedMp, component: number, drawable: number, texture: number, dlc?: string) {
  if (drawable === -1) {
    ped.clearProp(component);
    return;
  }

  ped.setPropIndex(component, drawable, texture, true);
}

export function setPersonalization(ped: PedMp, personalization: any) {
  if (!ped)
    return;

  ped.setHeadBlendData(personalization.faceFather, personalization.faceMother, personalization.faceAncestry,
    personalization.skinFather, personalization.skinMother, personalization.skinAncestry,
    personalization.faceMix, personalization.skinMix, personalization.ancestryMix, false);

  for (let i = 0; i < personalization.structure.length; i++)
    ped.setFaceFeature(i, personalization.structure[i]);

  personalization.opacityOverlays.forEach((opacityOverlay: any) => {
    ped.setHeadOverlay(opacityOverlay.id, opacityOverlay.value, opacityOverlay.opacity);
  });

  setCloth(ped, 2, personalization.hair, 0, personalization.hairDLC);

  ped.setHairColor(personalization.hairColor1, personalization.hairColor2);

  personalization.colorOverlays.forEach((colorOverlay: any) => {
    let colorType = 0;

    if (colorOverlay.id == 5 || colorOverlay.id == 8)
      colorType = 2;
    else if (colorOverlay.id == 1 || colorOverlay.id == 2 || colorOverlay.id == 10)
      colorType = 1;

    ped.setHeadOverlay(colorOverlay.id, colorOverlay.value, colorOverlay.opacity);
    ped.setHeadOverlayColor(colorOverlay.id, colorType, colorOverlay.color1, colorOverlay.color2);
  });

  ped.setEyeColor(personalization.eyes);

  ped.clearDecorations();

  if (personalization.hairOverlay && personalization.hairCollection)
    ped.setDecoration(mp.game.joaat(personalization.hairCollection), mp.game.joaat(personalization.hairOverlay));

  personalization.tattoos.forEach((tattoo: any) => {
    ped.setDecoration(mp.game.joaat(tattoo.collection), mp.game.joaat(tattoo.overlay));
  });
}

export function playPedAnimation(ped: PedMp, dictionary: string, name: string, flag: number) {
  requestAnimDict(dictionary).then(() => {
    ped.taskPlayAnim(dictionary, name, 8, -8, -1, flag, 1, false, false, false);
  });
}