import { callRemoteEvent } from './cursor';

const spots: { blip: BlipMp, marker: MarkerMp, id: string }[] = [];

mp.events.add('AddSpot', (id: string, position: Vector3,
  blipSprite: number, blipColor: number, blipScale: number, blipName: string,
  markerType: number, markerScale: number, markerColor: RGBA
) => {
  const blip = mp.blips.new(blipSprite, position, {
    color: blipColor,
    dimension: mp.players.local.dimension,
    shortRange: false,
    scale: blipScale,
    name: blipName,
  });

  const marker = mp.markers.new(markerType, position, markerScale, {
    color: markerColor,
    visible: !mp.storage.data.f7,
    dimension: mp.players.local.dimension,
  });

  spots.push({ blip, marker, id });
});

mp.events.add('RemoveSpot', (id: string) => {
  const spot = spots.find(x => x.id == id);
  if (!spot)
    return;

  spot?.blip?.destroy();
  spot?.marker?.destroy();
  spots.splice(spots.indexOf(spot), 1);
});

mp.events.add('ToggleMarkers', (remoteIdsJson: string, state: boolean) => {
  const remoteIds = JSON.parse(remoteIdsJson);
  remoteIds.forEach((remoteId: number) => {
    const marker = mp.markers.atRemoteId(remoteId);
    if (!marker)
      return;

    marker.visible = state;
  });
});

export const toggleMarkers = (state: boolean) => {
  callRemoteEvent('ToggleMarkers', state);
  spots.forEach(spot => spot.marker.visible = state);
};