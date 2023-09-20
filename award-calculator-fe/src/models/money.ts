import Decimal from 'decimal.js';

export const MONEY_INCREMENTAL_DECIMLAL_PLACES = 4;
export const MONEY_FINAL_DECIMAL_PLACES = 0;
export const MONEY_ROUNDING_MODE = Decimal.ROUND_HALF_EVEN;

/**
 * Monetary amount in AUD cents
 * Precision: 0 decimal places
 */
export type MonetaryAmount = Decimal;

/**
 * Monetary amount in AUD cents
 * Precision: 4 decimal places
 */
export type IncrementalMonetaryAmount = Decimal;

/**
 * Loading rate for pay as a decimal from 0.00 - 2.00
 * Eg. for a 150% time-and-a-half loading, the LoadingRate value would be 1.50
 * Precision: 2 decimal places
 */
export type LoadingRate = Decimal;
