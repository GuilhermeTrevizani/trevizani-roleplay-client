import { configureEvent, getPlayerPosition, getPlayerRotation, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('StaffJob:Show', (json: string) => {
  setPages([Constants.STAFF_JOB_PAGE], []);
  configureEvent(Constants.STAFF_JOB_PAGE_SHOW, () => {
    webView.call(Constants.STAFF_JOB_PAGE_SHOW, json, getPlayerPosition(), getPlayerRotation());
  });
  configureEvent(Constants.STAFF_JOB_PAGE_CLOSE, () => {
    setPages([], [Constants.STAFF_JOB_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.STAFF_JOB_PAGE_SAVE, (json: string) => {
    callRemoteEvent('StaffJobSave', json);
  });
  toggleView(true);
  webView.call(Constants.STAFF_JOB_PAGE_SHOW, json, getPlayerPosition(), getPlayerRotation());
});

mp.events.add('StaffJob:Update', (json: string) => {
  webView.call(Constants.STAFF_JOB_PAGE_SHOW, json, getPlayerPosition(), getPlayerRotation());
});