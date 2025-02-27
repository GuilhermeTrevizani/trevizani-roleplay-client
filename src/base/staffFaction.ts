import { configureEvent, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('StaffFaction:Show', (factionsJson: string, typesJson: string) => {
  setPages([Constants.STAFF_FACTION_PAGE], []);
  configureEvent(Constants.STAFF_FACTION_PAGE_SHOW, () => {
    webView.call(Constants.STAFF_FACTION_PAGE_SHOW, factionsJson);
    webView.call(Constants.STAFF_FACTION_PAGE_LOAD_TYPES, typesJson);
  });
  configureEvent(Constants.STAFF_FACTION_PAGE_CLOSE, () => {
    setPages([], [Constants.STAFF_FACTION_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.STAFF_FACTION_PAGE_SAVE, (id, name, type, slots, leaderName, shortName) => {
    callRemoteEvent('StaffFactionSave', id, name, type, slots, leaderName, shortName);
  });
  configureEvent(Constants.STAFF_FACTION_PAGE_SHOW_RANKS, (id) => {
    callRemoteEvent('StaffFactionShowRanks', id);
  });
  configureEvent(Constants.STAFF_FACTION_PAGE_SHOW_MEMBERS, (id) => {
    callRemoteEvent('StaffFactionShowMembers', id);
  });
  configureEvent(Constants.STAFF_FACTION_PAGE_SHOW_FREQUENCIES, (id) => {
    callRemoteEvent('StaffFactionShowFrequencies', id);
  });
  toggleView(true);
});

mp.events.add('StaffFaction:Update', (json: string) => {
  webView.call(Constants.STAFF_FACTION_PAGE_SHOW, json);
});