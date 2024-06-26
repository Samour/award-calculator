import { Duration } from '@js-joda/core';
import Decimal from 'decimal.js';
import { WorkerShift } from 'models/inputs/shift';
import { ClassifiedOvertimeSpan, OvertimeReason } from 'models/outputs/payable';
import { IncrementalMinuteDuration, ShiftTimestamp, TimeSpan, comparingTime } from 'models/time';

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

export interface ClassifiedShift {
  shift: WorkerShift;
  classifiedTime: ClassifiedWorkedTime[];
  classifiedOvertime: ClassifiedOvertimeSpan[];
}

export interface OvertimeCounter {
  readonly reason: OvertimeReason;
  countOvertimeInShift(shift: WorkerShift): TimeSpan[];
}

export interface LookAheadOvertimeCounter extends OvertimeCounter {
  peekShift(shift: WorkerShift): void;
}

export class TimeClassifier {

  constructor(
    private readonly lookAheadOvertimeCounters: LookAheadOvertimeCounter[],
    private readonly overtimeCounters: OvertimeCounter[],
  ) { }

  private get allOvertimeCounters(): OvertimeCounter[] {
    return this.overtimeCounters.concat(this.lookAheadOvertimeCounters);
  }

  classifyShifts(shifts: WorkerShift[]): ClassifiedShift[] {
    const orderedShifts = [...shifts];
    orderedShifts.sort(comparingTime);

    this.lookAheadOvertimeCounters.forEach((lookAhead) =>
      orderedShifts.forEach((shift) => lookAhead.peekShift(shift)),
    );

    return orderedShifts.map((shift) =>
      this.classifySingleShift(shift),
    );
  }

  private classifySingleShift(shift: WorkerShift): ClassifiedShift {
    const overtimeSpans = this.allOvertimeCounters.map((counter): ClassifiedOvertimeSpan[] =>
      counter.countOvertimeInShift(shift).map((s) => ({
        ...s,
        reason: counter.reason,
      })),
    ).flat();
    overtimeSpans.sort(comparingTime);

    const mergedOvertimeSpans = this.mergeSpans(overtimeSpans);

    return {
      shift,
      classifiedTime: this.fillRegularTimes(shift, mergedOvertimeSpans),
      classifiedOvertime: overtimeSpans,
    };
  }

  private mergeSpans(overtimeSpans: TimeSpan[]): TimeSpan[] {
    const mergedSpans: TimeSpan[] = [];
    let currentSpan: TimeSpan | null = null;

    overtimeSpans.forEach((span) => {
      if (!currentSpan) {
        currentSpan = span;
      } else if (currentSpan.endTime.isBefore(span.startTime)) {
        mergedSpans.push(currentSpan);
        currentSpan = span;
      } else {
        currentSpan = {
          startTime: currentSpan.startTime,
          endTime: span.endTime,
        };
      }
    });

    if (currentSpan) {
      mergedSpans.push(currentSpan);
    }

    return mergedSpans;
  }

  private fillRegularTimes(shift: WorkerShift, overtimeSpans: TimeSpan[]): ClassifiedWorkedTime[] {
    const classifiedTime: ClassifiedWorkedTime[] = [];
    let unclassifiedStart = shift.startTime;
    overtimeSpans.forEach((span) => {
      if (unclassifiedStart.isBefore(span.startTime)) {
        classifiedTime.push({
          startTime: unclassifiedStart,
          endTime: span.startTime,
          duration: new Decimal(Duration.between(unclassifiedStart, span.startTime).toMinutes()),
          classification: WorkTimeClassification.REGULAR_TIME,
        });
      }

      classifiedTime.push({
        startTime: span.startTime,
        endTime: span.endTime,
        duration: new Decimal(Duration.between(span.startTime, span.endTime).toMinutes()),
        classification: WorkTimeClassification.OVERTIME,
      });
      unclassifiedStart = span.endTime;
    });

    if (unclassifiedStart.isBefore(shift.endTime)) {
      classifiedTime.push({
        startTime: unclassifiedStart,
        endTime: shift.endTime,
        duration: new Decimal(Duration.between(unclassifiedStart, shift.endTime).toMinutes()),
        classification: WorkTimeClassification.REGULAR_TIME,
      });
    }

    return classifiedTime;
  }
}
