import { AwardPayCalculator } from 'award/AwardPayCalculator';
import { TimeClassifier } from 'award/TimeClassifier';

export const buildRetailAwardCalculator = (): AwardPayCalculator =>
  new AwardPayCalculator(
    new TimeClassifier([]),
    [],
  );
