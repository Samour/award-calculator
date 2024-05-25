import { Duration, LocalDate } from '@js-joda/core';
import Decimal from 'decimal.js';
import { OvertimeCounter } from 'award/TimeClassifier';
import { WorkerShift } from 'models/inputs/shift';
import { OvertimeReason } from 'models/outputs/payable';
import { IncrementalMinuteDuration, TimeSpan } from 'models/time';
import { retailAwardDetails } from '../retailAwardDetails';

export class DailyOvertimeCounter implements OvertimeCounter {

  private exemptDaysRemaining: number = retailAwardDetails.dailyWorkedTime.exemptDaysPerWeek;
  private currentDay?: LocalDate;
  private timeWorkedInCurrentDay: IncrementalMinuteDuration = new Decimal('0');

  readonly reason: OvertimeReason = OvertimeReason.DAILY_HOURS;

  countOvertimeInShift(shift: WorkerShift): TimeSpan[] {
    // ISO week of year is Monday-based
    // TODO could also check currentDay.year as well - in case the days are exactly 1 year apart
    if (shift.startTime.toLocalDate().isoWeekOfWeekyear() !== this.currentDay?.isoWeekOfWeekyear()) {
      this.exemptDaysRemaining = retailAwardDetails.dailyWorkedTime.exemptDaysPerWeek;
      this.timeWorkedInCurrentDay = new Decimal('0');
      this.currentDay = shift.startTime.toLocalDate();
    } else if (!shift.startTime.toLocalDate().equals(this.currentDay)) {
      if (this.timeWorkedInCurrentDay.greaterThan(retailAwardDetails.dailyWorkedTime.maxPerDay)) {
        this.exemptDaysRemaining--;
      }
      this.timeWorkedInCurrentDay = new Decimal('0');
      this.currentDay = shift.startTime.toLocalDate();
    }

    const remainingRegularTime = this.remainingRegularTime();
    const duration = new Decimal(Duration.between(shift.startTime, shift.endTime).toMinutes());
    const shiftOvertime = duration.minus(remainingRegularTime);

    this.timeWorkedInCurrentDay = this.timeWorkedInCurrentDay.plus(duration);

    if (shiftOvertime.greaterThan(0)) {
      return [{
        startTime: shift.endTime.minusMinutes(shiftOvertime.toNumber()),
        endTime: shift.endTime,
      }];
    } else {
      return [];
    }
  }

  private remainingRegularTime(): IncrementalMinuteDuration {
    const totalRegularHoursForDay = this.exemptDaysRemaining > 0 ?
      retailAwardDetails.dailyWorkedTime.maxPerDayExempted :
      retailAwardDetails.dailyWorkedTime.maxPerDay;

    return Decimal.max(totalRegularHoursForDay.minus(this.timeWorkedInCurrentDay), new Decimal('0'));
  }
}
