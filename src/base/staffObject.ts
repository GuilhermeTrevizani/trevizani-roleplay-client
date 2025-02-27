import { configureEvent, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('StaffObject:Show', (json: string) => {
  setPages([Constants.STAFF_OBJECT_PAGE], []);
  configureEvent(Constants.STAFF_OBJECT_PAGE_SHOW, () => {
    webView.call(Constants.STAFF_OBJECT_PAGE_SHOW, json);
  });
  configureEvent(Constants.STAFF_OBJECT_PAGE_CLOSE, close);
  configureEvent(Constants.STAFF_OBJECT_PAGE_GO_TO, (id: string) => {
    callRemoteEvent('StaffObjectGoto', id);
  });
  configureEvent(Constants.STAFF_OBJECT_PAGE_ADD, (model: string) => {
    close();
    callRemoteEvent('StaffObjectAdd', model);
  });
  configureEvent(Constants.STAFF_OBJECT_PAGE_EDIT, (id: string) => {
    close();
    callRemoteEvent('StaffObjectEdit', id);
  });
  configureEvent(Constants.STAFF_OBJECT_PAGE_REMOVE, (id: string) => {
    callRemoteEvent('StaffObjectRemove', id);
  });
  toggleView(true);
  webView.call(Constants.STAFF_OBJECT_PAGE_SHOW, json);
});

const close = () => {
  setPages([], [Constants.STAFF_OBJECT_PAGE]);
  toggleView(false);
};