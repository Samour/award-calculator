import Decimal from 'decimal.js';
import { MonetaryAmount } from 'models/money';

export const renderAsDollars = (amount: MonetaryAmount): string => {
  return amount.dividedBy(new Decimal('100')).toFixed(2);
};
