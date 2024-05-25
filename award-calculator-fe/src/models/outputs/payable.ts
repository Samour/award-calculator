import { WorkerShift } from 'models/inputs/shift';
import { Worker } from 'models/inputs/worker';
import { IncrementalMonetaryAmount, LoadingRate, MonetaryAmount } from 'models/money';
import { IncrementalMinuteDuration, ShiftTimestamp, TimeSpan } from 'models/time';

export interface WorkerPayable {
  worker: Worker;
  shifts: ShiftPayable[];
  payableAmount: MonetaryAmount;
}

export interface ShiftPayable {
  shift: WorkerShift;
  overtimeSpans: ClassifiedOvertimeSpan[];
  increments: ClassifiedPayableTime[];
  payableAmount: MonetaryAmount;
}

export enum LoadingClassification {
  REGULAR_TIME = 'REGULAR_TIME',
  TIME_AND_A_HALF = 'TIME_AND_A_HALF',
  DOUBLE_TIME = 'DOUBLE_TIME',
  WEEKEND_PENALTY = 'WEEKEND_PENALTY',
  CASUAL = 'CASUAL',
}

export enum OvertimeReason {
  CONSECUTIVE_DAYS = 'CONSECUTIVE_DAYS',
  DAILY_HOURS = 'DAILY_HOURS',
  SHIFT_GAP = 'SHIFT_GAP',
  FORTNIGHTLY_HOURS = 'FORTNIGHTLY_HOURS',
  WORKING_HOURS = 'WORKING_HOURS',
}

export interface ClassifiedOvertimeSpan extends TimeSpan {
  reason: OvertimeReason;
}

export interface ClassifiedPayableTime {
  startTime: ShiftTimestamp;
  endTime: ShiftTimestamp;
  duration: IncrementalMinuteDuration;
  classification: LoadingClassification;
  loading: LoadingRate;
  payableAmount: IncrementalMonetaryAmount;
}
