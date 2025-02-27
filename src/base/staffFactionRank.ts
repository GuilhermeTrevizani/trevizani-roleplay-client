import { configureEvent, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('StaffFactionRank:Show', (json: string, factionName: string) => {
  setPages([Constants.STAFF_FACTION_RANK_PAGE], [Constants.STAFF_FACTION_PAGE]);
  configureEvent(Constants.STAFF_FACTION_RANK_PAGE_SHOW, () => {
    webView.call(Constants.STAFF_FACTION_RANK_PAGE_SHOW, json);
    webView.call(Constants.STAFF_FACTION_RANK_PAGE_LOAD_FACTION_NAME, factionName);
  });
  configureEvent(Constants.STAFF_FACTION_RANK_PAGE_CLOSE, () => {
    setPages([], [Constants.STAFF_FACTION_RANK_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.STAFF_FACTION_RANK_PAGE_SAVE, (id: string, salary: number) => {
    callRemoteEvent('StaffFactionRankSave', id, salary);
  });
  toggleView(true);
});

mp.events.add('StaffFactionRank:Update', (json: string) => {
  webView.call(Constants.STAFF_FACTION_RANK_PAGE_SHOW, json);
});