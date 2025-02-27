import { createPedEditCamera, destroyPedEditCamera, setPedTattoos } from './camera';
import { activateChat } from './chat';
import { configureEvent, setPages, webView, toggleView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('OpenTattoo', handleTattoosEdit);
export function handleTattoosEdit(sex: number, personalizationJson: string, outfitJson: string, studio: boolean) {
  const personalization = JSON.parse(personalizationJson);
  mp.game.ui.displayHud(false);
  mp.game.ui.displayRadar(false);
  activateChat(false);
  setPages([Constants.TATTOOS_PAGE], []);
  configureEvent(Constants.TATTOOS_PAGE_SHOW, () => {
    webView.call(Constants.TATTOOS_PAGE_SHOW, sex, studio, JSON.stringify(personalization.tattoos));
  });
  configureEvent(Constants.TATTOOS_PAGE_CONFIRM, (tattoosJson: string) => {
    callRemoteEvent('ConfirmTattoos', tattoosJson, studio, true);
  });
  configureEvent(Constants.TATTOOS_PAGE_CLOSE, () => {
    callRemoteEvent('ConfirmTattoos', '', studio, false);
  });
  configureEvent(Constants.TATTOOS_PAGE_SYNC, (tattoosJson: string) => {
    setPedTattoos(personalization, JSON.parse(tattoosJson));
  });
  webView.call(Constants.TATTOOS_PAGE_SHOW, sex, studio, JSON.stringify(personalization.tattoos));

  toggleView(true);
  createPedEditCamera(sex, personalizationJson, outfitJson);
}

mp.events.add('TattoosPage:CloseServer', handleClose);
function handleClose() {
  setPages([], [Constants.TATTOOS_PAGE]);
  toggleView(false);
  destroyPedEditCamera();
}