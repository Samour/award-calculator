import { DayOfWeek, LocalTime } from '@js-joda/core';
import Decimal from 'decimal.js';
import { LoadingClassification } from 'models/outputs/payable';

const weekdayWorkingHours = {
  startTime: LocalTime.parse('07:00'),
  endTime: LocalTime.parse('21:00'),
};

export const retailAwardDetails = {
  loadings: {
    [LoadingClassification.REGULAR_TIME]: new Decimal('1'),
    [LoadingClassification.CASUAL]: new Decimal('0.25'),
    [LoadingClassification.WEEKEND_PENALTY]: {
      [DayOfWeek.SATURDAY.name()]: new Decimal('0.25'),
      [DayOfWeek.SUNDAY.name()]: new Decimal('0.5'),
    },
  },
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
};
