import { useEffect } from 'react';
import { configureEvent } from '../../services/util';
import { Constants } from '../../../../src/base/constants';

const AudioPage = () => {
  let audioContext: AudioContext = null;
  interface AudioSpot { id: string, audio: HTMLAudioElement, panner: PannerNode, biquadFilter: BiquadFilterNode };
  let audioSpots: AudioSpot[] = [];

  const createAudioContext = () => {
    if (!audioContext)
      audioContext = new (window.AudioContext)();
  };

  const addAudio = (id: string, source: string, posX: number, posY: number, posZ: number, loop: boolean, range: number, volume: number) => {
    if (Constants.DEBUG)
      console.log('addAudio', id, source, posX, posY, posZ, loop), range, volume;

    const currentAudioSpot = audioSpots.find(x => x.id === id);
    if (currentAudioSpot) {
      currentAudioSpot.audio.volume = volume;
      return;
    }

    createAudioContext();

    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.src = source;
    audio.volume = 1;
    audio.loop = loop;
    audio.crossOrigin = '';
    audio.load();

    const biquadFilter = new BiquadFilterNode(audioContext, {
      type: "allpass",
    });

    const panner = new PannerNode(audioContext, {
      panningModel: "HRTF",
      distanceModel: "exponential",
      positionX: posX,
      positionY: posY,
      positionZ: posZ,
      refDistance: 1,
      maxDistance: range,
      rolloffFactor: 0,
      coneInnerAngle: 360,
      coneOuterAngle: 0,
      coneOuterGain: 0,
    });

    const track = audioContext.createMediaElementSource(audio);
    track
      .connect(panner)
      .connect(biquadFilter)
      .connect(audioContext.destination);

    audio.onloadeddata = (e) => {
      audio.play().catch(() => {
        console.log("URL inválida!");
      });
    };

    audio.onended = (e) => {
      console.log('end')
    };

    const audioSpot = {
      id,
      audio,
      panner,
      biquadFilter,
    };

    audioSpots.push(audioSpot);
  };

  const removeAudio = (id: string) => {
    if (Constants.DEBUG)
      console.log('removeAudio', id);
    const audioSpot = audioSpots.find(x => x.id === id);
    if (!audioSpot)
      return;

    audioSpot.audio.src = '';
    audioSpots.splice(audioSpots.indexOf(audioSpot), 1);
  };

  const setListenerPosition = (x: number, y: number, z: number) => {
    if (Constants.DEBUG)
      console.log('setListenerPosition', x, y, z);
    createAudioContext();
    audioContext.listener.setPosition(x, y, z);
  };

  const setListenerOrientation = (x: number, y: number, z: number) => {
    if (Constants.DEBUG)
      console.log('setListenerOrientation', x, y, z);
    createAudioContext();
    audioContext.listener.setOrientation(x, y, z, 0, 0, 1);
  };

  const setAudioPosition = (id: string, x: number, y: number, z: number) => {
    if (Constants.DEBUG)
      console.log('setAudioPosition', id, x, y, z);
    const audioSpot = audioSpots.find(x => x.id === id);
    if (!audioSpot)
      return;

    audioSpot.panner.setPosition(x, y, z);
  };

  const setAudioMuffled = (id: string, muffled: boolean) => {
    if (Constants.DEBUG)
      console.log('setAudioMuffled', id, muffled);
    const audioSpot = audioSpots.find(x => x.id === id);
    if (!audioSpot)
      return;

    if (muffled && audioSpot.biquadFilter.type !== 'lowpass')
      audioSpot.biquadFilter.type = 'lowpass';
    if (!muffled && audioSpot.biquadFilter.type !== 'allpass')
      audioSpot.biquadFilter.type = 'allpass';
  };

  useEffect(() => {
    configureEvent(Constants.AUDIO_PAGE_ADD_AUDIO, addAudio);
    configureEvent(Constants.AUDIO_PAGE_REMOVE_AUDIO, removeAudio);
    configureEvent(Constants.AUDIO_PAGE_SET_LISTENER_POSITION, setListenerPosition);
    configureEvent(Constants.AUDIO_PAGE_SET_LISTENER_ORIENTATION, setListenerOrientation);
    configureEvent(Constants.AUDIO_PAGE_SET_AUDIO_POSITION, setAudioPosition);
    configureEvent(Constants.AUDIO_PAGE_SET_AUDIO_MUFFLED, setAudioMuffled);
  }, []);

  return <>
    {/* <button onClick={() => addAudio('1', 'https://icepool.silvacast.com/GAYFM.mp3', 10, 10, 1, false, 20, 0.01)}>ADD</button>
    <button onClick={() => removeAudio('1')}>REMOVE</button>
    <button onClick={() => setListenerPosition(10, 10, 1)}>LISTENER POSITION</button>
    <button onClick={() => setListenerOrientation(3, 3, 3)}>LISTENER ORIENTATION</button>
    <button onClick={() => setAudioPosition('1', 100, 100, 1)}>AUDIO POSITION</button>
    <button onClick={() => setAudioMuffled('1', true)}>AUDIO MUFFLED ON</button>
    <button onClick={() => setAudioMuffled('1', false)}>AUDIO MUFFLED OFF</button> */}
  </>;
};

export default AudioPage;