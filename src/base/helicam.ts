import { Constants } from './constants';
import { callRemoteEvent, distanceTo, getAddress } from './cursor';

const fov_max = 80.0;
const fov_min = 10.0; // max zoom level (smaller fov is more zoom)
const zoomspeed = 2.0; // camera zoom speed
const speed_lr = 3.0; // speed by which the camera pans left-right
const speed_ud = 3.0; // speed by which the camera pans up-down
const toggle_vision = 25; // control id to toggle vision mode. Default: INPUT_AIM (Right mouse btn)
const toggle_light = 24; // left mouse btn

let scaleform;
let helicam = false;
let fov = (fov_max + fov_min) * 0.5;
let vision_state = 0; // 0 is normal, 1 is nightmode, 2 is thermal vision

let lightStatus = false;
const lights = [];

let cam: CameraMp;
const player = mp.players.local;

let vehicleInfo: string = undefined;
let vehicleAddress: string = undefined;

mp.keys.bind(Constants.F3_KEY, true, () => {
  if (player.vehicle)
    callRemoteEvent('HelicamToggle');
});

mp.events.add('Helicam:Toggle', helicamToggle);
function helicamToggle(desativar = false) {
  if (helicam || desativar) {
    mp.game.graphics.clearTimecycleModifier();
    if (scaleform != null || scaleform != 0)
      mp.game.graphics.setScaleformMovieAsNoLongerNeeded(scaleform);

    if (cam != null)
      mp.game.cam.destroyAllCams(true);

    mp.game.cam.renderScriptCams(false, false, 0, true, false, 0);

    cam = null;
    helicam = false;
    mp.game.graphics.setSeethrough(false);
    mp.game.graphics.setNightvision(false);
    vision_state = 0;
    lightStatus = false;
    callRemoteEvent('SpotlightRemove');
  } else {
    mp.game.graphics.setTimecycleModifier("heliGunCam");
    mp.game.graphics.setTimecycleModifierStrength(0.3);

    scaleform = mp.game.graphics.requestScaleformMovie("HELI_CAM");
    cam = mp.cameras.new('DEFAULT_SCRIPTED_FLY_CAMERA',
      new mp.Vector3(player.position.x, player.position.y, player.position.z),
      new mp.Vector3(0, 0, player.getHeading()),
      60);
    cam.setActive(true);

    cam.setRot(0.0, 0.0, player.vehicle.getHeading(), 2);
    cam.setFov(fov);
    mp.game.cam.renderScriptCams(true, false, 0, true, false, 0);

    cam.attachTo(player.vehicle.handle, 0.0, 0.0, -1.5, true);

    mp.game.graphics.beginScaleformMovieMethod(scaleform, "SET_CAM_LOGO");
    mp.game.graphics.scaleformMovieMethodAddParamInt(1);
    mp.game.graphics.endScaleformMovieMethod();

    helicam = true;
  }
}

mp.events.add('render', () => {
  const closeLights = lights.filter(x => distanceTo(player.position, x.position) <= 400);
  closeLights.forEach(light => {
    mp.game.graphics.drawSpotLight(
      light.position.x,
      light.position.y,
      light.position.z,
      light.direction.x,
      light.direction.y,
      light.direction.z,
      221,
      221,
      221,
      light.distance,
      light.brightness,
      light.hardness,
      light.radius,
      light.falloff
    );
  });

  if (helicam && player.vehicle) {
    if (cam !== null && cam.isActive() && cam.isRendering()) {

      mp.game.invoke('0x0AFC4AF510774B47');

      var x = mp.game.controls.getControlNormal(7, 1) * speed_lr;
      var y = mp.game.controls.getControlNormal(7, 2) * speed_ud;
      var zoomIn = mp.game.controls.getControlNormal(2, 40) * zoomspeed;
      var zoomOut = mp.game.controls.getControlNormal(2, 41) * zoomspeed;

      var currentRot = cam.getRot(2);

      currentRot = new mp.Vector3(currentRot.x - y, 0, currentRot.z - x);

      cam.setRot(currentRot.x, currentRot.y, currentRot.z, 2);

      if (zoomIn > 0) {
        var currentFov = cam.getFov();
        currentFov -= zoomIn;
        if (currentFov < fov_min)
          currentFov = fov_min;
        cam.setFov(currentFov);
      } else if (zoomOut > 0) {
        var currentFov = cam.getFov();
        currentFov += zoomOut;
        if (currentFov > fov_max)
          currentFov = fov_max;
        cam.setFov(currentFov);
      }
    }

    if (mp.game.controls.isControlJustPressed(0, toggle_vision)) {
      mp.game.audio.playSoundFrontend(
        -1,
        "SELECT",
        "HUD_FRONTEND_DEFAULT_SOUNDSET",
        false
      );
      ChangeVision();
    }

    if (mp.game.controls.isControlJustPressed(0, toggle_light)) {
      mp.game.audio.playSoundFrontend(
        -1,
        "SELECT",
        "HUD_FRONTEND_DEFAULT_SOUNDSET",
        false
      );
      lightStatus = !lightStatus;
      if (!lightStatus)
        callRemoteEvent('SpotlightRemove');
    }

    const vehicleId = pointingAt(cam);
    if (vehicleId) {
      const vehicle = mp.vehicles.atHandle(vehicleId);
      if (mp.game.cam.isSphereVisible(vehicle.position.x, vehicle.position.y, vehicle.position.z, 0.0099999998)) {
        const [zoneName, streetName] = getAddress(vehicle.position);
        const model = vehicle.getVariable(Constants.VEHICLE_META_DATA_MODEL);
        const plate = vehicle.getNumberPlateText().trim();

        vehicleInfo = `${model} ${plate}`;
        vehicleAddress = `${zoneName}, ${streetName}`;
      }
    }

    if (vehicleInfo)
      mp.game.graphics.drawText(vehicleInfo,
        [0.5, 0.93], {
        font: 0,
        color: [255, 255, 255, 185],
        scale: [0.55, 0.55],
        outline: true,
        centre: true,
      });

    if (vehicleAddress)
      mp.game.graphics.drawText(vehicleAddress,
        [0.5, 0.98], {
        font: 0,
        color: [255, 255, 255, 185],
        scale: [0.25, 0.25],
        outline: true,
        centre: true,
      });

    mp.game.graphics.beginScaleformMovieMethod(scaleform, "SET_ALT_FOV_HEADING");
    mp.game.graphics.scaleformMovieMethodAddParamFloat(player.vehicle.position.z);
    mp.game.graphics.scaleformMovieMethodAddParamFloat(cam.getFov());
    mp.game.graphics.scaleformMovieMethodAddParamFloat(cam.getRot(2).z);
    mp.game.graphics.endScaleformMovieMethod();
    mp.game.graphics.drawScaleformMovieFullscreen(scaleform, 255, 255, 255, 255, 1);
  }
});

function ChangeVision() {
  if (vision_state == 0) {
    mp.game.graphics.setNightvision(true);
    vision_state = 1;
  } /*else if (vision_state == 1) {
        mp.game.graphics.setNightvision(true);
        mp.game.graphics.setSeethrough(true);
        vision_state = 2;
    }*/ else {
    mp.game.graphics.setSeethrough(false);
    mp.game.graphics.setNightvision(false);
    vision_state = 0;
  }
}

setInterval(() => {
  if (lightStatus && spotlightPosition && spotlightDirection)
    callRemoteEvent('SpotlightAdd', spotlightPosition, spotlightDirection, 300.0, 1.0, 0.0, 13.0, 1.0, true);
}, 250);

let spotlightPosition = null;
let spotlightDirection = null;

function pointingAt(camera: CameraMp) {
  const distance = 2000;
  spotlightPosition = camera.getCoord();
  const rotation = camera.getRot(2);
  spotlightDirection = GetDirectionFromRotation(rotation);

  const farAway = new mp.Vector3((spotlightPosition.x + (spotlightDirection.x * distance)), (spotlightPosition.y + (spotlightDirection.y * distance)), (spotlightPosition.z + (spotlightDirection.z * distance)));

  const raycast = mp.game.shapetest.startExpensiveSynchronousShapeTestLosProbe(spotlightPosition.x, spotlightPosition.y, spotlightPosition.z,
    farAway.x, farAway.y, farAway.z,
    2, player.handle, 4);

  const result = mp.game.shapetest.getShapeTestResult(raycast);
  if (result) {
    const hitEntity = result.entityHit;

    if (hitEntity === null || hitEntity === undefined)
      return null;

    if (hitEntity === player.handle)
      return null;

    if (mp.game.entity.getType(hitEntity) == 2)
      return hitEntity;

    return null;
  }

  return null;
}

function GetDirectionFromRotation(rotation: Vector3) {
  const z = rotation.z * (Math.PI / 180.0);
  const x = rotation.x * (Math.PI / 180.0);
  const num = Math.abs(Math.cos(x));

  return new mp.Vector3(
    (-Math.sin(z) * num),
    (Math.cos(z) * num),
    Math.sin(x)
  );
}

mp.events.add('Spotlight:Add', (id, position, direction, distance, brightness, hardness, radius, falloff) => {
  const x = lights.findIndex(x => x.id === id);
  if (x === -1) {
    lights.push({ id, position, direction, distance, brightness, hardness, radius, falloff });
    return;
  }

  lights[x].position = position;
  lights[x].direction = direction;
  lights[x].distance = distance;
  lights[x].brightness = brightness;
  lights[x].hardness = hardness;
  lights[x].radius = radius;
  lights[x].falloff = falloff;
});

mp.events.add('Spotlight:Remove', (id) => {
  const x = lights.findIndex(x => x.id === id);
  if (x === -1)
    return;

  lights.splice(x, 1);
});

mp.events.add('Spotlight:Cancel', () => {
  lightStatus = false;
});

const renderSpotlight = () => {
  if (!player.vehicle)
    return;

  const door = player.vehicle.getBoneIndexByName('door_dside_f');
  const window = player.vehicle.getBoneIndexByName('windscreen');
  const doorCoords = player.vehicle.getWorldPositionOfBone(door);
  const windowCoords = player.vehicle.getWorldPositionOfBone(window);

  const forwardVector = player.vehicle.getForwardVector();
  const heading = player.vehicle.getHeading();

  let newY = player.vehicle.getVariable(Constants.VEHICLE_META_DATA_SPOTLIGHT_X) as number ?? 0;
  let newZ = player.vehicle.getVariable(Constants.VEHICLE_META_DATA_SPOTLIGHT_Z) as number ?? 0;

  if (mp.game.controls.isControlPressed(0, 127)) { // NumPad 8
    newZ += 0.1;
  } else if (mp.game.controls.isControlPressed(0, 126)) { // NumPad 5
    newZ -= 0.1;
  } else if (mp.game.controls.isControlPressed(0, 124)) { // NumPad 4
    newY += (heading >= 180 && heading <= 365 ? 0.1 : -0.1);
  } else if (mp.game.controls.isControlPressed(0, 125)) { // NumPad 6
    newY += (heading >= 180 && heading <= 365 ? -0.1 : 0.1);
  }

  if (newZ > 0.2)
    newZ = 0.2;

  if (newZ < -0.2)
    newZ = -0.2;

  if (newY > 3)
    newY = 3;

  if (newY < -3)
    newY = -3;

  callRemoteEvent('SetVehicleSpotlightX', newY);
  callRemoteEvent('SetVehicleSpotlightZ', newZ);
  callRemoteEvent('SpotlightAdd', 
    new mp.Vector3(doorCoords.x, windowCoords.y, doorCoords.z),
    new mp.Vector3(forwardVector.x, forwardVector.y + newY, forwardVector.z + newZ),
    70.0, 50.0, 4.3, 25.0, 28.6,
    false);
}

mp.events.add('Spotlight:Toggle', (state) => {
  mp.events.remove('render', renderSpotlight);
  if (!state)
    return;

  mp.events.add('render', renderSpotlight);
});