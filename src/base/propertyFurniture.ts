import { Constants } from './constants';
import { configureEvent, setPages, webView, toggleView, currentPages } from './webView';
import { chatNotifiy } from './chat';
import { callRemoteEvent } from './cursor';

const player = mp.players.local;
let previewFurnitureObject: ObjectMp | undefined;
let currentPropertyId = '';

const closePropertyFurnituresPage = () => {
  setPages([], [Constants.PROPERTY_FURNITURES_PAGE]);
  toggleView(false);
  destroyPreviewObject();
  callRemoteEvent('ClosePropertyFurnitures');
}

const destroyPreviewObject = () => {
  previewFurnitureObject?.destroy();
  previewFurnitureObject = undefined;
}

export const setCanClose = (state: boolean) => {
  webView.call(Constants.PROPERTY_FURNITURES_PAGE_SET_CAN_CLOSE, state);
}

let chunks: { chunk: string, index: number }[] = [];
const chunkToBrowser = (maxFurnitures: number, categoriesJson: string) => {
  chunks.forEach(chunk => {
    webView.call(Constants.PROPERTY_FURNITURES_PAGE_SHOW, maxFurnitures, categoriesJson, chunk.chunk, chunk.index, chunks.length);
  });
  chunks = [];
}

mp.events.add('PropertyFurnitures', (propertyId: string, maxFurnitures: number, categoriesJson, chunk: string, index: number, length: number) => {
  chunks.push({ chunk, index });
  if (chunks.length != length)
    return;

  setCanClose(true);
  currentPropertyId = propertyId;

  if (currentPages.includes(Constants.PROPERTY_FURNITURES_PAGE))
    chunkToBrowser(maxFurnitures, categoriesJson);

  setPages([Constants.PROPERTY_FURNITURES_PAGE], []);
  configureEvent(Constants.PROPERTY_FURNITURES_PAGE_SHOW, () => {
    chunkToBrowser(maxFurnitures, categoriesJson);
  });
  configureEvent(Constants.PROPERTY_FURNITURES_PAGE_CLOSE, closePropertyFurnituresPage);
  configureEvent(Constants.PROPERTY_FURNITURES_PAGE_EDIT, (propertyFurnitureId: string) => {
    destroyPreviewObject();
    setCanClose(false);
    toggleView(false);
    callRemoteEvent('EditPropertyFurniture', propertyId, propertyFurnitureId);
  });
  configureEvent(Constants.PROPERTY_FURNITURES_PAGE_SELL, (propertyFurnitureId: string) => {
    callRemoteEvent('SellPropertyFurniture', propertyId, propertyFurnitureId);
  });
  configureEvent(Constants.PROPERTY_FURNITURES_PAGE_BUY, (furnitureId: string) => {
    destroyPreviewObject();
    setCanClose(false);
    toggleView(false);
    callRemoteEvent('SelectBuyPropertyFurniture', propertyId, furnitureId);
  });
  configureEvent(Constants.PROPERTY_FURNITURES_PAGE_PREVIEW, preview);
  configureEvent(Constants.PROPERTY_FURNITURES_PAGE_LIST_FURNITURES, (category: string, subcategory: string) => {
    callRemoteEvent('ListFurnitures', category, subcategory);
  });
  configureEvent(Constants.PROPERTY_FURNITURES_PAGE_COPY, (propertyFurnitureId: string) => {
    callRemoteEvent('CopyPropertyFurniture', propertyId, propertyFurnitureId);
  });
  toggleView(true);
});

const preview = (model: string) => {
  setCanClose(false);
  previewFurnitureObject?.destroy();
  try {
    previewFurnitureObject = mp.objects.new(model, player.position, { rotation: player.getRotation(2), dimension: player.dimension });
    mp.game.waitForAsync(() => previewFurnitureObject?.handle !== 0 && previewFurnitureObject?.doesExist(), 10_000)
      .then((res: any) => {
        if (!res)
          return;

        previewFurnitureObject!.placeOnGroundProperly();
        previewFurnitureObject!.freezePosition(true);
        previewFurnitureObject!.setCollision(false, false);
        webView.call(Constants.WEB_VIEW_END_LOADING);
      });
  } catch (ex: any) {
    chatNotifiy(`Objeto (${model}) não foi configurado corretamente. Por favor, reporte o bug.`, 'error');
    mp.console.logError(ex);
    setCanClose(true);
    webView.call(Constants.WEB_VIEW_END_LOADING);
  }
}

mp.events.add('PropertyFurnituresPage:ListFurnituresServer', (furnituresJson: string) => {
  webView.call(Constants.PROPERTY_FURNITURES_PAGE_LIST_FURNITURES, furnituresJson);
});