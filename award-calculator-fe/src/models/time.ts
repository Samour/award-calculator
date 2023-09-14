import { ZonedDateTime } from '@js-joda/core';
import Decimal from 'decimal.js';

/**
 * Zoned timestamp used for values such as shift start/end times
 * Timezone will always be the app's global timezone (Australia/Brisbane)
 * Normalised to the nearest minute
 */
export type ShiftTimestamp = ZonedDateTime;

/**
 * Numeric value to represent a number of minutes during a timespan
 * Precision: 2 decimal places
 */
export type IncrementalMinuteDuration = Decimal;
