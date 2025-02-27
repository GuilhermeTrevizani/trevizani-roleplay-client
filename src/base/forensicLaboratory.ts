import { configureEvent, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

const closeConfiscationPage = () => {
  setPages([], [Constants.FORENSIC_LABORATORY_PAGE]);
  toggleView(false);
};

mp.events.add('ForensicLaboratory:Show', (typesJson: string) => {
  setPages([Constants.FORENSIC_LABORATORY_PAGE], []);
  configureEvent(Constants.FORENSIC_LABORATORY_PAGE_SHOW, () => {
    webView.call(Constants.FORENSIC_LABORATORY_PAGE_SHOW, typesJson);
  });
  configureEvent(Constants.FORENSIC_LABORATORY_PAGE_CLOSE, closeConfiscationPage);
  configureEvent(Constants.FORENSIC_LABORATORY_PAGE_SAVE, (identifier: string, itemsJson: string) => {
    callRemoteEvent('ForensicTestSave', identifier, itemsJson);
  });
  configureEvent(Constants.FORENSIC_LABORATORY_PAGE_SEARCH_CONFISCATION, (first: boolean, type: number, identifier: string) => {
    callRemoteEvent('ForensicSearchConfiscation', first, type, identifier);
  });
  toggleView(true);
  webView.call(Constants.FORENSIC_LABORATORY_PAGE_SHOW, typesJson);
});

mp.events.add('ForensicLaboratoryPage:CloseServer', closeConfiscationPage);

mp.events.add('ForensicLaboratoryPage:SearchConfiscationServer', (first: boolean, itemsJson: string) => {
  webView.call(Constants.FORENSIC_LABORATORY_PAGE_SEARCH_CONFISCATION, first, itemsJson);
});