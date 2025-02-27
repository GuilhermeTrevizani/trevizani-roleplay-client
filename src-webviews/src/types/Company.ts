export default interface Company {
  id: string;
  name: string;
  weekRentValue: number;
  rentPaymentDate: Date;
  color: string;
  blipType: number;
  blipColor: number;
  isOpen: boolean;
  isOwner: boolean;
  canOpen: boolean;
  canUseSafe: boolean;
  safe: number;
};