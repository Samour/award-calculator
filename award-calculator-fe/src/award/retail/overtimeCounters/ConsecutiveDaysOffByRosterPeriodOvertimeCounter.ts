import { DateTimeFormatter, ZonedDateTime } from '@js-joda/core';
import { LookAheadOvertimeCounter } from 'award/TimeClassifier';
import { WorkerShift } from 'models/inputs/shift';
import { OvertimeReason } from 'models/outputs/payable';
import { ShiftTimestamp, TimeSpan, toWeekOfYear } from 'models/time';

interface RosterPeriodShifts {
  // Format: YYYY-MM-DD of the first Monday of the fortnight
  rosterPeriod: string;
  // Ordered list of dates (YYYY-MM-DD format) that have a shift on that day
  shiftDates: string[];
}

export class ConsecutiveDaysOffByRosterPeriodOvertimeCounter implements LookAheadOvertimeCounter {

  // Date in YYYY-MM-DD format
  private readonly overtimeDays: Set<string> = new Set();

  public readonly reason: OvertimeReason = OvertimeReason.CONSECUTIVE_DAYS_OFF;

  public peekShift(shift: WorkerShift): void {
    console.log(shift);
    console.log(toDate(shift.startTime));
    console.log(toWeekOfYear(shift.startTime));
  }

  public countOvertimeInShift(shift: WorkerShift): TimeSpan[] {
    return [];
  }
}

const toDate = (ts: ShiftTimestamp): string => ts.format(DateTimeFormatter.ISO_LOCAL_DATE);

// const toStartOfFortnight = (ts: ShiftTimestamp): ZonedDateTime => {
//   const firstDayOfWeek = ts.minusDays(ts.dayOfWeek().ordinal() - 1);
//   const weekNumber = Math.floor(firstDayOfWeek.dayOfYear() / 7);
// };
