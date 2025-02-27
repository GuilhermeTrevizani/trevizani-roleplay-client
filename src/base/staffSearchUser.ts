import { configureEvent, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('StaffSearchUser:Show', (userStaffJson: string, staffFlagJson: string, staff: number, userJson: string) => {
  setPages([Constants.STAFF_SEARCH_USER_PAGE], []);
  configureEvent(Constants.STAFF_SEARCH_USER_PAGE_SHOW, () => {
    webView.call(Constants.STAFF_SEARCH_USER_PAGE_SHOW, userStaffJson, staffFlagJson, staff, userJson);
  });
  configureEvent(Constants.STAFF_SEARCH_USER_PAGE_CLOSE, () => {
    setPages([], [Constants.STAFF_SEARCH_USER_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.STAFF_SEARCH_USER_PAGE_SAVE, (userId: string, staff: number, staffFlagsJson: string) => {
    callRemoteEvent('StaffSaveUser', userId, staff, staffFlagsJson);
  });
  toggleView(true);
  webView.call(Constants.STAFF_SEARCH_USER_PAGE_SHOW, userStaffJson, staffFlagJson, staff, userJson);
});