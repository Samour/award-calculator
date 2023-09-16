import Decimal from 'decimal.js';
import { LoadingRate, MonetaryAmount } from 'models/money';

export const renderAsDollars = (amount: MonetaryAmount, decimalPlaces: number = 2): string => {
  return amount.dividedBy(new Decimal('100')).toFixed(decimalPlaces);
};

export const renderLoadingRate = (loadingRate: LoadingRate): string => {
  return loadingRate.toFixed(2);
};
