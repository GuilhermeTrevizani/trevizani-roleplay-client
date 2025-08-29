import { configureEvent, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('Info:Show', (json: string) => {
  setPages([Constants.INFO_PAGE], []);
  configureEvent(Constants.INFO_PAGE_SHOW, () => {
    webView.call(Constants.INFO_PAGE_SHOW, json);
  });
  configureEvent(Constants.INFO_PAGE_CLOSE, () => {
    setPages([], [Constants.INFO_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.INFO_PAGE_SAVE, (message: string, image: string) => {
    callRemoteEvent('InfoSave', message, image);
  });
  configureEvent(Constants.INFO_PAGE_REMOVE, (id: string) => {
    callRemoteEvent('InfoRemove', id);
  });
  toggleView(true);
  webView.call(Constants.INFO_PAGE_SHOW, json);
});

mp.events.add('Info:Update', (json: string) => {
  webView.call(Constants.INFO_PAGE_SHOW, json);
});

mp.events.add('OpenImage', (url: string) => {
  setPages([Constants.IMAGE_PAGE], []);
  configureEvent(Constants.IMAGE_PAGE_SHOW, () => {
    webView.call(Constants.IMAGE_PAGE_SHOW, url);
  });
  configureEvent(Constants.IMAGE_PAGE_CLOSE, () => {
    setPages([], [Constants.IMAGE_PAGE]);
    toggleView(false);
  });
  toggleView(true);
  webView.call(Constants.IMAGE_PAGE_SHOW, url);
});