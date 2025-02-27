import { createPedEditCamera, destroyPedEditCamera, setCurrentPedAccessory, setCurrentPedCloth } from './camera';
import { activateChat } from './chat';
import { configureEvent, setPages, webView, toggleView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('EditOutfits', handleClothesEdit);
export function handleClothesEdit(outfit: number, maxOutfit: number, outfitsJson: string, type: number, sex: number, factionType: number,
  personalizationJson: string, outfitJson: string
) {
  mp.game.ui.displayHud(false);
  mp.game.ui.displayRadar(false);
  activateChat(false);
  setPages([Constants.CLOTHES_PAGE], []);
  configureEvent(Constants.CLOTHES_PAGE_SHOW, () => {
    webView.call(Constants.CLOTHES_PAGE_SHOW, outfit, maxOutfit, outfitsJson, type, sex, factionType);
  });
  configureEvent(Constants.CLOTHES_PAGE_CONFIRM, (outfit: number, outfitsJson: string) => {
    if (type === 0)
      handleClose();

    const array = outfitsJson.match(/.{1,2000}/g)!;
    array.forEach((value, index) => {
      callRemoteEvent('SaveOutfits', outfit, value.toString(), type, true, index, array.length);
    });
  });
  configureEvent(Constants.CLOTHES_PAGE_CLOSE, () => {
    if (type === 0)
      handleClose();

    callRemoteEvent('SaveOutfits', 0, '', type, false, 0, 0);
  });
  configureEvent(Constants.CLOTHES_PAGE_SET_CLOTHES, (component: number, drawable: number, texture: number, dlc?: string) => {
    setCurrentPedCloth(component, drawable, texture, dlc);
  });
  configureEvent(Constants.CLOTHES_PAGE_SET_PROPS, (component: number, drawable: number, texture: number, dlc?: string) => {
    setCurrentPedAccessory(component, drawable, texture, dlc);
  });
  toggleView(true);
  createPedEditCamera(sex, personalizationJson, outfitJson);
}

mp.events.add('ClothesPage:CloseServer', handleClose);
function handleClose() {
  setPages([], [Constants.CLOTHES_PAGE]);
  toggleView(false);
  destroyPedEditCamera();
}