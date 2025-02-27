import { configureEvent, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('Morgue:Show', (json: string) => {
  setPages([Constants.MORGUE_PAGE], []);
  configureEvent(Constants.MORGUE_PAGE_SHOW, () => {
    webView.call(Constants.MORGUE_PAGE_SHOW, json);
  });
  configureEvent(Constants.MORGUE_PAGE_CLOSE, closeMorguePage);
  configureEvent(Constants.MORGUE_PAGE_VIEW_BODY, (id: string) => {
    callRemoteEvent('MorgueViewBody', id);
    closeMorguePage();
  });
  toggleView(true);
  webView.call(Constants.MORGUE_PAGE_SHOW, json);
});

const closeMorguePage = () => {
  setPages([], [Constants.MORGUE_PAGE]);
  toggleView(false);
};