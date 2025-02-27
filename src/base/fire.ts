import { configureEvent, getPlayerPosition, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent } from './cursor';

mp.events.add('Fire:Show', (json: string) => {
  setPages([Constants.FIRE_PAGE], []);
  configureEvent(Constants.FIRE_PAGE_SHOW, () => {
    webView.call(Constants.FIRE_PAGE_SHOW, json, getPlayerPosition());
  });
  configureEvent(Constants.FIRE_PAGE_CLOSE, () => {
    setPages([], [Constants.FIRE_PAGE]);
    toggleView(false);
  });
  configureEvent(Constants.FIRE_PAGE_SAVE, (id: string, description: string, posX: number, posY: number, posZ: number, dimension: number,
    fireSpanLife: number, maxFireSpan: number, secondsNewFireSpan: number, positionNewFireSpan: number, fireSpanDamage: number) => {
    callRemoteEvent('FireSave', id, description, new mp.Vector3(posX, posY, posZ), dimension,
      fireSpanLife, maxFireSpan, secondsNewFireSpan, positionNewFireSpan, fireSpanDamage);
  });
  configureEvent(Constants.FIRE_PAGE_REMOVE, (id: string) => {
    callRemoteEvent('FireRemove', id);
  });
  configureEvent(Constants.FIRE_PAGE_START, (id: string) => {
    callRemoteEvent('FireStart', id);
  });
  configureEvent(Constants.FIRE_PAGE_STOP, (id: string) => {
    callRemoteEvent('FireStop', id);
  });
  toggleView(true);
  webView.call(Constants.FIRE_PAGE_SHOW, json, getPlayerPosition());
});

const particles: { remoteId: string, localId: number }[] = [];

mp.events.add('Particle:Setup', (remoteId: string, asset: string, name: string, position: Vector3) => {
  const particle = particles.find(x => x.remoteId == remoteId);
  if (particle)
    return;

  requestPtfxAsset(asset).then(res => {
    if (!res)
      return;

    mp.game.graphics.useParticleFxAsset(asset);

    const localId = mp.game.graphics.startParticleFxLoopedAtCoord(
      name,
      position.x,
      position.y,
      position.z,
      0.0,
      0.0,
      0.0,
      1.0,
      false,
      false,
      false,
      false
    );

    particles.push({ localId, remoteId });
  });
});

mp.events.add('Particle:Remove', (remoteId: string) => {
  const particle = particles.find(x => x.remoteId == remoteId);
  if (!particle)
    return;

  mp.game.graphics.stopParticleFxLooped(particle.localId, false);
  particles.splice(particles.indexOf(particle), 1);
});

function requestPtfxAsset(name: string, tries = 0): Promise<boolean> {
  return new Promise(resolve => {
    if (tries == 0) {
      if (!mp.game.streaming.hasNamedPtfxAssetLoaded(name))
        mp.game.streaming.requestNamedPtfxAsset(name);
    }

    if (tries == 40) { // 40 tries * 25ms = 1 second
      return resolve(false);
    }

    setTimeout(() => {
      if (!mp.game.streaming.hasNamedPtfxAssetLoaded(name))
        return resolve(requestPtfxAsset(name, ++tries));

      resolve(true);
    }, 25);
  });
}