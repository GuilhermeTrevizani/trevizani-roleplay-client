export default interface Outfit {
  slot: number;
  cloth1: ClothAccessory;
  cloth3: ClothAccessory;
  cloth4: ClothAccessory;
  cloth5: ClothAccessory;
  cloth6: ClothAccessory;
  cloth7: ClothAccessory;
  cloth8: ClothAccessory;
  cloth9: ClothAccessory;
  cloth10: ClothAccessory;
  cloth11: ClothAccessory;
  accessory0: ClothAccessory;
  accessory1: ClothAccessory;
  accessory2: ClothAccessory;
  accessory6: ClothAccessory;
  accessory7: ClothAccessory;
};

export interface ClothAccessory {
  drawable: number;
  texture: number;
  dlc?: string;
  using: boolean;
};