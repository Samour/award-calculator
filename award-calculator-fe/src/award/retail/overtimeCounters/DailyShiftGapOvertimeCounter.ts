import { Duration, ZonedDateTime } from '@js-joda/core';
import { OvertimeCounter } from 'award/TimeClassifier';
import { WorkerShift } from 'models/inputs/shift';
import { OvertimeReason } from 'models/outputs/payable';
import { TimeSpan, toStartOfDay } from 'models/time';
import { retailAwardDetails } from '../retailAwardDetails';

export class DailyShiftGapOvertimeCounter implements OvertimeCounter {

  private lastShiftEnd?: ZonedDateTime;

  readonly reason: OvertimeReason = OvertimeReason.SHIFT_GAP;

  countOvertimeInShift(shift: WorkerShift): TimeSpan[] {
    if (!this.lastShiftEnd) {
      this.lastShiftEnd = shift.endTime;
      return [];
    }

    // Assumption: shift does not cross days
    const currentWorkDay = toStartOfDay(shift.startTime);
    const lastShiftWorkDay = toStartOfDay(this.lastShiftEnd);
    const dayChange = Duration.between(lastShiftWorkDay, currentWorkDay).toDays();
    const overtimeUntil = this.lastShiftEnd.plusMinutes(
      retailAwardDetails.timeFromPriorDayEnd.minRequiredGap.toNumber(),
    );
    this.lastShiftEnd = shift.endTime;

    if (dayChange !== 1) {
      return [];
    }

    if (overtimeUntil.isAfter(shift.startTime)) {
      return [{
        startTime: shift.startTime,
        endTime: overtimeUntil,
      }];
    } else {
      return [];
    }
  }
}
