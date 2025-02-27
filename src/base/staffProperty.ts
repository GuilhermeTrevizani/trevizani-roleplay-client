import { configureEvent, getPlayerPosition, getPlayerRotation, setPages, toggleView, webView } from './webView';
import { callRemoteEvent, getAddress } from './cursor';
import { Constants } from './constants';

mp.events.add('StaffProperty:Show', (propertyJson: string, interiorsJson: string) => {
  setPages([Constants.STAFF_PROPERTY_PAGE], []);
  configureEvent(Constants.STAFF_PROPERTY_PAGE_SHOW, () => {
    webView.call(Constants.STAFF_PROPERTY_PAGE_SHOW, propertyJson, getPlayerPosition(), getPlayerRotation(), interiorsJson);
  });
  configureEvent(Constants.STAFF_PROPERTY_PAGE_CLOSE, () => {
    setPages([], [Constants.STAFF_PROPERTY_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.STAFF_PROPERTY_PAGE_SAVE, (id: string, interior: number, value: number, dimension: number,
    entrancePosX: number, entrancePosY: number, entrancePosZ: number, factionName: string, name: string,
    exitPosX: number, exitPosY: number, exitPosZ: number,
    entranceRotR: number, entranceRotP: number, entranceRotY: number,
    exitRotR: number, exitRotP: number, exitRotY: number,
    companyName: string, parentPropertyNumber?: number) => {
    const entrancePosition = new mp.Vector3(entrancePosX, entrancePosY, entrancePosZ);
    const [zoneName, streetName] = getAddress(entrancePosition);
    const address = `${streetName}, ${zoneName}`;
    const exitPosition = new mp.Vector3(exitPosX, exitPosY, exitPosZ);
    const entranceRotation = new mp.Vector3(entranceRotR, entranceRotP, entranceRotY);
    const exitRotation = new mp.Vector3(exitRotR, exitRotP, exitRotY);
    const json = JSON.stringify({
      id,
      interior,
      value,
      dimension,
      entrancePosition,
      address,
      factionName,
      name,
      exitPosition,
      entranceRotation,
      exitRotation,
      companyName,
      parentPropertyNumber,
    })
    callRemoteEvent('StaffPropertySave', json);
  });
  toggleView(true);
  webView.call(Constants.STAFF_PROPERTY_PAGE_SHOW, propertyJson, getPlayerPosition(), getPlayerRotation(), interiorsJson);
});

mp.events.add('CreateProperty', (interior: number, value: number, name: string, parentPropertyNumber?: number) => {
  const [zoneName, streetName] = getAddress(mp.players.local.position);
  const address = `${streetName}, ${zoneName}`;
  const json = JSON.stringify({
    id: null,
    interior,
    value,
    dimension: mp.players.local.dimension,
    entrancePosition: mp.players.local.position,
    address,
    factionName: null,
    name,
    exitPosition: new mp.Vector3(0,0,0),
    entranceRotation: new mp.Vector3(0,0,0),
    exitRotation: new mp.Vector3(0,0,0),
    companyName: null,
    parentPropertyNumber,
  })
  callRemoteEvent('StaffPropertySave', json);
});