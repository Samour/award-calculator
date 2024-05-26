import { AwardPayCalculator } from 'award/AwardPayCalculator';
import { TimeClassifier } from 'award/TimeClassifier';
import { RegularTimePayClassifier } from './payClassifiers/RegularTimePayClassifier';
import { CasualLoadingPayClassifier } from './payClassifiers/CasualLoadingPayClassifier';
import { WeekendPenaltyPayClassifier } from './payClassifiers/WeekendPenaltyPayClassifier';
import { RegularWorkingHoursOvertimeCounter } from './overtimeCounters/RegularWorkingHoursOvertimeCounter';
import { OvertimePayClassifier } from './payClassifiers/OvertimePayClassifier';
import { DailyOvertimeCounter } from './overtimeCounters/DailyOvertimeCounter';
import { FortnightlyOvertimeCounter } from './overtimeCounters/FortnightlyOvertimeCounter';
import { ConsecutiveDaysOvertimeCounter } from './overtimeCounters/ConsecutiveDaysOvertimeCounter';
import { DailyShiftGapOvertimeCounter } from './overtimeCounters/DailyShiftGapOvertimeCounter';
import { ConsecutiveDaysOffByRosterPeriodOvertimeCounter } from './overtimeCounters/ConsecutiveDaysOffByRosterPeriodOvertimeCounter';

export const buildRetailAwardCalculator = (): AwardPayCalculator =>
  new AwardPayCalculator(
    new TimeClassifier(
      [new ConsecutiveDaysOffByRosterPeriodOvertimeCounter()],
      [
        new RegularWorkingHoursOvertimeCounter(),
        new DailyOvertimeCounter(),
        new FortnightlyOvertimeCounter(),
        new ConsecutiveDaysOvertimeCounter(),
        new DailyShiftGapOvertimeCounter(),
      ],
    ),
    [
      new RegularTimePayClassifier(),
      new OvertimePayClassifier(),
      new WeekendPenaltyPayClassifier(),
      new CasualLoadingPayClassifier(),
    ],
  );
