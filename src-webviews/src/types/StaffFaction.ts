export default interface StaffFaction {
  id: string;
  name: string;
  type: number;
  typeDisplay: string;
  slots: number;
  leader?: string;
  shortName: string;
};