import { configureEvent, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('StaffFactionFrequency:Show', (json: string, factionId: string, factionName: string) => {
  setPages([Constants.STAFF_FACTION_FREQUENCY_PAGE], [Constants.STAFF_FACTION_PAGE]);
  configureEvent(Constants.STAFF_FACTION_FREQUENCY_PAGE_SHOW, () => {
    webView.call(Constants.STAFF_FACTION_FREQUENCY_PAGE_SHOW, json);
    webView.call(Constants.STAFF_FACTION_FREQUENCY_PAGE_LOAD_FACTION_NAME, factionName);
  });
  configureEvent(Constants.STAFF_FACTION_FREQUENCY_PAGE_CLOSE, () => {
    setPages([], [Constants.STAFF_FACTION_FREQUENCY_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.STAFF_FACTION_FREQUENCY_PAGE_SAVE, (id: string, frequency: number, name: string) => {
    callRemoteEvent('StaffFactionFrequencySave', factionId, id, frequency, name);
  });
  configureEvent(Constants.STAFF_FACTION_FREQUENCY_PAGE_REMOVE, (id: string) => {
    callRemoteEvent('StaffFactionFrequencyRemove', factionId, id);
  });
  toggleView(true);
});

mp.events.add('StaffFactionFrequency:Update', (json: string) => {
  webView.call(Constants.STAFF_FACTION_FREQUENCY_PAGE_SHOW, json);
});