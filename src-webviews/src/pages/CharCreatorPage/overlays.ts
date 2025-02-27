import { t } from 'i18next';

export const opacityOverlays = [
  {
    label: t('stains'),
    max: 23,
    id: 0,
  },
  {
    label: t('age'),
    max: 14,
    id: 3,
  },
  {
    label: t('aspect'),
    max: 11,
    id: 6,
  },
  {
    label: t('sunDamage'),
    max: 10,
    id: 7,
  },
  {
    label: t('freckles'),
    max: 17,
    id: 9,
  },
  {
    label: t('bodyStains'),
    max: 11,
    id: 11,
  }
];

export const colorOverlays = [
  {
    id: 1,
    label: t('facialHair'),
    max: 28,
    hasColor2: false
  },
  {
    id: 2,
    label: t('eyebrow'),
    max: 33,
    hasColor2: false
  },
  {
    id: 4,
    label: t('makeUp'),
    max: 94,
    hasColor2: true
  },
  {
    id: 5,
    label: t('blush'),
    max: 32,
    hasColor2: false
  },
  {
    id: 8,
    label: t('lipstick'),
    max: 9,
    hasColor2: false
  },
  {
    id: 10,
    label: t('chestHair'),
    max: 16,
    hasColor2: false
  }
];