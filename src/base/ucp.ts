import { Constants } from './constants';
import { configureEvent, setPages, webView, toggleView } from './webView';
import { callRemoteEvent } from './cursor';

mp.events.add('Stats:Open', (json: string) => {
  setPages([Constants.STATS_PAGE], []);
  configureEvent(Constants.STATS_PAGE_CLOSE, () => {
    setPages([], [Constants.STATS_PAGE]);
    toggleView(false);
  });
  toggleView(true);
  webView.call(Constants.STATS_PAGE_SHOW, json);
});

mp.events.add('Help:Open', (json: string) => {
  setPages([Constants.HELP_PAGE], []);
  configureEvent(Constants.HELP_PAGE_CLOSE, () => {
    setPages([], [Constants.HELP_PAGE]);
    toggleView(false);
  });
  toggleView(true);
  webView.call(Constants.HELP_PAGE_SHOW, json);
});

mp.events.add('Settings:Open', (settingsJson: string, characterJson: string, receiveSMSDiscordOptionsJson: string) => {
  setPages([Constants.SETTINGS_PAGE], []);
  configureEvent(Constants.SETTINGS_PAGE_SHOW, () => {
    webView.call(Constants.SETTINGS_PAGE_SHOW, settingsJson, characterJson, receiveSMSDiscordOptionsJson);
  });
  configureEvent(Constants.SETTINGS_PAGE_CLOSE, () => {
    setPages([], [Constants.SETTINGS_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.SETTINGS_PAGE_SAVE, (json: string) => {
    callRemoteEvent('SaveSettings', json);
  });
  toggleView(true);
  webView.call(Constants.SETTINGS_PAGE_SHOW, settingsJson, characterJson, receiveSMSDiscordOptionsJson);
});