import { FeatureFlags } from './FeatureFlags';

export const productionFlags: FeatureFlags = {
  simulateComputationDelay: 0,
  recordCalculationTiming: false,
  useDummyCalculationResult: false,
  awardRules: {
    retail: {
      consecutiveDaysOffByRosterPeriodOvertimeCounter: false,
    },
  },
};
