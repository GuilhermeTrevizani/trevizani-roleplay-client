import { configureEvent, setPages, toggleView, webView } from './webView';
import { Constants } from './constants';
import { callRemoteEvent, distanceTo } from './cursor';

interface AudioSpot {
  id: string;
  position: Vector3;
  source: string;
  dimension: number;
  volume: number;
  vehicleId?: number;
  loop: boolean;
  range: number;
  playerId?: number;
};
export const audioSpots: AudioSpot[] = [];
const player = mp.players.local;

const getForwardVector = (rotation: Vector3) => {
  var roll = rotation.x * (Math.PI / 180.0);
  var pitch = rotation.y * (Math.PI / 180.0);
  var yaw = rotation.z * (Math.PI / 180.0);
  var qx = Math.sin(roll / 2) * Math.cos(pitch / 2) * Math.cos(yaw / 2) -
    Math.cos(roll / 2) * Math.sin(pitch / 2) * Math.sin(yaw / 2);
  var qy = Math.cos(roll / 2) * Math.sin(pitch / 2) * Math.cos(yaw / 2) +
    Math.sin(roll / 2) * Math.cos(pitch / 2) * Math.sin(yaw / 2);
  var qz = Math.cos(roll / 2) * Math.cos(pitch / 2) * Math.sin(yaw / 2) -
    Math.sin(roll / 2) * Math.sin(pitch / 2) * Math.cos(yaw / 2);
  var qw = Math.cos(roll / 2) * Math.cos(pitch / 2) * Math.cos(yaw / 2) +
    Math.sin(roll / 2) * Math.sin(pitch / 2) * Math.sin(yaw / 2);
  var quatRot = { x: qx, y: qy, z: qz, w: qw };
  var fVectorX = 2 * (quatRot.x * quatRot.y - quatRot.w * quatRot.z);
  var fVectorY = 1 - 2 * (quatRot.x * quatRot.x + quatRot.z * quatRot.z);
  var fVectorZ = 2 * (quatRot.y * quatRot.z + quatRot.w * quatRot.x);
  return new mp.Vector3(fVectorX, fVectorY, fVectorZ);
}

const isVehicleSoundMuffled = (vehicle: VehicleMp) => {
  return !(
    mp.game.vehicle.isThisModelABike(vehicle.model)
    || vehicle.getDoorAngleRatio(0) != 0
    || vehicle.getDoorAngleRatio(1) != 0
    || vehicle.getDoorAngleRatio(2) != 0
    || vehicle.getDoorAngleRatio(3) != 0
    || vehicle.getDoorAngleRatio(5) != 0
    || vehicle.getDoorAngleRatio(6) != 0
    || vehicle.getDoorAngleRatio(7) != 0
    || vehicle.getVariable(Constants.VEHICLE_META_DATA_HAS_WINDOW_OPENED) as boolean
  );
}

setInterval(() => {
  if (audioSpots.length === 0 || !player.getVariable(Constants.PLAYER_META_DATA_NAMETAG))
    return;

  webView.call(Constants.AUDIO_PAGE_SET_LISTENER_POSITION, player.position.x, player.position.y, player.position.z);
  const orientation = getForwardVector(mp.game.cam.getGameplayCamRot(2));
  webView.call(Constants.AUDIO_PAGE_SET_LISTENER_ORIENTATION, orientation.z, orientation.y, orientation.z);

  audioSpots.forEach(audioSpot => {
    if (audioSpot.vehicleId != undefined) {
      const vehicle = mp.vehicles.atRemoteId(audioSpot.vehicleId);
      if (!vehicle) {
        webView.call(Constants.AUDIO_PAGE_REMOVE_AUDIO, audioSpot.id);
        return;
      }

      audioSpot.position = player.vehicle === vehicle ? player.position : vehicle.position;
      webView.call(Constants.AUDIO_PAGE_SET_AUDIO_POSITION, audioSpot.id, audioSpot.position.x, audioSpot.position.y, audioSpot.position.z);
      webView.call(Constants.AUDIO_PAGE_SET_AUDIO_MUFFLED, audioSpot.id, audioSpot.loop || player.vehicle === vehicle ? false : isVehicleSoundMuffled(vehicle));
    }

    if (audioSpot.playerId != undefined) {
      const target = mp.players.atRemoteId(audioSpot.playerId);
      if (!target) {
        webView.call(Constants.AUDIO_PAGE_REMOVE_AUDIO, audioSpot.id);
        return;
      }

      audioSpot.position = target.position;
      webView.call(Constants.AUDIO_PAGE_SET_AUDIO_POSITION, audioSpot.id, audioSpot.position.x, audioSpot.position.y, audioSpot.position.z);
      webView.call(Constants.AUDIO_PAGE_SET_AUDIO_MUFFLED, audioSpot.id, false);
    }

    const distance = distanceTo(player.position, audioSpot.position);
    if (distance > audioSpot.range || player.dimension !== audioSpot.dimension) {
      webView.call(Constants.AUDIO_PAGE_REMOVE_AUDIO, audioSpot.id);
      return;
    }

    const volume = (audioSpot.range - distance) / audioSpot.range * audioSpot.volume;
    webView.call(Constants.AUDIO_PAGE_ADD_AUDIO, audioSpot.id, audioSpot.source,
      audioSpot.position.x, audioSpot.position.y, audioSpot.position.z,
      audioSpot.loop, audioSpot.range, volume);
  });
}, 150);

mp.events.add('Audio:Setup', (id: string, position: Vector3, source: string, dimension: number, volume: number, loop: boolean, range: number, vehicleId?: number, playerId?: number) => {
  const currentAudioSpot = audioSpots.find(x => x.id === id);
  if (currentAudioSpot) {
    if (currentAudioSpot.source === source) {
      currentAudioSpot.volume = volume;
      return;
    }

    removeAudio(id);
  }

  const audioSpot = {
    id,
    position,
    source,
    dimension,
    volume,
    vehicleId,
    loop,
    range,
    playerId,
  };

  audioSpots.push(audioSpot);
});

const removeAudio = (id: string) => {
  const index = audioSpots.findIndex(x => x.id === id);
  if (index === -1)
    return;

  audioSpots.splice(index, 1);
  webView.call(Constants.AUDIO_PAGE_REMOVE_AUDIO, id);
};

mp.events.add('Audio:Remove', removeAudio);

mp.events.add('Boombox', (itemId: string, url: string, volume: number, isPremium: boolean, radioStationsJson: string) => {
  setPages([Constants.BOOMBOX_PAGE], []);
  configureEvent(Constants.BOOMBOX_PAGE_SHOW, () => {
    webView.call(Constants.BOOMBOX_PAGE_SHOW, 'Boombox', url, volume, isPremium, radioStationsJson);
  });
  configureEvent(Constants.BOOMBOX_PAGE_CLOSE, closeBoomboxPage);
  configureEvent(Constants.BOOMBOX_PAGE_CONFIRM, (url: string, volume: number) => {
    callRemoteEvent('ConfirmBoombox', itemId, url, volume);
  });
  configureEvent(Constants.BOOMBOX_PAGE_TURN_OFF, () => {
    callRemoteEvent('TurnOffBoombox', itemId);
  });
  toggleView(true);
  webView.call(Constants.BOOMBOX_PAGE_SHOW, 'Boombox', url, volume, isPremium, radioStationsJson);
});

mp.events.add('XMR', (url: string, volume: number, isPremium: boolean, radioStationsJson: string) => {
  setPages([Constants.BOOMBOX_PAGE], []);
  configureEvent(Constants.BOOMBOX_PAGE_SHOW, () => {
    webView.call(Constants.BOOMBOX_PAGE_SHOW, 'XMR', url, volume, isPremium, radioStationsJson);
  });
  configureEvent(Constants.BOOMBOX_PAGE_CLOSE, closeBoomboxPage);
  configureEvent(Constants.BOOMBOX_PAGE_CONFIRM, (url: string, volume: number) => {
    callRemoteEvent('ConfirmXMR', url, volume);
  });
  configureEvent(Constants.BOOMBOX_PAGE_TURN_OFF, () => {
    callRemoteEvent('TurnOffXMR');
  });
  toggleView(true);
  webView.call(Constants.BOOMBOX_PAGE_SHOW, 'XMR', url, volume, isPremium, radioStationsJson);
});

mp.events.add('PropertyBoombox', (propertyId: string, url: string, volume: number, isPremium: boolean, radioStationsJson: string) => {
  setPages([Constants.BOOMBOX_PAGE], []);
  configureEvent(Constants.BOOMBOX_PAGE_SHOW, () => {
    webView.call(Constants.BOOMBOX_PAGE_SHOW, 'Boombox da Propriedade', url, volume, isPremium, radioStationsJson);
  });
  configureEvent(Constants.BOOMBOX_PAGE_CLOSE, closeBoomboxPage);
  configureEvent(Constants.BOOMBOX_PAGE_CONFIRM, (url: string, volume: number) => {
    callRemoteEvent('ConfirmPropertyBoombox', propertyId, url, volume);
  });
  configureEvent(Constants.BOOMBOX_PAGE_TURN_OFF, () => {
    callRemoteEvent('TurnOffPropertyBoombox', propertyId);
  });
  toggleView(true);
  webView.call(Constants.BOOMBOX_PAGE_SHOW, 'Boombox da Propriedade', url, volume, isPremium, radioStationsJson);
});

mp.events.add('BoomboxPage:CloseServer', closeBoomboxPage);
function closeBoomboxPage() {
  toggleView(false);
  setPages([], [Constants.BOOMBOX_PAGE]);
}

mp.events.add('Audio:Debug', () => {
  mp.console.logInfo(`Audios: ${audioSpots.length}`);
  audioSpots.forEach(x => {
    mp.console.logInfo(`Audio ${x.id} ${x.source}`);
  });
});