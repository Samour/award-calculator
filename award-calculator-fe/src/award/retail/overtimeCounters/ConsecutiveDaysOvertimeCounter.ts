import { Duration, ZonedDateTime } from '@js-joda/core';
import { OvertimeCounter } from 'award/TimeClassifier';
import { WorkerShift } from 'models/inputs/shift';
import { OvertimeReason } from 'models/outputs/payable';
import { TimeSpan, toStartOfDay } from 'models/time';
import { retailAwardDetails } from '../retailAwardDetails';

export class ConsecutiveDaysOvertimeCounter implements OvertimeCounter {

  private currentWorkDay?: ZonedDateTime;
  private consecutiveWorkedDaysCount: number = 1;

  readonly reason: OvertimeReason = OvertimeReason.CONSECUTIVE_DAYS;

  countOvertimeInShift(shift: WorkerShift): TimeSpan[] {
    // Assumption: shift does not cross days
    const currentWorkDay = toStartOfDay(shift.startTime);
    if (!!this.currentWorkDay) {
      const dayChange = Duration.between(this.currentWorkDay, currentWorkDay).toDays();
      if (dayChange === 1) {
        this.consecutiveWorkedDaysCount++;
      } else if (dayChange > 1) {
        this.consecutiveWorkedDaysCount = 1;
      }
    }

    this.currentWorkDay = currentWorkDay;

    if (this.consecutiveWorkedDaysCount > retailAwardDetails.consecutiveDays.maxConsecutiveDays) {
      return [{
        startTime: shift.startTime,
        endTime: shift.endTime,
      }];
    } else {
      return [];
    }
  }
}
