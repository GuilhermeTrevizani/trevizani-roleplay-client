export default interface StaffTruckerLocation {
  id: string;
  name: string;
  posX: number;
  posY: number;
  posZ: number;
  deliveryValue: number;
  loadWaitTime: number;
  unloadWaitTime: number;
  allowedVehicles: string[];
};