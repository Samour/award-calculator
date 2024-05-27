import { LocalDate, LocalTime, ZoneId, ZonedDateTime } from '@js-joda/core';
import Decimal from 'decimal.js';

require("@js-joda/timezone");

export const APP_TIME_ZONE = 'Australia/Brisbane';

export const MINUTES_IN_HOUR = new Decimal('60');

/**
 * Zoned timestamp used for values such as shift start/end times
 * Timezone will always be the app's global timezone (Australia/Brisbane)
 * Normalised to the nearest minute
 */
export type ShiftTimestamp = ZonedDateTime;

/**
 * Numeric value to represent a number of minutes during a timespan
 * Precision: 0 decimal places
 */
export type IncrementalMinuteDuration = Decimal;

export interface TimeSpan {
  startTime: ZonedDateTime;
  endTime: ZonedDateTime;
}

export const comparingTime = (first: TimeSpan, second: TimeSpan): number => {
  if (first.startTime.isEqual(second.startTime)) {
    return first.endTime.compareTo(second.endTime);
  } else {
    return first.startTime.compareTo(second.startTime);
  }
};

export const toZonedDateTime = (localDate: LocalDate, localTime: LocalTime): ZonedDateTime => {
  return localDate.atTime(localTime).atZone(ZoneId.of(APP_TIME_ZONE));
};

export const toStartOfDay = (zonedDateTime: ZonedDateTime): ZonedDateTime => zonedDateTime
  .toLocalDate()
  .atStartOfDay()
  .atZone(zonedDateTime.zone());
