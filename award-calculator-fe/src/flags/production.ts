import { FeatureFlags } from './FeatureFlags';

export const productionFlags: FeatureFlags = {
  simulateComputationDelay: 0,
  recordCalculationTiming: false,
  useDummyCalculationResult: false,
  showOvertimeReasonsToggle: false,
};
