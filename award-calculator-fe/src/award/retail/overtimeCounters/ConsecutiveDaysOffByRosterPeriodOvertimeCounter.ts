import { DateTimeFormatter, ZonedDateTime } from '@js-joda/core';
import { LookAheadOvertimeCounter } from 'award/TimeClassifier';
import { WorkerShift } from 'models/inputs/shift';
import { OvertimeReason } from 'models/outputs/payable';
import { ShiftTimestamp, TimeSpan } from 'models/time';

interface RosterPeriodShifts {
  // Format: YYYY-MM-DD of the first Monday of the fortnight
  rosterPeriod: string;
  // Ordered list of dates (YYYY-MM-DD format) that have a shift on that day
  shiftDates: string[];
}

export class ConsecutiveDaysOffByRosterPeriodOvertimeCounter implements LookAheadOvertimeCounter {

  // Date in YYYY-FF format, where YYYY is the weekyear & FF is the fortnight number
  private readonly overtimeDays: Set<string> = new Set();

  public readonly reason: OvertimeReason = OvertimeReason.CONSECUTIVE_DAYS_OFF;

  public peekShift(shift: WorkerShift): void {
    // console.log(shift);
    console.log({
      date: toDate(shift.startTime),
      isoWeekyear: shift.startTime.toLocalDate().isoWeekyear(),
      isoWeek: shift.startTime.toLocalDate().isoWeekOfWeekyear(),
      isoFortnight: toFortnightKey(shift.startTime),
    });
  }

  public countOvertimeInShift(shift: WorkerShift): TimeSpan[] {
    return [];
  }
}

const toDate = (ts: ShiftTimestamp): string => ts.format(DateTimeFormatter.ISO_LOCAL_DATE);

const toFortnightKey = (ts: ShiftTimestamp): string => {
  const date = ts.toLocalDate();
  return `${date.isoWeekyear()}-${Math.ceil(date.isoWeekOfWeekyear() / 2)}`;
};
