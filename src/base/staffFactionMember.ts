import { configureEvent, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';

mp.events.add('StaffFactionMember:Show', (json: string, factionName: string) => {
  setPages([Constants.STAFF_FACTION_MEMBER_PAGE], [Constants.STAFF_FACTION_PAGE]);
  configureEvent(Constants.STAFF_FACTION_MEMBER_PAGE_SHOW, () => {
    webView.call(Constants.STAFF_FACTION_MEMBER_PAGE_SHOW, json, factionName);
  });
  configureEvent(Constants.STAFF_FACTION_MEMBER_PAGE_CLOSE, () => {
    setPages([], [Constants.STAFF_FACTION_MEMBER_PAGE]);
    toggleView(false);
  });
  toggleView(true);
});