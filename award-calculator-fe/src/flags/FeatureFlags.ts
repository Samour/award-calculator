export interface FeatureFlags {
  simulateComputationDelay: number;
  recordCalculationTiming: boolean;
  useDummyCalculationResult: boolean;
  awardRules: {
    retail: {
      consecutiveDaysOffByRosterPeriodOvertimeCounter: boolean;
    };
  };
};
