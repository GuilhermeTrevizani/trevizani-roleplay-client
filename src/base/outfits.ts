import { configureEvent, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('Outfits:Show', (json: string, outfit: number, maxOutfit: number) => {
  setPages([Constants.OUTFITS_PAGE], []);
  configureEvent(Constants.OUTFITS_PAGE_SHOW, () => {
    webView.call(Constants.OUTFITS_PAGE_SHOW, json, outfit, maxOutfit);
  });
  configureEvent(Constants.OUTFITS_PAGE_CLOSE, () => {
    setPages([], [Constants.OUTFITS_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.OUTFITS_PAGE_SET_OUTFIT, (outfit: number) => {
    callRemoteEvent('SetOutfit', outfit);
  });
  configureEvent(Constants.OUTFITS_PAGE_TOGGLE_OUTFIT_PART, (outfitsJson: string) => {
    callRemoteEvent('ToggleOutfitPart', outfitsJson);
  });
  toggleView(true);
  webView.call(Constants.OUTFITS_PAGE_SHOW, json, outfit, maxOutfit);
});