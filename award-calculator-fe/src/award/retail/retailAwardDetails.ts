import Decimal from 'decimal.js';
import { LoadingClassification } from 'models/outputs/payable';

export const retailAwardDetails = {
  loadings: {
    [LoadingClassification.REGULAR_TIME]: new Decimal('1'),
    [LoadingClassification.CASUAL]: new Decimal('0.25'),
  },
};
