import { DayOfWeek, LocalTime } from '@js-joda/core';
import Decimal from 'decimal.js';
import { LoadingClassification } from 'models/outputs/payable';

const weekdayWorkingHours = {
  startTime: LocalTime.parse('07:00'),
  endTime: LocalTime.parse('21:00'),
};

export const retailAwardDetails = {
  // -- Overtime classification
  regularWorkingHours: {
    [DayOfWeek.MONDAY.name()]: weekdayWorkingHours,
    [DayOfWeek.TUESDAY.name()]: weekdayWorkingHours,
    [DayOfWeek.WEDNESDAY.name()]: weekdayWorkingHours,
    [DayOfWeek.THURSDAY.name()]: weekdayWorkingHours,
    [DayOfWeek.FRIDAY.name()]: weekdayWorkingHours,
    [DayOfWeek.SATURDAY.name()]: {
      startTime: LocalTime.parse('07:00'),
      endTime: LocalTime.parse('18:00'),
    },
    [DayOfWeek.SUNDAY.name()]: {
      startTime: LocalTime.parse('09:00'),
      endTime: LocalTime.parse('18:00'),
    },
  },
  dailyWorkedTime: {
    maxPerDay: new Decimal('540'), // 9 hours
    maxPerDayExempted: new Decimal('660'), // 11 hours
    exemptDaysPerWeek: 1,
  },
  fortnightlyWorkedTime: {
    maxPerFortnight: new Decimal('4560'), // 76 hours
  },
  consecutiveDays: {
    maxConsecutiveDays: 6,
  },
  timeFromPriorDayEnd: {
    minRequiredGap: new Decimal('720'), // 12 hours
  },
  // -- Pay & loadings
  // How long can someone receive time-and-half pay for OT before switching to double time
  // Different threshold per day of week
  doubleTimeThresholds: {
    [DayOfWeek.MONDAY.name()]: new Decimal('180'), // 3 hours
    [DayOfWeek.TUESDAY.name()]: new Decimal('180'), // 3 hours
    [DayOfWeek.WEDNESDAY.name()]: new Decimal('180'), // 3 hours
    [DayOfWeek.THURSDAY.name()]: new Decimal('180'), // 3 hours
    [DayOfWeek.FRIDAY.name()]: new Decimal('180'), // 3 hours
    [DayOfWeek.SATURDAY.name()]: new Decimal('180'), // 3 hours
    [DayOfWeek.SUNDAY.name()]: new Decimal('0'), // All time is double-time
  },
  // Loading rates
  loadings: {
    [LoadingClassification.REGULAR_TIME]: new Decimal('1'),
    [LoadingClassification.TIME_AND_A_HALF]: new Decimal('1.5'),
    [LoadingClassification.DOUBLE_TIME]: new Decimal('2'),
    [LoadingClassification.CASUAL]: new Decimal('0.25'),
    [LoadingClassification.WEEKEND_PENALTY]: {
      [DayOfWeek.SATURDAY.name()]: new Decimal('0.25'),
      [DayOfWeek.SUNDAY.name()]: new Decimal('0.5'),
    },
  },
};
