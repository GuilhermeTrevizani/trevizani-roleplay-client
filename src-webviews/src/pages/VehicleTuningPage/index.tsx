import { useEffect, useState } from 'react';
import './style.scss';
import WheelType from '../../types/WheelType';
import { configureEvent, emitEvent, formatValue } from '../../services/util';
import { Constants } from '../../../../src/base/constants';
import { t } from 'i18next';
import { Checkbox, ColorPicker } from 'antd';

interface TuningMod {
  type: number;
  name: string;
  unitaryValue: number;
  value: number;
  current: number;
  selected?: number;
  maxMod: number;
  multiplyValue?: boolean;
};

interface Tuning {
  vehicleId?: string;
  targetId?: string;
  staff: boolean;
  repair: number;
  repairValue: number;
  mods: TuningMod[];
  currentMods: TuningMod[];
  wheelType: number;
  currentWheelType: number;
  wheelVariation: number;
  currentWheelVariation: number;
  wheelColor: number;
  currentWheelColor: number;
  wheelValue: number;
  color1: string;
  currentColor1: string;
  color2: string;
  currentColor2: string;
  colorValue: number;
  neonColor: string;
  currentNeonColor: string;
  neonLeft: number;
  currentNeonLeft: number;
  neonRight: number;
  currentNeonRight: number;
  neonFront: number;
  currentNeonFront: number;
  neonBack: number;
  currentNeonBack: number;
  neonValue: number;
  headlightColor: number;
  lightsMultiplier: number;
  xenonColorValue: number;
  currentHeadlightColor: number;
  currentLightsMultiplier: number;
  windowTint: number;
  currentWindowTint: number;
  windowTintValue: number;
  tireSmokeColor: string;
  currentTireSmokeColor: string;
  tireSmokeColorValue: number;
  protectionLevel: number;
  protectionLevelValue: number;
  currentProtectionLevel: number;
  xmr: number;
  xmrValue: number;
  currentXmr: number;
  livery: number;
  liveryValue: number;
  currentLivery: number;
  extras: boolean[];
  extrasValue: number;
  currentExtras: boolean[];
  drift: number;
  driftValue: number;
  currentDrift: number;
};

const VehicleTuningPage = () => {
  const [tuning, setTuning] = useState<Tuning>({
    staff: false,
    currentMods: [],
    mods: [],
    repair: 0,
    repairValue: 0,
    color1: "#000000",
    color2: "#000000",
    currentColor1: "#000000",
    currentColor2: "#000000",
    colorValue: 0,
    wheelType: 0,
    wheelVariation: 0,
    wheelColor: 0,
    currentWheelType: 0,
    currentWheelVariation: 0,
    currentWheelColor: 0,
    wheelValue: 0,
    neonColor: "#000000",
    neonLeft: 0,
    neonRight: 0,
    neonFront: 0,
    neonBack: 0,
    currentNeonColor: "#000000",
    currentNeonLeft: 0,
    currentNeonRight: 0,
    currentNeonFront: 0,
    currentNeonBack: 0,
    neonValue: 0,
    headlightColor: 0,
    lightsMultiplier: 0,
    xenonColorValue: 0,
    currentHeadlightColor: 0,
    currentLightsMultiplier: 0,
    windowTint: 0,
    currentWindowTint: 0,
    windowTintValue: 0,
    tireSmokeColor: '#000000',
    currentTireSmokeColor: '#000000',
    tireSmokeColorValue: 0,
    currentProtectionLevel: 0,
    currentXmr: 0,
    protectionLevel: 0,
    protectionLevelValue: 0,
    xmr: 0,
    xmrValue: 0,
    livery: 0,
    liveryValue: 0,
    currentLivery: 0,
    extras: [],
    currentExtras: [],
    extrasValue: 0,
    currentDrift: 0,
    drift: 0,
    driftValue: 0,
  });

  const wheelTypes: WheelType[] = [{
    name: 'Sport',
    maxVariations: 50,
  }, {
    name: 'Muscle',
    maxVariations: 36,
  }, {
    name: 'Lowrider',
    maxVariations: 30,
  }, {
    name: 'SUV',
    maxVariations: 39,
  }, {
    name: 'Offroad',
    maxVariations: 35,
  }, {
    name: 'Tuner',
    maxVariations: 48,
  }, {
    name: 'Bike Wheels',
    maxVariations: 144,
  }, {
    name: 'High End',
    maxVariations: 40,
  }];

  const [maxLivery, setMaxLivery] = useState(-1);
  const [extras, setExtras] = useState<number[]>([]);
  const [canUseDrift, setCanUseDrift] = useState(false);

  const cancel = () => {
    emitEvent(Constants.VEHICLE_TUNING_PAGE_CONFIRM, false, JSON.stringify(tuning));
  };

  const confirm = () => {
    emitEvent(Constants.VEHICLE_TUNING_PAGE_CONFIRM, true, JSON.stringify(tuning));
  };

  const getTotal = () => {
    return formatValue(tuning.mods ? tuning.mods.reduce((a, b) => a + b.value, 0) : 0);
  }

  useEffect(() => {
    configureEvent(Constants.VEHICLE_TUNING_PAGE_SHOW, (tuningJson: string, maxLivery: number, extrasJson: string, canUseDrift: boolean) => {
      setMaxLivery(maxLivery);
      setExtras(JSON.parse(extrasJson));
      setTuning(JSON.parse(tuningJson));
      setCanUseDrift(canUseDrift);
    });

    emitEvent(Constants.VEHICLE_TUNING_PAGE_SHOW);
  }, []);

  const removeItem = (mod: TuningMod) => {
    if (mod.type == 255) {
      setTuning({ ...tuning, repair: 0 });
    } else if (mod.type == 254) {
      setTuning({ ...tuning, color1: tuning.currentColor1, color2: tuning.currentColor2 });
    } else if (mod.type == 253) {
      setTuning({ ...tuning, wheelType: tuning.currentWheelType, wheelVariation: tuning.currentWheelVariation, wheelColor: tuning.currentWheelColor });
    } else if (mod.type == 252) {
      setTuning({
        ...tuning, neonColor: tuning.currentNeonColor,
        neonRight: tuning.currentNeonRight, neonLeft: tuning.currentNeonLeft,
        neonFront: tuning.currentNeonFront, neonBack: tuning.currentNeonBack
      });
    } else if (mod.type == 251) {
      setTuning({ ...tuning, headlightColor: tuning.currentHeadlightColor, lightsMultiplier: tuning.currentLightsMultiplier });
    } else if (mod.type == 250) {
      setTuning({ ...tuning, windowTint: tuning.currentWindowTint });
    } else if (mod.type == 249) {
      setTuning({ ...tuning, tireSmokeColor: tuning.currentTireSmokeColor });
    } else if (mod.type == 248) {
      setTuning({ ...tuning, protectionLevel: tuning.currentProtectionLevel });
    } else if (mod.type == 247) {
      setTuning({ ...tuning, xmr: tuning.currentXmr });
    } else if (mod.type == 246) {
      setTuning({ ...tuning, livery: tuning.currentLivery });
    } else if (mod.type == 245) {
      setTuning({ ...tuning, extras: [...tuning.currentExtras] });
    } else if (mod.type == 244) {
      setTuning({ ...tuning, drift: tuning.currentDrift });
    } else {
      const index = tuning.currentMods.findIndex(x => x.type === mod.type);
      handleChangeMod(index, mod.current);
    }
  };

  const handleChangeMod = (index: number, value: number) => {
    const currentMods = [...tuning.currentMods];
    const mod = currentMods[index];
    mod.selected = value;

    let multiplier = 1;
    if (mod.multiplyValue && mod.selected > 1)
      multiplier = mod.selected;

    mod.value = mod.unitaryValue * multiplier;

    setTuning({ ...tuning, currentMods: currentMods });

    const mods = [...tuning.mods];
    const x = mods.findIndex(x => x.type === mod.type);
    if (mod.selected != mod.current) {
      if (x === -1)
        mods.push(mod);
    } else {
      if (x !== -1)
        mods.splice(x, 1);
    }

    setTuning({ ...tuning, mods: mods });
    emitEvent(Constants.VEHICLE_TUNING_PAGE_SYNC_MOD, mod.type, mod.selected);
  };

  useEffect(() => {
    const mods = [...tuning.mods];
    const x = mods.findIndex(x => x.type === 255);

    if (tuning.repair == 1) {
      if (x === -1)
        mods.push({
          type: 255,
          name: t('repair'),
          value: tuning.repairValue,
          current: 0,
          maxMod: 0,
          unitaryValue: 0,
        });
    } else {
      if (x !== -1)
        mods.splice(x, 1);
    }

    setTuning({ ...tuning, mods: mods });
  }, [tuning.repair]);

  useEffect(() => {
    const mods = [...tuning.mods];
    const x = mods.findIndex(x => x.type === 254);

    if (tuning.color1.toUpperCase() != tuning.currentColor1.toUpperCase()
      || tuning.color2.toUpperCase() != tuning.currentColor2.toUpperCase()) {
      if (x === -1)
        mods.push({
          type: 254,
          name: t('painting'),
          value: tuning.colorValue,
          current: 0,
          maxMod: 0,
          unitaryValue: 0,
        });
    } else {
      if (x !== -1)
        mods.splice(x, 1);
    }

    setTuning({ ...tuning, mods: mods });
    emitEvent(Constants.VEHICLE_TUNING_PAGE_SYNC_COLOR, tuning.color1, tuning.color2);
  }, [tuning.color1, tuning.color2]);

  useEffect(() => {
    const mods = [...tuning.mods];
    const x = mods.findIndex(x => x.type === 253);

    if (tuning.wheelType != tuning.currentWheelType
      || tuning.wheelVariation != tuning.currentWheelVariation
      || tuning.wheelColor != tuning.currentWheelColor) {
      if (x === -1)
        mods.push({
          type: 253,
          name: t('wheels'),
          value: tuning.wheelValue,
          current: 0,
          maxMod: 0,
          unitaryValue: 0,
        });
    } else {
      if (x !== -1)
        mods.splice(x, 1);
    }

    setTuning({ ...tuning, mods: mods });
    emitEvent(Constants.VEHICLE_TUNING_PAGE_SYNC_WHEEL, tuning.wheelType, tuning.wheelVariation, tuning.wheelColor);
  }, [tuning.wheelVariation, tuning.wheelColor]);

  useEffect(() => {
    setTuning({ ...tuning, wheelVariation: 0 });
  }, [tuning.wheelType]);

  useEffect(() => {
    const mods = [...tuning.mods];
    const x = mods.findIndex(x => x.type === 252);

    if (tuning.neonColor.toUpperCase() != tuning.currentNeonColor.toUpperCase()
      || tuning.neonLeft != tuning.currentNeonLeft
      || tuning.neonRight != tuning.currentNeonRight
      || tuning.neonFront != tuning.currentNeonFront
      || tuning.neonBack != tuning.currentNeonBack) {
      if (x === -1)
        mods.push({
          type: 252,
          name: t('neon'),
          value: tuning.neonValue,
          current: 0,
          maxMod: 0,
          unitaryValue: 0,
        });
    } else {
      if (x !== -1)
        mods.splice(x, 1);
    }

    setTuning({ ...tuning, mods: mods });
    emitEvent(Constants.VEHICLE_TUNING_PAGE_SYNC_NEON, tuning.neonColor,
      tuning.neonLeft, tuning.neonRight, tuning.neonFront, tuning.neonBack);
  }, [tuning.neonColor, tuning.neonLeft, tuning.neonRight, tuning.neonFront, tuning.neonBack]);

  useEffect(() => {
    const mods = [...tuning.mods];
    const x = mods.findIndex(x => x.type === 251);

    if (tuning.headlightColor != tuning.currentHeadlightColor
      || tuning.lightsMultiplier != tuning.currentLightsMultiplier) {
      if (x === -1)
        mods.push({
          type: 251,
          name: t('xenonColor'),
          value: tuning.xenonColorValue,
          current: 0,
          maxMod: 0,
          unitaryValue: 0,
        });
    } else {
      if (x !== -1)
        mods.splice(x, 1);
    }

    setTuning({ ...tuning, mods: mods });
    emitEvent(Constants.VEHICLE_TUNING_PAGE_SYNC_XENON_COLOR, tuning.headlightColor, tuning.lightsMultiplier);
  }, [tuning.headlightColor, tuning.lightsMultiplier]);

  useEffect(() => {
    const mods = [...tuning.mods];
    const x = mods.findIndex(x => x.type === 250);

    if (tuning.windowTint != tuning.currentWindowTint) {
      if (x === -1)
        mods.push({
          type: 250,
          name: t('windowTint'),
          value: tuning.windowTintValue,
          current: 0,
          maxMod: 0,
          unitaryValue: 0,
        });
    } else {
      if (x !== -1)
        mods.splice(x, 1);
    }

    setTuning({ ...tuning, mods: mods });
    emitEvent(Constants.VEHICLE_TUNING_PAGE_SYNC_WINDOW_TINT, tuning.windowTint);
  }, [tuning.windowTint]);

  useEffect(() => {
    const mods = [...tuning.mods];
    const x = mods.findIndex(x => x.type === 249);

    if (tuning.tireSmokeColor.toUpperCase() != tuning.currentTireSmokeColor.toUpperCase()) {
      if (x === -1)
        mods.push({
          type: 249,
          name: t('tireSmokeColor'),
          value: tuning.tireSmokeColorValue,
          current: 0,
          maxMod: 0,
          unitaryValue: 0,
        });
    } else {
      if (x !== -1)
        mods.splice(x, 1);
    }

    setTuning({ ...tuning, mods: mods });
    emitEvent(Constants.VEHICLE_TUNING_PAGE_SYNC_TIRE_SMOKE_COLOR, tuning.tireSmokeColor);
  }, [tuning.tireSmokeColor]);

  useEffect(() => {
    const mods = [...tuning.mods];
    const x = mods.findIndex(x => x.type === 248);

    if (tuning.protectionLevel != tuning.currentProtectionLevel) {
      if (x !== -1)
        mods.splice(x, 1);

      mods.push({
        type: 248,
        name: t('protectionLevel'),
        value: tuning.protectionLevel * tuning.protectionLevelValue,
        current: 0,
        maxMod: 0,
        unitaryValue: 0,
        selected: tuning.protectionLevel,
      });
    } else {
      if (x !== -1)
        mods.splice(x, 1);
    }

    setTuning({ ...tuning, mods: mods });
  }, [tuning.protectionLevel]);

  useEffect(() => {
    const mods = [...tuning.mods];
    const x = mods.findIndex(x => x.type === 247);

    if (tuning.xmr != tuning.currentXmr) {
      if (x === -1)
        mods.push({
          type: 247,
          name: t('xmr'),
          value: tuning.xmrValue,
          current: 0,
          maxMod: 0,
          unitaryValue: 0,
        });
    } else {
      if (x !== -1)
        mods.splice(x, 1);
    }

    setTuning({ ...tuning, mods: mods });
  }, [tuning.xmr]);

  useEffect(() => {
    const mods = [...tuning.mods];
    const x = mods.findIndex(x => x.type === 246);

    if (tuning.livery != tuning.currentLivery) {
      if (x === -1)
        mods.push({
          type: 246,
          name: t('livery'),
          value: tuning.liveryValue,
          current: 0,
          maxMod: 0,
          unitaryValue: 0,
        });
    } else {
      if (x !== -1)
        mods.splice(x, 1);
    }

    setTuning({ ...tuning, mods: mods });
    emitEvent(Constants.VEHICLE_TUNING_PAGE_SYNC_LIVERY, tuning.livery);
  }, [tuning.livery]);

  useEffect(() => {
    const mods = [...tuning.mods];
    const x = mods.findIndex(x => x.type === 245);

    const extrasJSON = JSON.stringify(tuning.extras);

    if (extrasJSON != JSON.stringify(tuning.currentExtras)) {
      if (x === -1)
        mods.push({
          type: 245,
          name: t('extra'),
          value: tuning.extrasValue,
          current: 0,
          maxMod: 0,
          unitaryValue: 0,
        });
    } else {
      if (x !== -1)
        mods.splice(x, 1);
    }

    setTuning({ ...tuning, mods: mods });
    emitEvent(Constants.VEHICLE_TUNING_PAGE_SYNC_EXTRAS, JSON.stringify(tuning.extras));
  }, [JSON.stringify(tuning.extras)]);

  useEffect(() => {
    const mods = [...tuning.mods];
    const x = mods.findIndex(x => x.type === 244);

    if (tuning.drift != tuning.currentDrift) {
      if (x === -1)
        mods.push({
          type: 244,
          name: t('driftMode'),
          value: tuning.driftValue,
          current: 0,
          maxMod: 0,
          unitaryValue: 0,
        });
    } else {
      if (x !== -1)
        mods.splice(x, 1);
    }

    setTuning({ ...tuning, mods: mods });
  }, [tuning.drift]);

  return <div className="tuningPage">
    <div className="editor2">
      <div className="options">
        <div className="option">
          <div className="labelContainer">
            <div className="label">
              {t('repair')}
            </div>
            <div className="value">
              {tuning.repair}
            </div>
          </div>
          <div className="inputHolder">
            <input type="range" min="0" max="1" step="1" value={tuning.repair} onChange={(e) => setTuning({ ...tuning, repair: Number(e.target.value) })} />
          </div>
        </div>

        {tuning.currentMods.map((mod, index) => {
          return (
            <div className="option">
              <div className="labelContainer">
                <div className="label">
                  {mod.name}
                </div>
                <div className="value">
                  {mod.selected}
                </div>
              </div>
              <div className="inputHolder">
                <input type="range" min="-1" max={mod.maxMod} step="1" value={mod.selected} onChange={(e) => handleChangeMod(index, Number(e.target.value))} />
              </div>
            </div>
          )
        })}

        <div className="option">
          <div className="labelContainer">
            <div className="label">
              {t('primaryColor')}
            </div>
            <div className="value">
              {tuning.color1}
            </div>
          </div>
          <ColorPicker size='middle' disabledAlpha style={{ marginBottom: '5px' }}
            value={tuning.color1} onChange={(e) => setTuning({ ...tuning, color1: e.toHexString() })} />
          <div className="labelContainer">
            <div className="label">
              {t('secondaryColor')}
            </div>
            <div className="value">
              {tuning.color2}
            </div>
          </div>
          <ColorPicker size='middle' disabledAlpha style={{ marginBottom: '5px' }}
            value={tuning.color2} onChange={(e) => setTuning({ ...tuning, color2: e.toHexString() })} />
        </div>

        <div className="option">
          <div className="labelContainer">
            <div className="label">
              {t('wheelType')}
            </div>
            <div className="value">
              {wheelTypes[tuning.wheelType]?.name}
            </div>
          </div>
          <div className="inputHolder">
            <input type="range" min="0" max={wheelTypes.length - 1} step="1" value={tuning.wheelType} onChange={(e) => setTuning({ ...tuning, wheelType: Number(e.target.value) })} />
          </div>

          <div className="labelContainer">
            <div className="label">
              {t('wheelVariation')}
            </div>
            <div className="value">
              {tuning.wheelVariation}
            </div>
          </div>
          <div className="inputHolder">
            <input type="range" min="0" max={wheelTypes[tuning.wheelType]?.maxVariations ?? 0} step="1" value={tuning.wheelVariation} onChange={(e) => setTuning({ ...tuning, wheelVariation: Number(e.target.value) })} />
          </div>

          <div className="labelContainer">
            <div className="label">
              {t('wheelColor')}
            </div>
            <div className="value">
              {tuning.wheelColor}
            </div>
          </div>
          <div className="inputHolder">
            <input type="range" min="0" max="161" step="1" value={tuning.wheelColor} onChange={(e) => setTuning({ ...tuning, wheelColor: Number(e.target.value) })} />
          </div>
        </div>

        <div className="option">
          <div className="labelContainer">
            <div className="label">
              {t('neonColor')}
            </div>
            <div className="value">
              {tuning.neonColor}
            </div>
          </div>
          <ColorPicker size='middle' disabledAlpha style={{ marginBottom: '5px' }}
            value={tuning.neonColor} onChange={(e) => setTuning({ ...tuning, neonColor: e.toHexString() })} />
          <div className="labelContainer">
            <div className="label">
              {t('neonLeft')}
            </div>
            <div className="value">
              {tuning.neonLeft}
            </div>
          </div>
          <div className="inputHolder">
            <input type="range" min="0" max="1" step="1" value={tuning.neonLeft} onChange={(e) => setTuning({ ...tuning, neonLeft: Number(e.target.value) })} />
          </div>

          <div className="labelContainer">
            <div className="label">
              {t('neonRight')}
            </div>
            <div className="value">
              {tuning.neonRight}
            </div>
          </div>
          <div className="inputHolder">
            <input type="range" min="0" max="1" step="1" value={tuning.neonRight} onChange={(e) => setTuning({ ...tuning, neonRight: Number(e.target.value) })} />
          </div>

          <div className="labelContainer">
            <div className="label">
              {t('neonFront')}
            </div>
            <div className="value">
              {tuning.neonFront}
            </div>
          </div>
          <div className="inputHolder">
            <input type="range" min="0" max="1" step="1" value={tuning.neonFront} onChange={(e) => setTuning({ ...tuning, neonFront: Number(e.target.value) })} />
          </div>

          <div className="labelContainer">
            <div className="label">
              {t('neonBack')}
            </div>
            <div className="value">
              {tuning.neonBack}
            </div>
          </div>
          <div className="inputHolder">
            <input type="range" min="0" max="1" step="1" value={tuning.neonBack} onChange={(e) => setTuning({ ...tuning, neonBack: Number(e.target.value) })} />
          </div>
        </div>

        <div className="option">
          <div className="labelContainer">
            <div className="label">
              {t('xenonColor')}
            </div>
            <div className="value">
              {tuning.headlightColor}
            </div>
          </div>
          <div className="inputHolder">
            <input type="range" min="0" max="12" step="1" value={tuning.headlightColor} onChange={(e) => setTuning({ ...tuning, headlightColor: Number(e.target.value) })} />
          </div>

          <div className="labelContainer">
            <div className="label">
              {t('lightsMultiplier')}
            </div>
            <div className="value">
              {tuning.lightsMultiplier}
            </div>
          </div>
          <div className="inputHolder">
            <input type="range" min="0" max="20" step="1" value={tuning.lightsMultiplier} onChange={(e) => setTuning({ ...tuning, lightsMultiplier: Number(e.target.value) })} />
          </div>
        </div>

        <div className="option">
          <div className="labelContainer">
            <div className="label">
              {t('windowTint')}
            </div>
            <div className="value">
              {tuning.windowTint}
            </div>
          </div>
          <div className="inputHolder">
            <input type="range" min="0" max="5" step="1" value={tuning.windowTint} onChange={(e) => setTuning({ ...tuning, windowTint: Number(e.target.value) })} />
          </div>
        </div>

        <div className="option">
          <div className="labelContainer">
            <div className="label">
              {t('tireSmokeColor')}
            </div>
            <div className="value">
              {tuning.tireSmokeColor}
            </div>
          </div>
          <ColorPicker size='middle' disabledAlpha
            value={tuning.tireSmokeColor} onChange={(e) => setTuning({ ...tuning, tireSmokeColor: e.toHexString() })} />
        </div>

        <div className="option">
          <div className="labelContainer">
            <div className="label">
              {t('protectionLevel')}
            </div>
            <div className="value">
              {tuning.protectionLevel}
            </div>
          </div>
          <div className="inputHolder">
            <input type="range" min="0" max="3" step="1" value={tuning.protectionLevel} onChange={(e) => setTuning({ ...tuning, protectionLevel: Number(e.target.value) })} />
          </div>
        </div>

        <div className="option">
          <div className="labelContainer">
            <div className="label">
              {t('xmr')}
            </div>
            <div className="value">
              {tuning.xmr}
            </div>
          </div>
          <div className="inputHolder">
            <input type="range" min="0" max="1" step="1" value={tuning.xmr} onChange={(e) => setTuning({ ...tuning, xmr: Number(e.target.value) })} />
          </div>
        </div>

        {canUseDrift && <div className="option">
          <div className="labelContainer">
            <div className="label">
              {t('driftMode')}
            </div>
            <div className="value">
              {tuning.drift}
            </div>
          </div>
          <div className="inputHolder">
            <input type="range" min="0" max="1" step="1" value={tuning.drift} onChange={(e) => setTuning({ ...tuning, drift: Number(e.target.value) })} />
          </div>
        </div>}

        {maxLivery != -1 && <div className="option">
          <div className="labelContainer">
            <div className="label">
              {t('livery')}
            </div>
            <div className="value">
              {tuning.livery}
            </div>
          </div>
          <div className="inputHolder">
            <input type="range" min="1" max={maxLivery} step="1" value={tuning.livery} onChange={(e) => setTuning({ ...tuning, livery: Number(e.target.value) })} />
          </div>
        </div>}

        {extras.length > 0 && <div className="option">
          {extras.map((extra) => {
            const index = extra - 1;
            return (
              <Checkbox checked={tuning.extras[index]}
                onChange={(e) => {
                  const extras = tuning.extras;
                  extras[index] = e.target.checked;
                  setTuning({ ...tuning, extras: extras })
                }}>{t('extra')} {extra}</Checkbox>
            )
          })}
        </div>}

      </div>
    </div>
    <div className="editor3">
      <p>{t('selectedItems')} {!tuning.staff && !tuning.targetId ? `($${getTotal()})` : ''}</p>
      <div className="options">
        {tuning.mods.map(mod => {
          return (
            <div className="option">
              <div className="labelContainer">
                <div className="label">
                  {mod.name} {mod.selected ? mod.selected : ''}
                  <button className="danger" style={{ padding: '5px' }} onClick={() => removeItem(mod)}>{t('delete')}</button>
                </div>
              </div>
              {!tuning.staff && !tuning.targetId && <span style={{ fontSize: '10px' }}> {t('price')}: ${formatValue(mod.value)}</span>}
            </div>
          )
        })}
      </div>
      <div className="navigation">
        <button onClick={cancel} className="danger">{t('cancel')}</button>
        <button onClick={confirm}>{t('confirm')}</button>
      </div>
    </div>
  </div>;
};

export default VehicleTuningPage;