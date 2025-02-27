import { TransactionType } from './TransactionType';

export default interface Transaction {
  date: Date;
  value: number;
  description: string;
  type: TransactionType;
};