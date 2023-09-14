import { WorkerShift } from 'models/inputs/shift';
import { Worker } from 'models/inputs/worker';
import { IncrementalMonetaryAmount, LoadingRate, MonetaryAmount } from 'models/money';
import { IncrementalMinuteDuration, ShiftTimestamp } from 'models/time';

export interface WorkerPayable {
  worker: Worker;
  shifts: ShiftPayable[];
  payableAmount: MonetaryAmount;
}

export interface ShiftPayable {
  shift: WorkerShift;
  increments: ClassifiedPayableTime[];
  payableAmount: MonetaryAmount;
}

export enum LoadingClassification {
  REGULAR_TIME = 'REGULAR_TIME',
  TIME_AND_A_HALF = 'TIME_AND_A_HALF',
  DOUBLE_TIME = 'DOUBLE_TIME',
  PENALTY = 'PENALTY',
  CASUAL = 'CASUAL',
}

export interface ClassifiedPayableTime {
  startTime: ShiftTimestamp;
  endTime: ShiftTimestamp;
  duration: IncrementalMinuteDuration;
  classification: LoadingClassification;
  loading: LoadingRate;
  payableAmount: IncrementalMonetaryAmount;
  // TODO we could consider adding some kind of "reason" field here to display in UI
  // Eg. "penalty rate of 25% applied because of regular time worked on a Saturday"
}
