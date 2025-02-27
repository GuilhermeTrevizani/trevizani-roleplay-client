export default interface Announcement {
  type: number;
  date: Date;
  sender: string;
  message: string;
  positionX: number;
  positionY: number;
};