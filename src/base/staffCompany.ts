import { toggleView, webView, configureEvent, getPlayerPosition, setPages } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('StaffCompany:Show', (companiesJson: string, typesJson: string) => {
  setPages([Constants.STAFF_COMPANY_PAGE], []);
  configureEvent(Constants.STAFF_COMPANY_PAGE_SHOW, () => {
    webView.call(Constants.STAFF_COMPANY_PAGE_SHOW, companiesJson, getPlayerPosition());
    webView.call(Constants.STAFF_COMPANY_PAGE_LOAD_TYPES, typesJson);
  });
  configureEvent(Constants.STAFF_COMPANY_PAGE_CLOSE, () => {
    setPages([], [Constants.STAFF_COMPANY_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.STAFF_COMPANY_PAGE_GO_TO, (id: string) => {
    callRemoteEvent('StaffCompanyGoto', id);
  });
  configureEvent(Constants.STAFF_COMPANY_PAGE_SAVE, (id: string, name: string, posX: number, posY: number, posZ: number,
    weekRentValue: number, type: number, blipType: number, blipColor: number, entranceBenefit: boolean) => {
    callRemoteEvent('StaffCompanySave', id, name, new mp.Vector3(posX, posY, posZ), weekRentValue, type, blipType, blipColor,
      entranceBenefit);
  });
  configureEvent(Constants.STAFF_COMPANY_PAGE_REMOVE_OWNER, (id: string) => {
    callRemoteEvent('StaffCompanyRemoveOwner', id);
  });
  configureEvent(Constants.STAFF_COMPANY_PAGE_SHOW_ITEMS, (id: string) => {
    callRemoteEvent('StaffCompanyShowItems', id);
  });
  configureEvent(Constants.STAFF_COMPANY_PAGE_REMOVE, (id: string) => {
    callRemoteEvent('StaffCompanyRemove', id);
  });
  toggleView(true);
  webView.call(Constants.STAFF_COMPANY_PAGE_SHOW, companiesJson, getPlayerPosition());
  webView.call(Constants.STAFF_COMPANY_PAGE_LOAD_TYPES, typesJson);
});

mp.events.add('StaffCompany:Update', (json: string) => {
  webView.call(Constants.STAFF_COMPANY_PAGE_SHOW, json, getPlayerPosition());
});