import { configureEvent, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('StaffGraffiti:Show', (json: string) => {
  setPages([Constants.STAFF_GRAFFITI_PAGE], []);
  configureEvent(Constants.STAFF_GRAFFITI_PAGE_SHOW, () => {
    webView.call(Constants.STAFF_GRAFFITI_PAGE_SHOW, json);
  });
  configureEvent(Constants.STAFF_GRAFFITI_PAGE_CLOSE, () => {
    setPages([], [Constants.STAFF_GRAFFITI_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.STAFF_GRAFFITI_PAGE_GO_TO, (id) => {
    callRemoteEvent('StaffGraffitiGoto', id);
  });
  configureEvent(Constants.STAFF_GRAFFITI_PAGE_REMOVE, (id) => {
    callRemoteEvent('StaffGraffitiRemove', id);
  });
  toggleView(true);
  webView.call(Constants.STAFF_GRAFFITI_PAGE_SHOW, json);
});

mp.events.add('StaffGraffiti:Update', (json: string) => {
  webView.call(Constants.STAFF_GRAFFITI_PAGE_SHOW, json);
});