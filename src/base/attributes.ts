import { configureEvent, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('Attributes:Show', (attributes: string, age: number) => {
  setPages([Constants.ATTRIBUTES_PAGE], []);
  configureEvent(Constants.ATTRIBUTES_PAGE_SHOW, () => {
    webView.call(Constants.ATTRIBUTES_PAGE_SHOW, attributes, age);
  });
  configureEvent(Constants.ATTRIBUTES_PAGE_CLOSE, () => {
    setPages([], [Constants.ATTRIBUTES_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.ATTRIBUTES_PAGE_SAVE, (attributes: string, age: number) => {
    callRemoteEvent('SaveAttributes', attributes, age);
  });
  toggleView(true);
  webView.call(Constants.ATTRIBUTES_PAGE_SHOW, attributes, age);
});