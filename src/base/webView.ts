import { Constants } from './constants';
import { showCursor } from './cursor';

export let currentPages = [Constants.LOGIN_PAGE];

mp.events.add('browserDomReady', (browser) => {
  if (browser.url === webViewPath) {
    if (browser.headlessTextureDict)
      browser.call(Constants.WEB_VIEW_SET_PAGES, JSON.stringify([Constants.TV_PAGE]), JSON.stringify([]));
    else
      setPages([Constants.LOGIN_PAGE], []);
  }
});

const webViewPath = 'http://package/webviews/index.html';
export const webView = mp.browsers.new(webViewPath);

export const setPages = (addPages: string[], removePages: string[]) => {
  currentPages = currentPages.filter(x => !removePages.includes(x));
  currentPages.push(...addPages);
  webView.call(Constants.WEB_VIEW_SET_PAGES, JSON.stringify(addPages), JSON.stringify(removePages));
};

const events: { name: string, event: EventMp }[] = [];
export const configureEvent = (eventName: string, listener: (...args: any[]) => void) => {
  const eventsToRemove = events.filter(x => x.name === eventName);
  eventsToRemove.forEach(event => {
    event.event?.destroy();
  });

  const event = new mp.Event(eventName, listener);
  events.push({ name: eventName, event });
};

export const hasPageOpened = () => {
  const index = currentPages.findIndex(x => x != Constants.CHAT_PAGE && x != Constants.DEATH_PAGE && x != Constants.ANIMATION_HELP_PAGE);
  return index != -1;
};

export const toggleView = (show: boolean) => {
  showCursor(show, currentPages.findIndex(x => x === Constants.CHAR_CREATOR_PAGE || x === Constants.CLOTHES_PAGE || x === Constants.TATTOOS_PAGE) === -1);
};

export const getPlayerPosition = () => {
  return JSON.stringify({
    ...(mp.players.local.vehicle ? mp.players.local.vehicle.position : mp.players.local.position),
    dimension: mp.players.local.dimension
  });
}

export const getPlayerRotation = () => {
  return JSON.stringify({
    ...(mp.players.local.vehicle ? mp.players.local.vehicle.getRotation(2) : mp.players.local.getRotation(2)),
  });
}

export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}