import { DateTimeFormatter, LocalDate, LocalTime } from '@js-joda/core';
import Decimal from 'decimal.js';
import { MonetaryAmount } from 'models/money';

export type WorkerShiftColumnName = 'employeeCode'
  | 'lastName'
  | 'firstName'
  | 'basePayRate'
  | 'shiftStartDate'
  | 'shiftStartTime'
  | 'shiftEndTime'
  | 'casualLoading';

export interface WorkerShiftRow {
  employeeCode: string,
  lastName: string,
  firstName: string,
  basePayRate: string,
  shiftStartDate: string,
  shiftStartTime: string,
  shiftEndTime: string,
  casualLoading: string,
}

export const translateMonetaryAmount = (basePayRate: string): MonetaryAmount | null => {
  try {
    const parsedAmount = new Decimal(basePayRate.replace('$', ''));
    if (parsedAmount.decimalPlaces() > 2 || parsedAmount < new Decimal('0.01')) {
      return null;
    }

    return parsedAmount.times(new Decimal('100'));
  } catch (e) {
    return null;
  }
};

const selectFormatterForDate = (date: string): DateTimeFormatter => {
  if (/\/[0-9]{4}/.test(date)) {
    return DateTimeFormatter.ofPattern('d/M/yyyy');
  } else {
    return DateTimeFormatter.ofPattern('d/M/yy');
  }
};

export const translateToLocalDate = (date: string): LocalDate | null => {
  try {
    return LocalDate.parse(date, selectFormatterForDate(date));
  } catch (e) {
    return null;
  }
};

export const translateToLocalTime = (time: string): LocalTime | null => {
  try {
    return LocalTime.parse(time);
  } catch (e) {
    return null;
  }
};

export const translateCasualLoading = (casualLoading: string): boolean | null => {
  let normalised = casualLoading.toLocaleLowerCase().trim();
  if (normalised === 'y' || normalised === 'yes' || normalised === 'true') {
    return true;
  } else if (normalised === 'n' || normalised === 'no' || normalised === 'false') {
    return false;
  } else {
    return null;
  }
};
