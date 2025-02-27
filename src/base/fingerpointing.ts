import { requestAnimDict } from './animation';

export default class Fingerpointing {
  active: boolean;
  cleanStart: boolean;
  localPlayer: PlayerMp;

  constructor() {
    this.active = false;
    this.cleanStart = false;
    this.localPlayer = mp.players.local;
  }

  start() {
    if (!this.active) {
      this.active = true;

      requestAnimDict("anim@mp_point").then(() => {
        mp.game.invoke("0x0725a4ccfded9a70", this.localPlayer.handle, 0, 1, 1, 1);
        this.localPlayer.setConfigFlag(36, true);
        this.localPlayer.taskMoveNetwork("task_mp_pointing", 0.5, false, "anim@mp_point", 24);
        mp.game.streaming.removeAnimDict("anim@mp_point");
        this.cleanStart = true;
        mp.events.add('render', this.process.bind(this));
      }).catch(() => { mp.console.logError('Promise returned reject Pointing') });

    }
  }

  stop() {
    if (this.active) {
      mp.events.add('remove', this.process.bind(this));

      this.active = false;

      if (this.cleanStart) {
        this.cleanStart = false;
        mp.game.task.requestMoveNetworkStateTransition(this.localPlayer.handle, "Stop");

        if (!this.localPlayer.isInjured())
          this.localPlayer.clearTasks();

        if (!this.localPlayer.isInAnyVehicle(true))
          mp.game.invoke("0x0725a4ccfded9a70", this.localPlayer.handle, 0, 1, 1, 1);

        this.localPlayer.setConfigFlag(36, false);
        this.localPlayer.clearTasks();
      }
    }
  }

  getRelativePitch() {
    let camRot = mp.game.cam.getGameplayCamRot(2);
    return camRot.x - this.localPlayer.getPitch();
  }

  process() {
    if (this.active) {
      mp.game.ui.weaponWheelIgnoreSelection();
      mp.game.controls.disableControlAction(0, 37, true);

      mp.game.task.isMoveNetworkActive(this.localPlayer.handle);

      let camPitch = this.getRelativePitch();

      if (camPitch < -70.0) {
        camPitch = -70.0;
      }
      else if (camPitch > 42.0) {
        camPitch = 42.0;
      }
      camPitch = (camPitch + 70.0) / 112.0;

      let camHeading = mp.game.cam.getGameplayCamRelativeHeading();

      const cosCamHeading = Math.cos(camHeading);
      const sinCamHeading = Math.sin(camHeading);

      if (camHeading < -180.0) {
        camHeading = -180.0;
      }
      else if (camHeading > 180.0) {
        camHeading = 180.0;
      }
      camHeading = (camHeading + 180.0) / 360.0;

      const coords = this.localPlayer.getOffsetFromInWorldCoords((cosCamHeading * -0.2) - (sinCamHeading *
        (0.4 * camHeading + 0.3)), (sinCamHeading * -0.2) + (cosCamHeading * (0.4 * camHeading + 0.3)), 0.6);

      const ray = mp.game.shapetest.startShapeTestCapsule(coords.x, coords.y, coords.z - 0.2, coords.x, coords.y, coords.z + 0.2, 1.0, 95, this.localPlayer.handle, 7);
      const response = mp.game.shapetest.getShapeTestResult(ray);

      mp.game.task.setMoveNetworkSignalFloat(this.localPlayer.handle, "Pitch", camPitch);
      mp.game.task.setMoveNetworkSignalFloat(this.localPlayer.handle, "Heading", camHeading * -1.0 + 1.0);
      mp.game.task.setMoveNetworkSignalBool(this.localPlayer.handle, "isBlocked", response.hit);
      mp.game.task.setMoveNetworkSignalBool(this.localPlayer.handle, "isFirstPerson", mp.game.invoke('0xee778f8c7e1142e2', mp.game.invoke('0x19cafa3c87f7c2ff')) == 4);
    }
  }
}