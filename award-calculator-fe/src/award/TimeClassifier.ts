import { Duration, ZonedDateTime } from '@js-joda/core';
import Decimal from 'decimal.js';
import { WorkerShift } from 'models/inputs/shift';
import { IncrementalMinuteDuration, ShiftTimestamp } from 'models/time';

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

export class TimeClassifier {

  constructor(private readonly overtimeCounters: OvertimeCounter[]) { }

  classifyShift(shift: WorkerShift): ClassifiedWorkedTime[] {
    const overtimeSpans = this.overtimeCounters.map((counter) => counter.countOvertimeInShift(shift))
      .filter((span): span is OvertimeSpan => !!span);
    overtimeSpans.sort((a, b) => a.startTime.compareTo(b.startTime));

    const mergedOvertimeSpans = this.mergeSpans(overtimeSpans);

    const classifiedTime: ClassifiedWorkedTime[] = [];
    let unclassifiedStart = shift.startTime;
    mergedOvertimeSpans.forEach((span) => {
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

  private mergeSpans(overtimeSpans: OvertimeSpan[]): OvertimeSpan[] {
    const mergedSpans: OvertimeSpan[] = [];
    let currentSpan: OvertimeSpan | null = null;

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
}
