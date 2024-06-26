import { DateTimeFormatter, DayOfWeek, Duration, LocalDate, TemporalAdjusters } from '@js-joda/core';
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
    // Assumption: Shift does not cross days
    const rosterPeriod = firstDateOfFortnight(shift.startTime.toLocalDate());
    if (!this.currentPeriod?.rosterPeriod?.equals(rosterPeriod)) {
      this.finalizeCurrentPeriod();
      this.currentPeriod = {
        rosterPeriod,
        shiftDates: [],
      };
    }

    const currentDate = shift.startTime.toLocalDate();
    const mostRecentSeenDate = this.currentPeriod.shiftDates[this.currentPeriod.shiftDates.length - 1];
    if (!mostRecentSeenDate?.equals(currentDate)) {
      this.currentPeriod.shiftDates.push(currentDate);
    }
  }

  public countOvertimeInShift(shift: WorkerShift): TimeSpan[] {
    this.finalizeCurrentPeriod();

    if (this.overtimeDays.has(toDate(shift.startTime))) {
      return [{
        startTime: shift.startTime,
        endTime: shift.endTime,
      }];
    } else {
      return [];
    }
  }

  private finalizeCurrentPeriod(): void {
    if (!this.currentPeriod) {
      return;
    }

    const weeksWithoutBreak = this.calculateWeeksWithoutSufficientBreaks();
    const otDays = weeksWithoutBreakToOTDays(weeksWithoutBreak.size);
    for (let i = otDays; i > 0; i--) {
      const otDay = this.currentPeriod.shiftDates[this.currentPeriod.shiftDates.length - i];
      this.overtimeDays.add(otDay.format(DateTimeFormatter.ISO_LOCAL_DATE));
    }

    this.currentPeriod = undefined;
  }

  private calculateWeeksWithoutSufficientBreaks(): Set<number> {
    if (!this.currentPeriod) {
      return new Set();
    }

    const weeksWithoutBreak = new Set([1, 2]);
    let dateItr = this.currentPeriod.rosterPeriod.minusDays(1);
    let weekNo = 1;
    for (let breakBoundary of this.datesToCalculateBreaks()) {
      if (breakBoundary.dayOfWeek().equals(DayOfWeek.MONDAY)
        && !breakBoundary.equals(this.currentPeriod.rosterPeriod)) {
        weekNo++;
      }

      const breakLength = Duration.between(dateItr.atStartOfDay(), breakBoundary.atStartOfDay()).toDays() - 1;
      if (breakLength >= 3) {
        return new Set();
      } else if (breakLength === 2) {
        weeksWithoutBreak.delete(weekNo);
        if (weekNo === 2) {
          return weeksWithoutBreak;
        }
      }

      dateItr = breakBoundary;
    }

    return weeksWithoutBreak;
  }

  private datesToCalculateBreaks(): LocalDate[] {
    if (!this.currentPeriod) {
      return [];
    }

    const dates = [...this.currentPeriod.shiftDates];
    // Call firstDateOfFortnight in case we're looking at a 1-week fortnight in a leap ISOWeekYear
    const startOfNextFortnight = firstDateOfFortnight(this.currentPeriod.rosterPeriod.plusWeeks(2));
    dates.push(startOfNextFortnight);

    return dates;
  }
}

const toDate = (ts: ShiftTimestamp): string => ts.format(DateTimeFormatter.ISO_LOCAL_DATE);

// We need to use the full date because js-jode doesn't expose methods to convert from
// ISOWeekYear attributes -> LocalDate
const firstDateOfFortnight = (date: LocalDate): LocalDate => {
  const startOfWeek = date.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
  if (startOfWeek.isoWeekOfWeekyear() % 2 === 0) {
    return startOfWeek.minusWeeks(1);
  } else {
    return startOfWeek;
  }
};

const weeksWithoutBreakToOTDays = (weeksWithoutBreak: number): number => {
  switch (weeksWithoutBreak) {
    case 2: return 3;
    case 1: return 1;
    default: return 0;
  }
};
