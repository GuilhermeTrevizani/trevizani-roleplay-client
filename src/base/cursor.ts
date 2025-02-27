let cursorCount = 0;

export function showCursor(value: boolean, freezeControls: boolean) {
  if (value) {
    cursorCount += 1;
    mp.gui.cursor.show(freezeControls, true);
    return;
  }

  for (let i = 0; i < cursorCount; i++) {
    try {
      mp.gui.cursor.show(false, false);
    } catch (e) { }
  }

  cursorCount = 0;
}

export function getAddress(pos: Vector3) {
  const response = mp.game.pathfind.getStreetNameAtCoord(pos.x, pos.y, pos.z);
  const zoneName = mp.game.ui.getLabelText(mp.game.zone.getNameOfZone(pos.x, pos.y, pos.z));
  let streetName = mp.game.ui.getStreetNameFromHashKey(response.streetName);

  const streetName2 = mp.game.ui.getStreetNameFromHashKey(response.crossingRoad);
  if (streetName2 != '') {
    streetName += ` / ${streetName2}`;
  }

  return [zoneName, streetName];
}

export function getRightCoordsZ(x: number, y: number, z: number, tries = 0): Promise<Vector3> {
  return new Promise(resolve => {
    if (tries == 0)
      mp.game.streaming.setFocusPosAndVel(x, y, z, 0, 0, 0);

    if (tries == 40) { // 40 tries * 25ms = 1 second
      mp.game.streaming.clearFocus();
      return resolve(new mp.Vector3(x, y, 0));
    }

    setTimeout(() => {
      if (!mp.players.local.hasCollisionLoadedAround())
        return resolve(getRightCoordsZ(x, y, z, ++tries));

      const newZ = mp.game.gameplay.getGroundZFor3dCoord(x, y, z, false, false);
      if (!newZ)
        return resolve(getRightCoordsZ(x, y, z + 100, ++tries));

      mp.game.streaming.clearFocus();
      resolve(new mp.Vector3(x, y, newZ));
    }, 25);
  });
}

export function callRemoteEvent(eventName: string, ...args: any[]) {
  mp.events.callRemote('OnPlayerEvent', `${eventName} ${args.join(', ')}`);
  mp.events.callRemote(eventName, ...args);
}

export function distanceTo(from: Vector3, to: Vector3) {
  const difference = new mp.Vector3(from.x - to.x, from.y - to.y, from.z - to.z);
  const distance = Math.sqrt(Math.pow(difference.x, 2) + Math.pow(difference.y, 2) + Math.pow(difference.z, 2));
  return Math.abs(distance);
}