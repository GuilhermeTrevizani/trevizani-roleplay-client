import { configureEvent, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('StaffItemTemplate:Show', (categoriesJson: string, itemsTemplatesJson: string) => {
  setPages([Constants.STAFF_ITEM_TEMPLATE_PAGE], []);
  configureEvent(Constants.STAFF_ITEM_TEMPLATE_PAGE_SHOW, () => {
    webView.call(Constants.STAFF_ITEM_TEMPLATE_PAGE_SHOW, categoriesJson, itemsTemplatesJson);
  });
  configureEvent(Constants.STAFF_ITEM_TEMPLATE_PAGE_CLOSE, () => {
    setPages([], [Constants.STAFF_ITEM_TEMPLATE_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.STAFF_ITEM_TEMPLATE_PAGE_SAVE, (id: string, category: number, type: string, name: string,
    weight: number, image: string, objectModel: string) => {
    callRemoteEvent('StaffItemTemplateSave', id, category, type, name, weight, image, objectModel);
  });
  toggleView(true);
  webView.call(Constants.STAFF_ITEM_TEMPLATE_PAGE_SHOW, categoriesJson, itemsTemplatesJson);
});

mp.events.add('StaffItemTemplate:Update', (categoriesJson: string, itemsTemplatesjson: string) => {
  webView.call(Constants.STAFF_ITEM_TEMPLATE_PAGE_SHOW, categoriesJson, itemsTemplatesjson);
});