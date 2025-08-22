import { distanceTo } from '@/base/cursor';
import { Constants } from '@/base/constants';

const player = mp.players.local;

const Rad2Deg = 180 / Math.PI;

function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

const radiansToDirection = (vet: Vector3) => {
  const adjustedRotation = new mp.Vector3((Math.PI / 180) * vet.x, (Math.PI / 180) * vet.y, (Math.PI / 180) * vet.z);
  return new mp.Vector3(-Math.sin(adjustedRotation.z) * Math.abs(Math.cos(adjustedRotation.x)), Math.cos(adjustedRotation.z) * Math.abs(Math.cos(adjustedRotation.x)), Math.sin(adjustedRotation.x));
};

const getNormalizedVector = function (vector: Vector3) {
  const mag = Math.sqrt(
    vector.x * vector.x + vector.y * vector.y + vector.z * vector.z
  );
  vector.x = vector.x / mag;
  vector.y = vector.y / mag;
  vector.z = vector.z / mag;
  return vector;
};

export default class FlyController {
  static readonly instance = new FlyController();
  static readonly blockedKeys = [
    30,
    31,
    21,
    36,
    22,
    44,
    38,
    71,
    72,
    59,
    60,
    42,
    43,
  ];

  private constructor() {
    mp.events.add('NoClip:Start', (freecam: boolean) => {
      this._freecam = freecam;
      if (this._state) this.stop();
      else this.start();
    });
  }

  private _state = false;
  private _speed = 1;
  private _cam?: CameraMp;
  private _freecam = false;

  start() {
    if (this._state) return;
    if (!this._freecam && player.vehicle)
      player.taskLeaveVehicle(player.vehicle.handle, 16);
    this._state = true;
    if (this._freecam) {
      this._cam = mp.cameras.new('DEFAULT_SCRIPTED_CAMERA',
        new mp.Vector3(player.position.x, player.position.y, player.position.z + 1),
        new mp.Vector3(player.getRotation(2).x * Rad2Deg, player.getRotation(2).y * Rad2Deg, player.getRotation(2).z * Rad2Deg),
        50
      );
      this._cam!.setActive(true);
      mp.game.cam.renderScriptCams(true, false, 0, true, false, 0);
    }

    mp.events.add('render', this._freecam ? this.handleFreecam : this.handle);
  }

  stop() {
    if (!this._state) return;
    this._state = false;

    mp.events.remove('render', this._freecam ? this.handleFreecam : this.handle);

    if (this._cam) {
      mp.game.cam.renderScriptCams(false, false, 0, true, false, 0);
      this._cam!.setActive(false);
      this._cam!.destroy(false);
      this._cam = undefined;
    } else {
      const coord = mp.players.local.position;
      mp.players.local.setCoordsNoOffset(
        coord.x,
        coord.y,
        coord.z,
        false,
        false,
        false,
      );
    }
  }

  getNewPos(pos: IVector3) {
    mp.game.ui.weaponWheelIgnoreSelection();
    mp.game.controls.disableControlAction(0, 37, true);

    for (let blockedKey of FlyController.blockedKeys) {
      mp.game.controls.disableControlAction(0, blockedKey, true);
    }

    let vertSpeed = 0;
    let speed = this._speed;

    if (mp.game.controls.isDisabledControlPressed(0, 241)) { // INPUT_CURSOR_SCROLL_UP
      this._speed = clamp(this._speed + 0.01, 0.01, 10);
    }

    if (mp.game.controls.isDisabledControlPressed(0, 242)) { // INPUT_CURSOR_SCROLL_DOWN
      this._speed = clamp(this._speed - 0.01, 0.01, 10);
    }

    // pos movement
    const posMovementX = mp.game.controls.getDisabledControlNormal(0, 218);
    const posMovementY = mp.game.controls.getDisabledControlNormal(0, 219);

    // 38 - E
    if (mp.game.controls.isDisabledControlPressed(0, 38)) {
      vertSpeed += this._speed;
    }

    // 44 - Q
    if (mp.game.controls.isDisabledControlPressed(0, 44)) {
      vertSpeed -= this._speed;
    }

    if (mp.keys.isDown(Constants.SHIFT_KEY)) {
      speed *= 2;
      vertSpeed *= 2;
    }

    if (mp.keys.isDown(Constants.CTRL_KEY)) {
      speed *= 0.5;
      vertSpeed *= 0.5;
    }

    const upVector = new mp.Vector3(0, 0, 1);
    const rot = mp.game.cam.getGameplayRot(2);
    const rr = radiansToDirection(rot);
    const preRightVector = getNormalizedVector(rr).cross(upVector);

    const movementVector = {
      x: rr.x * posMovementY * speed,
      y: rr.y * posMovementY * speed,
      z: rr.z * posMovementY * speed,
    };

    const rightVector = {
      x: preRightVector.x * posMovementX * speed,
      y: preRightVector.y * posMovementX * speed,
      z: preRightVector.z * posMovementX * speed,
    };

    return [rot, new mp.Vector3(
      pos.x - movementVector.x + rightVector.x,
      pos.y - movementVector.y + rightVector.y,
      pos.z - movementVector.z + vertSpeed,
    )];
  }

  handle = () => {
    if (!this._state) return;

    mp.game.graphics.drawText(`No Clip: ${this._speed.toFixed(2)}`,
      [0.97, 0.98], {
      font: 0,
      scale: [0.3, 0.3],
      centre: true,
      color: [255, 255, 255, 255],
      outline: true,
    });

    if (player.getVariable(Constants.PLAYER_META_DATA_CHATTING))
      return;

    const entity = mp.players.local;
    const [rot, newPos] = this.getNewPos(entity.position);

    entity.setCoordsNoOffset(newPos.x, newPos.y, newPos.z, true, true, true);
    if (mp.game.cam.getFollowPedZoomLevel() !== 4) entity.setHeading(rot.z);
  }

  handleFreecam = () => {
    if (!this._state || !this._cam) return;

    mp.game.graphics.drawText(`Modo Foto: ${this._speed.toFixed(2)}`,
      [0.96, 0.98], {
      font: 0,
      scale: [0.3, 0.3],
      centre: true,
      color: [255, 255, 255, 255],
      outline: true,
    });

    if (player.getVariable(Constants.PLAYER_META_DATA_CHATTING))
      return;

    const [rot, newPos] = this.getNewPos(this._cam!.getCoord());
    if (distanceTo(newPos, mp.players.local.position) <= 7.5)
      this._cam!.setCoord(newPos.x, newPos.y, newPos.z);

    this._cam!.setRot(rot.x, rot.y, rot.z, 2);
  }
}