import { DayOfWeek } from '@js-joda/core';
import Decimal from 'decimal.js';
import { LoadingClassification } from 'models/outputs/payable';

export const retailAwardDetails = {
  loadings: {
    [LoadingClassification.REGULAR_TIME]: new Decimal('1'),
    [LoadingClassification.CASUAL]: new Decimal('0.25'),
    [LoadingClassification.WEEKEND_PENALTY]: {
      [DayOfWeek.SATURDAY.name()]: new Decimal('0.25'),
      [DayOfWeek.SUNDAY.name()]: new Decimal('0.5'),
    },
  },
};
