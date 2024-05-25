import { LocalTime, ZonedDateTime } from '@js-joda/core';
import { OvertimeCounter } from 'award/TimeClassifier';
import { WorkerShift } from 'models/inputs/shift';
import { OvertimeReason } from 'models/outputs/payable';
import { TimeSpan } from 'models/time';
import { retailAwardDetails } from '../retailAwardDetails';

export class RegularWorkingHoursOvertimeCounter implements OvertimeCounter {

  readonly reason: OvertimeReason = OvertimeReason.WORKING_HOURS;

  countOvertimeInShift(shift: WorkerShift): TimeSpan[] {
    // Assumption: shift does not cross days
    const dayOfWeek = shift.startTime.dayOfWeek();
    const regularWorkingHours = retailAwardDetails.regularWorkingHours[dayOfWeek.name()];

    const toZonedDateTime = (localTime: LocalTime): ZonedDateTime => localTime
      .atDate(shift.startTime.toLocalDate())
      .atZone(shift.startTime.zone());
    
    const regularStartTime = toZonedDateTime(regularWorkingHours.startTime);
    const regularEndTime = toZonedDateTime(regularWorkingHours.endTime);

    const overtimeSpans: TimeSpan[] = [];
    if (shift.startTime.isBefore(regularStartTime)) {
      overtimeSpans.push({
        startTime: shift.startTime,
        endTime: regularStartTime,
      });
    }

    if (regularEndTime.isBefore(shift.endTime)) {
      overtimeSpans.push({
        startTime: regularEndTime,
        endTime: shift.endTime,
      });
    }

    return overtimeSpans;
  }
}
