import { Constants } from './constants';
import { configureEvent, setPages, webView, toggleView } from './webView';

mp.events.add('Announcements:Show', (announcementsJson: string) => {
  setPages([Constants.ANNOUNCEMENTS_PAGE], []);
  configureEvent(Constants.ANNOUNCEMENTS_PAGE_SHOW, () => {
    webView.call(Constants.ANNOUNCEMENTS_PAGE_SHOW, announcementsJson);
  });
  configureEvent(Constants.ANNOUNCEMENTS_PAGE_CLOSE, () => {
    setPages([], [Constants.ANNOUNCEMENTS_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.ANNOUNCEMENTS_PAGE_SET_POSITION, (x: number, y: number) => {
    mp.game.ui.setNewWaypoint(x, y);
  });
  toggleView(true);
  webView.call(Constants.ANNOUNCEMENTS_PAGE_SHOW, announcementsJson);
});