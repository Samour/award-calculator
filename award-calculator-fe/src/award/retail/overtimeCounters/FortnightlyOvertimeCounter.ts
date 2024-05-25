import { Duration } from '@js-joda/core';
import Decimal from 'decimal.js';
import { OvertimeCounter } from 'award/TimeClassifier';
import { WorkerShift } from 'models/inputs/shift';
import { OvertimeReason } from 'models/outputs/payable';
import { IncrementalMinuteDuration, TimeSpan } from 'models/time';
import { retailAwardDetails } from '../retailAwardDetails';

export class FortnightlyOvertimeCounter implements OvertimeCounter {

  // Fortnight = ISO WeekOfWeekyear / 2
  private currentFortnight?: number;
  private timeWorked: IncrementalMinuteDuration = new Decimal('0');

  readonly reason: OvertimeReason = OvertimeReason.FORTNIGHTLY_HOURS;

  countOvertimeInShift(shift: WorkerShift): TimeSpan[] {
    // Assumption: shift does not cross days
    const shiftFortnight = Math.floor(shift.startTime.toLocalDate().isoWeekOfWeekyear() / 2);
    if (this.currentFortnight !== shiftFortnight) {
      this.currentFortnight = shiftFortnight;
      this.timeWorked = new Decimal('0');
    }

    const remainingRegularTime = Decimal.max(
      retailAwardDetails.fortnightlyWorkedTime.maxPerFortnight.minus(this.timeWorked),
      new Decimal('0'),
    );
    const duration = new Decimal(Duration.between(shift.startTime, shift.endTime).toMinutes());
    const shiftOvertime = duration.minus(remainingRegularTime);
    this.timeWorked = this.timeWorked.plus(duration);

    if (shiftOvertime.greaterThan(0)) {
      return [{
        startTime: shift.endTime.minusMinutes(shiftOvertime.toNumber()),
        endTime: shift.endTime,
      }];
    } else {
      return [];
    }
  }
}
