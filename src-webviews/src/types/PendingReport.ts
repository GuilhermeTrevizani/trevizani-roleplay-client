export default interface PendingReport {
  id: string;
  registerDate: Date;
  policeOfficer: string;
  description: string;
  isOwner: boolean;
  type: number;
};