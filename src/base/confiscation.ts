import { configureEvent, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

const closeConfiscationPage = () => {
  setPages([], [Constants.CONFISCATION_PAGE]);
  toggleView(false);
};

mp.events.add('Confiscation:Show', (itemsJson: string) => {
  setPages([Constants.CONFISCATION_PAGE], []);
  configureEvent(Constants.CONFISCATION_PAGE_SHOW, () => {
    webView.call(Constants.CONFISCATION_PAGE_SHOW, itemsJson);
  });
  configureEvent(Constants.CONFISCATION_PAGE_CLOSE, closeConfiscationPage);
  configureEvent(Constants.CONFISCATION_PAGE_SAVE, (identifier: string, characterName: string, confiscationJson: string) => {
    callRemoteEvent('ConfiscationSave', identifier, characterName, confiscationJson);
  });
  toggleView(true);
  webView.call(Constants.CONFISCATION_PAGE_SHOW, itemsJson);
});

mp.events.add('ConfiscationPage:CloseServer', closeConfiscationPage);