import { ZonedDateTime } from '@js-joda/core';
import { WorkerShift } from 'models/inputs/shift';
import { IncrementalMinuteDuration, ShiftTimestamp } from 'models/time';

export interface TimeClassifier {
  classifyShift(shift: WorkerShift): ClassifiedWorkedTime[];
}

export enum WorkTimeClassification {
  REGULAR_TIME = 'REGULAR_TIME',
  OVERTIME = 'OVERTIME',
}

export interface ClassifiedWorkedTime {
  startTime: ShiftTimestamp;
  endTime: ShiftTimestamp;
  duration: IncrementalMinuteDuration;
  classification: WorkTimeClassification;
}

export interface OvertimeCounter {
  countOvertimeInShift(shift: WorkerShift): OvertimeSpan | null;
}

export interface OvertimeSpan {
  startTime: ZonedDateTime;
  endTime: ZonedDateTime;
}
