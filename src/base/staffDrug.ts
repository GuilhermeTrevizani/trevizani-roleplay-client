import { configureEvent, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

const setDrugEffect = (shakeGameplayCamName: string, shakeGameplayCamIntensity: number, timecycModifier: string, animpostFXName: string) => {
  if (shakeGameplayCamName)
    mp.game.cam.shakeGameplayCam(shakeGameplayCamName, shakeGameplayCamIntensity); // https://github.com/DurtyFree/gta-v-data-dumps/blob/master/camShakeTypesCompact.json

  if (timecycModifier)
    mp.game.graphics.setTimecycleModifier(timecycModifier); // https://github.com/DurtyFree/gta-v-data-dumps/blob/master/timecycleModifiers.json

  if (animpostFXName)
    mp.game.graphics.animpostfxPlay(animpostFXName, 0, true); // https://github.com/DurtyFree/gta-v-data-dumps/blob/master/animPostFxNamesCompact.json
};
mp.events.add('SetDrugEffect', setDrugEffect);

const clearDrugEffect = () => {
  mp.game.cam.shakeGameplayCam("DRUNK_SHAKE", 0.0);
  mp.game.graphics.clearTimecycleModifier();
  mp.game.graphics.animpostfxStopAll();
};
mp.events.add('ClearDrugEffect', clearDrugEffect);

mp.events.add('StaffDrug:Show', (json: string) => {
  setPages([Constants.STAFF_DRUG_PAGE], []);
  configureEvent(Constants.STAFF_DRUG_PAGE_SHOW, () => {
    webView.call(Constants.STAFF_DRUG_PAGE_SHOW, json);
  });
  configureEvent(Constants.STAFF_DRUG_PAGE_CLOSE, () => {
    setPages([], [Constants.STAFF_DRUG_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.STAFF_DRUG_PAGE_SAVE, (json: string) => {
    callRemoteEvent('StaffDrugSave', json);
  });
  configureEvent(Constants.STAFF_DRUG_PAGE_PREVIEW, setDrugEffect);
  configureEvent(Constants.STAFF_DRUG_PAGE_STOP_PREVIEW, clearDrugEffect);
  toggleView(true);
  webView.call(Constants.STAFF_DRUG_PAGE_SHOW, json);
});