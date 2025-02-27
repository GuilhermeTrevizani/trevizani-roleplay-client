import { createPedEditCamera, destroyPedEditCamera, setPedPersonalization } from './camera';
import { activateChat, chatNotifiy } from './chat';
import { configureEvent, setPages, webView, toggleView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('Character:Edit', handleCharacterEdit);
export function handleCharacterEdit(sex: number, personalizationJson: string, outfitJson: string, type: number) {
  mp.game.ui.displayHud(false);
  mp.game.ui.displayRadar(false);
  activateChat(false);
  setPages([Constants.CHAR_CREATOR_PAGE], []);
  configureEvent(Constants.CHAR_CREATOR_PAGE_SHOW, () => {
    webView.call(Constants.CHAR_CREATOR_PAGE_SHOW, sex, personalizationJson, type);
  });
  configureEvent(Constants.CHAR_CREATOR_PAGE_CONFIRM, (personalizationJson: string) => {
    callRemoteEvent('ConfirmPersonalization', personalizationJson, type, true);
    closeEditor();
  });
  configureEvent(Constants.CHAR_CREATOR_PAGE_CLOSE, () => {
    callRemoteEvent('ConfirmPersonalization', '', type, false);
    closeEditor();
  });
  configureEvent(Constants.CHAR_CREATOR_PAGE_SYNC, (personalizationJson: string) => {
    setPedPersonalization(JSON.parse(personalizationJson));
  });
  configureEvent(Constants.CHAR_CREATOR_PAGE_NOTIFY_ERROR, (message: string) => {
    chatNotifiy(message, 'error');
  });
  toggleView(true);

  configureCamera(sex, personalizationJson, outfitJson);
}

function configureCamera(sex: number, personalizationJson: string, outfitJson: string) {
  createPedEditCamera(sex, personalizationJson, outfitJson);
}

function closeEditor() {
  setPages([], [Constants.CHAR_CREATOR_PAGE]);
  toggleView(false);
  destroyPedEditCamera();
}