import { AwardPayCalculator } from 'award/AwardPayCalculator';
import { TimeClassifier } from 'award/TimeClassifier';
import { RegularTimePayClassifier } from './payClassifiers/RegularTimePayClassifier';

export const buildRetailAwardCalculator = (): AwardPayCalculator =>
  new AwardPayCalculator(
    new TimeClassifier([]),
    [
      new RegularTimePayClassifier(),
    ],
  );
