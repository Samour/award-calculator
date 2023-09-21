import { AwardPayCalculator } from 'award/AwardPayCalculator';
import { TimeClassifier } from 'award/TimeClassifier';
import { RegularTimePayClassifier } from './payClassifiers/RegularTimePayClassifier';
import { CasualLoadingPayClassifier } from './payClassifiers/CasualLoadingPayClassifier';
import { WeekendPenaltyPayClassifier } from './payClassifiers/WeekendPenaltyPayClassifier';
import { RegularWorkingHoursOvertimeCounter } from './overtimeCounters/RegularWorkingHoursOvertimeCounter';

export const buildRetailAwardCalculator = (): AwardPayCalculator =>
  new AwardPayCalculator(
    new TimeClassifier([
      new RegularWorkingHoursOvertimeCounter(),
    ]),
    [
      new RegularTimePayClassifier(),
      new WeekendPenaltyPayClassifier(),
      new CasualLoadingPayClassifier(),
    ],
  );
