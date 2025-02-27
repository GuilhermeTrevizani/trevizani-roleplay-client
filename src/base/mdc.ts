import { Constants } from './constants';
import { configureEvent, setPages, webView, toggleView } from './webView';
import { chatNotifiy } from './chat';
import { callRemoteEvent } from './cursor';

mp.events.add('Server:AbrirMDC', (factionType: number, factionName: string, callsJson: string, unitsJson: string,
  apbJson: string, boloJson: string, pendingReportsJson: string, crimesJson: string, weaponLicenseTypesJson: string) => {
  setPages([Constants.MDC_PAGE], []);
  configureEvent(Constants.MDC_PAGE_SHOW, () => {
    webView.call(Constants.MDC_PAGE_SHOW, factionType, factionName, callsJson, unitsJson,
      apbJson, boloJson, pendingReportsJson, crimesJson, weaponLicenseTypesJson);
  });
  configureEvent(Constants.MDC_PAGE_CLOSE, () => {
    setPages([], [Constants.MDC_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.MDC_PAGE_SEARCH_PERSON, (search: string) => {
    callRemoteEvent('MDCSearchPerson', search);
  });
  configureEvent(Constants.MDC_PAGE_SEARCH_VEHICLE, (search: string) => {
    callRemoteEvent('MDCSearchVehicle', search);
  });
  configureEvent(Constants.MDC_PAGE_SEARCH_PROPERTY, (search: string) => {
    callRemoteEvent('MDCSearchProperty', search);
  });
  configureEvent(Constants.MDC_PAGE_TRACK_VEHICLE, (id: string) => {
    callRemoteEvent('MDCRastrearVeiculo', id);
  });
  configureEvent(Constants.MDC_PAGE_ADD_APB_BOLO, (type: number, id: string, reason: string, search: string) => {
    callRemoteEvent('MDCAdicionarBOLO', type, id, reason, search);
  });
  configureEvent(Constants.MDC_PAGE_REMOVE_APB_BOLO, (id: string, search: string) => {
    callRemoteEvent('MDCRemoverBOLO', id, search);
  });
  configureEvent(Constants.MDC_PAGE_TRACK_EMERGENCY_CALL, (id: string) => {
    callRemoteEvent('MDCTrackEmergencyCall', id);
  });
  configureEvent(Constants.MDC_PAGE_FINE, (id: string, name: string, crimesJson: string) => {
    callRemoteEvent('MDCFinePerson', id, name, crimesJson);
  });
  configureEvent(Constants.MDC_PAGE_REVOKE_DRIVER_LICENSE, (id: string) => {
    callRemoteEvent('MDCRevogarLicencaMotorista', id);
  });
  configureEvent(Constants.MDC_PAGE_ADD_FACTION_UNIT, (name: string, partners: string) => {
    callRemoteEvent('MDCAddUnit', name, partners);
  });
  configureEvent(Constants.MDC_PAGE_CLOSE_FACTION_UNIT, (id: string) => {
    callRemoteEvent('MDCCloseUnit', id);
  });
  configureEvent(Constants.MDC_PAGE_FILL_PENDING_REPORT, (type: number, id: string, description: string) => {
    let eventName = '';
    if (type === 1)
      eventName = 'MDCFillReportSeizedVehicle';
    else if (type === 2)
      eventName = 'MDCFillReportJail';
    else if (type === 3)
      eventName = 'MDCFillReportFine';
    else if (type === 4)
      eventName = 'MDCFillReportConfiscation';
    callRemoteEvent(eventName, id, description);
  });
  configureEvent(Constants.MDC_PAGE_UPDATE_CONFISCATIONS_WITHOUT_ATTRIBUITION, () => {
    callRemoteEvent('MDCGetConfiscationsWithoutAttribuition');
  });
  configureEvent(Constants.MDC_PAGE_SAVE_CONFISCATION, (id: string, identifier: string, characterName: string) => {
    callRemoteEvent('MDCSaveConfiscation', id, identifier, characterName);
  });
  configureEvent(Constants.MDC_PAGE_ARREST, (id: string, crimesJson: string) => {
    callRemoteEvent('MDCArrestPerson', id, crimesJson);
  });
  configureEvent(Constants.MDC_PAGE_UPDATE_FORENSIC_LABORATORY, () => {
    callRemoteEvent('MDCUpdateForensicLaboratory');
  });
  configureEvent(Constants.MDC_PAGE_GIVE_WEAPON_LICENSE, (id: string, type: number) => {
    callRemoteEvent('MDCGiveWeaponLicense', id, type);
  });
  configureEvent(Constants.MDC_PAGE_REMOVE_WEAPON_LICENSE, (id: string) => {
    callRemoteEvent('MDCRemoveWeaponLicense', id);
  });
  configureEvent(Constants.MDC_PAGE_TRACK_UNIT, (posX: number, posY: number) => {
    mp.game.ui.setNewWaypoint(posX, posY);
    chatNotifiy('Posição da unidade foi marcada no GPS', 'success');
  });
  toggleView(true);
});

mp.events.add('MDC:UpdateFactionUnits', (factionUnitsJson: string) => {
  webView.call(Constants.MDC_PAGE_UPDATE_FACTION_UNITS, factionUnitsJson);
});

mp.events.add('MDC:UpdatePendingReports', (pendingReportsJson: string) => {
  webView.call(Constants.MDC_PAGE_UPDATE_PENDING_REPORTS, pendingReportsJson);
});

mp.events.add('MDC:UpdateAPBS', (apbsJson: string) => {
  webView.call(Constants.MDC_PAGE_UPDATE_APBS, apbsJson);
});

mp.events.add('MDC:UpdateBOLOS', (bolosJson: string) => {
  webView.call(Constants.MDC_PAGE_UPDATE_BOLOS, bolosJson);
});

mp.events.add('MDC:UpdateSearchPerson', (personJson: string) => {
  webView.call(Constants.MDC_PAGE_SEARCH_PERSON, personJson);
});

mp.events.add('MDC:UpdateSearchVehicle', (vehicleJson: string) => {
  webView.call(Constants.MDC_PAGE_SEARCH_VEHICLE, vehicleJson);
});

mp.events.add('MDC:UpdateSearchProperty', (propertyJson: string) => {
  webView.call(Constants.MDC_PAGE_SEARCH_PROPERTY, propertyJson);
});

mp.events.add('MDC:UpdateConfiscationsWithoutAttribuition', (confiscationsJson: string) => {
  webView.call(Constants.MDC_PAGE_UPDATE_CONFISCATIONS_WITHOUT_ATTRIBUITION, confiscationsJson);
});

mp.events.add('MDC:UpdateForensicLaboratory', (json: string) => {
  webView.call(Constants.MDC_PAGE_UPDATE_FORENSIC_LABORATORY, json);
});