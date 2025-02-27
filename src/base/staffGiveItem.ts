import { configureEvent, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('Staff:GiveItem', (templatesJson: string) => {
  setPages([Constants.STAFF_GIVE_ITEM_PAGE], []);
  configureEvent(Constants.STAFF_GIVE_ITEM_PAGE_SHOW, () => {
    webView.call(Constants.STAFF_GIVE_ITEM_PAGE_SHOW, templatesJson);
  });
  configureEvent(Constants.STAFF_GIVE_ITEM_PAGE_CLOSE, () => {
    setPages([], [Constants.STAFF_GIVE_ITEM_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.STAFF_GIVE_ITEM_PAGE_SAVE, (itemTemplateId: string, quantity: number, targetId: number, reason: string) => {
    callRemoteEvent('StaffGiveItem', itemTemplateId, quantity, targetId, reason);
  });
  toggleView(true);
  webView.call(Constants.STAFF_GIVE_ITEM_PAGE_SHOW, templatesJson);
});