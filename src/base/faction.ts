import { Constants } from './constants';
import { callRemoteEvent } from './cursor';
import { configureEvent, setPages, webView, toggleView } from './webView';

mp.events.add('ShowFaction', (ranksJson: string, membersJson: string, flagsJson: string,
  factionId: string, factionName: string, government: boolean, isLeader: boolean, factionFlagsJson: string,
  factionColor: string, factionChatColor: string, vehiclesJson: string) => {
  setPages([Constants.FACTION_PAGE], []);
  configureEvent(Constants.FACTION_PAGE_SHOW, () => {
    webView.call(Constants.FACTION_PAGE_SHOW, ranksJson, membersJson, flagsJson,
      factionName, government, isLeader, factionFlagsJson,
      factionColor, factionChatColor, vehiclesJson);
  });
  configureEvent(Constants.FACTION_PAGE_CLOSE, () => {
    setPages([], [Constants.FACTION_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.FACTION_PAGE_SAVE_RANK, (factionRankId: string, name: string) => {
    callRemoteEvent('FactionRankSave', factionId, factionRankId, name);
  });
  configureEvent(Constants.FACTION_PAGE_REMOVE_RANK, (factionRankId: string) => {
    callRemoteEvent('FactionRankRemove', factionId, factionRankId);
  });
  configureEvent(Constants.FACTION_PAGE_ORDER_RANKS, (ranksJson: string) => {
    callRemoteEvent('FactionRankOrder', factionId, ranksJson);
  });
  configureEvent(Constants.FACTION_PAGE_SAVE_MEMBER, (characterId: string, factionRankId: string, badge: number, flagsJson: string) => {
    callRemoteEvent('FactionMemberSave', factionId, characterId, factionRankId, badge, flagsJson);
  });
  configureEvent(Constants.FACTION_PAGE_REMOVE_MEMBER, (characterId: string) => {
    callRemoteEvent('FactionMemberRemove', factionId, characterId);
  });
  configureEvent(Constants.FACTION_PAGE_SAVE, (color: string, chatColor: string) => {
    callRemoteEvent('FactionSave', factionId, color, chatColor);
  });
  configureEvent(Constants.FACTION_PAGE_SAVE_VEHICLE, (id: string, description: string) => {
    callRemoteEvent('FactionVehicleSave', id, description);
  });
  toggleView(true);
  webView.call(Constants.FACTION_PAGE_SHOW, ranksJson, membersJson, flagsJson,
    factionName, government, isLeader, factionFlagsJson,
    factionColor, factionChatColor, vehiclesJson);
});