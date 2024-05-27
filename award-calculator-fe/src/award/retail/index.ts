import { AwardPayCalculator } from 'award/AwardPayCalculator';
import { LookAheadOvertimeCounter, TimeClassifier } from 'award/TimeClassifier';
import flags from 'flags';
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

export const buildRetailAwardCalculator = (): AwardPayCalculator => {
  const lookAheadOvertimeCounters: LookAheadOvertimeCounter[] = [];
  if (flags.awardRules.retail.consecutiveDaysOffByRosterPeriodOvertimeCounter) {
    lookAheadOvertimeCounters.push(new ConsecutiveDaysOffByRosterPeriodOvertimeCounter());
  }

  return new AwardPayCalculator(
    new TimeClassifier(
      lookAheadOvertimeCounters,
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
};
