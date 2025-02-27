import { callRemoteEvent, showCursor } from './cursor';
import { webView, configureEvent, setPages, toggleView } from './webView';
import { Constants } from './constants';

mp.gui.chat.show(false);

configureEvent(Constants.CHAT_PAGE_SEND_INPUT, (text: string) => {
  callRemoteEvent('OnPlayerChat', text);
});

configureEvent(Constants.CHAT_PAGE_ACTIVE_INPUT, (state: boolean) => {
  callRemoteEvent('Chatting', state);
  showCursor(state, state);
});

configureEvent(Constants.CHAT_PAGE_SHOW_CONFIRM_CONFIRM, (functionName: string) => {
  toggleView(false);
  callRemoteEvent(functionName);
});

configureEvent(Constants.CHAT_PAGE_SHOW_CONFIRM_CANCEL, () => {
  toggleView(false);
});

function sanitizeString(input: string) {
  return input.replace(/<\/?span[^>]*>/gi, "");
}

mp.events.add(Constants.CHAT_PAGE_SEND_MESSAGE, (text: string, color: string) => {
  webView.call(Constants.CHAT_PAGE_SEND_MESSAGE, text, color);
  mp.console.logInfo(sanitizeString(text), true);
});

mp.events.add(Constants.CHAT_PAGE_CONFIGURE, async (timeStamp: boolean, fontType: number, fontSize: number, lines: number) => {
  webView.call(Constants.CHAT_PAGE_CONFIGURE, timeStamp, fontType, fontSize, lines);
});

mp.events.add(Constants.CHAT_PAGE_NOTIFY, chatNotifiy);
export function chatNotifiy(text: string, type: 'success' | 'error') {
  webView.call(Constants.CHAT_PAGE_NOTIFY, text, type);
  webView.call(Constants.WEB_VIEW_END_LOADING);
}

mp.events.add(Constants.CHAT_PAGE_SHOW_CONFIRM, (title: string, description: string, functionName: string) => {
  toggleView(true);
  webView.call(Constants.CHAT_PAGE_SHOW_CONFIRM, title, description, functionName);
});

mp.events.add(Constants.CHAT_PAGE_CLEAR_MESSAGES, () => {
  webView.call(Constants.CHAT_PAGE_CLEAR_MESSAGES);
});

export function activateChat(state: boolean) {
  setPages(state ? [Constants.CHAT_PAGE] : [], state ? [] : [Constants.CHAT_PAGE]);
}

mp.events.add(Constants.CHAT_PAGE_TOGGLE_SCREEN, (backgroundColor: string) => {
  webView.call(Constants.CHAT_PAGE_TOGGLE_SCREEN, backgroundColor);
});

export function activateCurrentHUD() {
  if (!mp.storage.data.f7) {
    activateChat(true);
    mp.game.ui.displayHud(true);
    mp.game.ui.displayRadar(true);
  }
}