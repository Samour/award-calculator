import { DateTimeFormatter, LocalDate, LocalTime, ZonedDateTime } from '@js-joda/core';
import Decimal from 'decimal.js';
import { MonetaryAmount } from 'models/money';
import { toZonedDateTime } from 'models/time';

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

export const normaliseRow = (workerShiftRow: WorkerShiftRow): WorkerShiftRow => ({
  employeeCode: workerShiftRow.employeeCode.trim(),
  lastName: workerShiftRow.lastName.trim(),
  firstName: workerShiftRow.firstName.trim(),
  basePayRate: workerShiftRow.basePayRate.trim(),
  shiftStartDate: workerShiftRow.shiftStartDate.trim(),
  shiftStartTime: workerShiftRow.shiftStartTime.trim(),
  shiftEndTime: workerShiftRow.shiftEndTime.trim(),
  casualLoading: workerShiftRow.casualLoading.trim(),
});

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
    return LocalTime.parse(time, DateTimeFormatter.ofPattern('H:m'));
  } catch (e) {
    return null;
  }
};

export const translateToDateTime = (date: string, time: string): ZonedDateTime | null => {
  const localDate = translateToLocalDate(date);
  const localTime = translateToLocalTime(time);
  if (!!localDate && !!localTime) {
    return toZonedDateTime(localDate, localTime);
  } else {
    return null;
  }
};

export const translateCasualLoading = (casualLoading: string): boolean | null => {
  let normalised = casualLoading.toLocaleLowerCase();
  if (normalised === 'y' || normalised === 'yes' || normalised === 'true') {
    return true;
  } else if (normalised === 'n' || normalised === 'no' || normalised === 'false') {
    return false;
  } else {
    return null;
  }
};
