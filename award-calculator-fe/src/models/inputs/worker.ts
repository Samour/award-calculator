import { MonetaryAmount } from 'models/money';
import { WorkerShift } from './shift';

export type WorkerCode = string;

export interface WorkerName {
  firstName: string;
  lastName: string;
}

export interface Worker {
  code: WorkerCode;
  name: WorkerName;
  basePayRate: MonetaryAmount;
  casualLoading: boolean;
  shifts: WorkerShift[];
}
