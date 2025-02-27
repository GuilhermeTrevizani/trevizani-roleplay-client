import { configureEvent, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('StaffSearchCharacter:Show', (userStaff: number, userStaffFlagsJson: string, characterJson: string) => {
  setPages([Constants.STAFF_SEARCH_CHARACTER_PAGE], []);
  configureEvent(Constants.STAFF_SEARCH_CHARACTER_PAGE_SHOW, () => {
    webView.call(Constants.STAFF_SEARCH_CHARACTER_PAGE_SHOW, userStaff, userStaffFlagsJson, characterJson);
  });
  configureEvent(Constants.STAFF_SEARCH_CHARACTER_PAGE_CLOSE, () => {
    setPages([], [Constants.STAFF_SEARCH_CHARACTER_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.STAFF_SEARCH_CHARACTER_PAGE_BAN, (id: string, days: number, reason: string) => {
    callRemoteEvent('StaffBanCharacter', id, days, reason);
  });
  configureEvent(Constants.STAFF_SEARCH_CHARACTER_PAGE_CK, (id: string) => {
    callRemoteEvent('StaffCKCharacter', id);
  });
  configureEvent(Constants.STAFF_SEARCH_CHARACTER_PAGE_REMOVE_CK_OR_CK_AVALIATION, (id: string) => {
    callRemoteEvent('StaffCKAvaliationRemoveCharacter', id);
  });
  configureEvent(Constants.STAFF_SEARCH_CHARACTER_PAGE_SET_CK_AVALIATION, (id: string) => {
    callRemoteEvent('StaffCKAvaliationCharacter', id);
  });
  configureEvent(Constants.STAFF_SEARCH_CHARACTER_PAGE_CHANGE_NAME_CHANGE_STATUS, (id: string) => {
    callRemoteEvent('StaffNameChangeStatusCharacter', id);
  });
  configureEvent(Constants.STAFF_SEARCH_CHARACTER_PAGE_REMOVE_JAIL, (id: string) => {
    callRemoteEvent('StaffRemoveJailCharacter', id);
  });
  configureEvent(Constants.STAFF_SEARCH_CHARACTER_PAGE_GIVE_WARN, (id: string, reason: string) => {
    callRemoteEvent('StaffGiveCharacterWarning', id, reason);
  });
  configureEvent(Constants.STAFF_SEARCH_CHARACTER_PAGE_GIVE_AJAIL, (id: string, minutes: number, reason: string) => {
    callRemoteEvent('StaffGiveCharacterAjail', id, minutes, reason);
  });
  toggleView(true);
  webView.call(Constants.STAFF_SEARCH_CHARACTER_PAGE_SHOW, userStaff, userStaffFlagsJson, characterJson);
});