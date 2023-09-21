import { FeatureFlags } from './FeatureFlags';

export const developmentFlags: FeatureFlags = {
  simulateComputationDelay: 0,
  recordCalculationTiming: true,
  useDummyCalculationResult: false,
};
