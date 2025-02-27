export default interface Item {
  id: string;
  name: string;
  image: string;
  quantity: number;
  slot: number;
  extra?: string;
  weight: number;
  isUsable?: boolean;
  inUse?: boolean;
  isStack?: boolean;
};