import { LocalTime, ZonedDateTime } from '@js-joda/core';
import { OvertimeCounter } from 'award/TimeClassifier';
import { WorkerShift } from 'models/inputs/shift';
import { TimeSpan } from 'models/time';
import { retailAwardDetails } from '../retailAwardDetails';

export class RegularWorkingHoursOvertimeCounter implements OvertimeCounter {
  
  countOvertimeInShift(shift: WorkerShift): TimeSpan[] {
    // Assumption: shift does not cross days
    const dayOfWeek = shift.startTime.dayOfWeek();
    const regularWorkingHours = retailAwardDetails.regularWorkingHours[dayOfWeek.name()];

    const toZonedDateTime = (localTime: LocalTime): ZonedDateTime => localTime
      .atDate(shift.startTime.toLocalDate())
      .atZone(shift.startTime.zone());

    const overtimeSpans: TimeSpan[] = [];
    let timeCursor = shift.startTime.toLocalTime();

    if (timeCursor.isBefore(regularWorkingHours.startTime)) {
      overtimeSpans.push({
        startTime: shift.startTime,
        endTime: toZonedDateTime(regularWorkingHours.startTime),
      });
      timeCursor = regularWorkingHours.endTime;
    }

    if (timeCursor.isBefore(shift.endTime.toLocalTime())) {
      overtimeSpans.push({
        startTime: toZonedDateTime(timeCursor),
        endTime: shift.endTime,
      });
    }

    return overtimeSpans;
  }
}
