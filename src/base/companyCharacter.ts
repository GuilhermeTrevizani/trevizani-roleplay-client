import { toggleView, webView, configureEvent, setPages } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('CompanyCharacters', (charactersJson: string, flagsJSON: string, companyId: string, companyName: string, flagsOptionsJson: string) => {
  setPages([Constants.COMPANY_CHARACTERS_PAGE], []);
  webView.call(Constants.COMPANY_CHARACTERS_PAGE_SHOW, companyName, charactersJson, flagsJSON, flagsOptionsJson);
  configureEvent(Constants.COMPANY_CHARACTERS_PAGE_CLOSE, () => {
    setPages([], [Constants.COMPANY_CHARACTERS_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.COMPANY_CHARACTERS_PAGE_INVITE, (id: number) => {
    callRemoteEvent('CompanyCharacterInvite', companyId, id);
  });
  configureEvent(Constants.COMPANY_CHARACTERS_PAGE_SAVE, (id: string, flagsJson: string) => {
    callRemoteEvent('CompanyCharacterSave', companyId, id, flagsJson);
  });
  configureEvent(Constants.COMPANY_CHARACTERS_PAGE_REMOVE, (id: string) => {
    callRemoteEvent('CompanyCharacterRemove', companyId, id);
  });
  toggleView(true);
});