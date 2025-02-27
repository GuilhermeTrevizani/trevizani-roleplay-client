import PersonalizationColorOverlay from './PersonalizationColorOverlay';
import PersonalizationOpacityOverlay from './PersonalizationOpacityOverlay';
import PersonalizationTattoo from './PersonalizationTattoo';

export default interface Personalization {
  faceFather: number;
  faceMother: number;
  faceAncestry: number;
  skinFather: number;
  skinMother: number;
  skinAncestry: number;
  faceMix: number;
  skinMix: number;
  ancestryMix: number;
  structure: number[];
  eyes: number;
  hair: number;
  hairColor1: number;
  hairColor2: number;
  hairDLC?: string;
  hairCollection?: string;
  hairOverlay?: string;
  opacityOverlays: PersonalizationOpacityOverlay[];
  colorOverlays: PersonalizationColorOverlay[];
  tattoos: PersonalizationTattoo[];
};