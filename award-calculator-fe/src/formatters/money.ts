import Decimal from 'decimal.js';

export const renderAsDollars = (amount: string, decimalPlaces: number = 2): string => {
  return new Decimal(amount).dividedBy(new Decimal('100')).toFixed(decimalPlaces);
};

export const renderLoadingRate = (loadingRate: string): string => {
  return new Decimal(loadingRate).toFixed(2);
};
