import { configureEvent, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('StaffInfo:Show', (json: string) => {
  setPages([Constants.STAFF_INFO_PAGE], []);
  configureEvent(Constants.STAFF_INFO_PAGE_SHOW, () => {
    webView.call(Constants.STAFF_INFO_PAGE_SHOW, json);
  });
  configureEvent(Constants.STAFF_INFO_PAGE_CLOSE, () => {
    setPages([], [Constants.STAFF_INFO_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.STAFF_INFO_PAGE_GO_TO, (id) => {
    callRemoteEvent('StaffInfoGoto', id);
  });
  configureEvent(Constants.STAFF_INFO_PAGE_REMOVE, (id) => {
    callRemoteEvent('StaffInfoRemove', id);
  });
  toggleView(true);
});

mp.events.add('StaffInfo:Update', (json: string) => {
  webView.call(Constants.STAFF_INFO_PAGE_SHOW, json);
});