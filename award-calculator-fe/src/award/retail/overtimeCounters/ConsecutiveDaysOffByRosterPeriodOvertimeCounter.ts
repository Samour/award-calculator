import { DateTimeFormatter, DayOfWeek, LocalDate, TemporalAdjusters } from '@js-joda/core';
import { LookAheadOvertimeCounter } from 'award/TimeClassifier';
import { WorkerShift } from 'models/inputs/shift';
import { OvertimeReason } from 'models/outputs/payable';
import { ShiftTimestamp, TimeSpan } from 'models/time';

interface RosterPeriodShifts {
  // Date of the first Monday of the fortnight
  rosterPeriod: LocalDate;
  // Ordered list of dates that have a shift on that day
  shiftDates: LocalDate[];
}

export class ConsecutiveDaysOffByRosterPeriodOvertimeCounter implements LookAheadOvertimeCounter {

  private currentPeriod?: RosterPeriodShifts;
  // Date in YYYY-MM-DD format
  private readonly overtimeDays: Set<string> = new Set();

  public readonly reason: OvertimeReason = OvertimeReason.CONSECUTIVE_DAYS_OFF;

  public peekShift(shift: WorkerShift): void {
    const fortnightStart = firstDateOfFortnight(shift.startTime);
    console.log({
      date: toDate(shift.startTime),
      isoWeekyear: shift.startTime.toLocalDate().isoWeekyear(),
      isoWeek: shift.startTime.toLocalDate().isoWeekOfWeekyear(),
      fortnightStart: fortnightStart.format(DateTimeFormatter.ISO_LOCAL_DATE),
    });

    // Assumption: Shift does not cross days
    const rosterPeriod = firstDateOfFortnight(shift.startTime);
    if (!this.currentPeriod?.rosterPeriod?.equals(rosterPeriod)) {
      this.finalizeCurrentPeriod();
      this.currentPeriod = {
        rosterPeriod,
        shiftDates: [],
      };
    }

    if (this.currentPeriod.shiftDates[this.currentPeriod.shiftDates.length - 1]?.equals(shift.startTime.toLocalDate())) {
      this.currentPeriod.shiftDates.push(shift.startTime.toLocalDate());
    }
  }

  public countOvertimeInShift(shift: WorkerShift): TimeSpan[] {
    return [];
  }

  private finalizeCurrentPeriod(): void {
    if (!this.currentPeriod) {
      return;
    }
    // TODO update this.overtimeDays

    this.currentPeriod = undefined;
  }
}

const toDate = (ts: ShiftTimestamp): string => ts.format(DateTimeFormatter.ISO_LOCAL_DATE);

// We need to use the full date because js-jode doesn't expose methods to convert from
// ISOWeekYear attributes -> LocalDate
const firstDateOfFortnight = (ts: ShiftTimestamp): LocalDate => {
  const date = ts.toLocalDate().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
  if (date.isoWeekOfWeekyear() % 2 === 0) {
    return date.minusWeeks(1);
  } else {
    return date;
  }
};
