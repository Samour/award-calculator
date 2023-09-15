import { useStore } from 'react-redux';
import { Store } from '@reduxjs/toolkit';
import Decimal from 'decimal.js';
import { setCellValidationMessages } from 'store/shiftEntry';
import strings from 'strings';
import {
  WorkerShiftColumnName,
  WorkerShiftRow,
  translateCasualLoading,
  translateMonetaryAmount,
  translateToLocalDate,
  translateToLocalTime,
} from 'models/inputs/table';
import { WorkerCode } from 'models/inputs/worker';
import { MonetaryAmount } from 'models/money';
import { AppState } from 'models/store';
import { validatedToWorkerShift } from 'models/converters/workerShift';
import { LocalDate, LocalTime, ZonedDateTime } from '@js-joda/core';
import { toZonedDateTime } from 'models/time';

interface WorkerDetails {
  lastName: string | null;
  firstName: string | null;
  basePayRate: MonetaryAmount | null;
  casualLoading: boolean | null;
}

export class ShiftTableValidator {

  constructor(private readonly store: Store<AppState>) { }

  private getShiftsFromStore(): WorkerShiftRow[] {
    const rows = this.store.getState().shiftEntry.rows
    return rows.map((row) => validatedToWorkerShift(row))
      .slice(0, rows.length - 1);
  }

  validateShiftRows(): boolean {
    const encounteredWorkers: Map<WorkerCode, WorkerDetails> = new Map();

    let isValid = true;

    this.getShiftsFromStore().forEach((shift, rowIndex) => {
      const parsedShiftStartDate = translateToLocalDate(shift.shiftStartDate);
      const parsedShiftStartTime = translateToLocalTime(shift.shiftStartTime);
      const parsedShiftEndTime = translateToLocalTime(shift.shiftEndTime);
      const parsedBasePayRate = translateMonetaryAmount(shift.basePayRate);
      const parsedCasualLoading = translateCasualLoading(shift.casualLoading);

      const zonedShiftStartTime = parsedShiftStartDate && parsedShiftStartTime &&
        toZonedDateTime(parsedShiftStartDate, parsedShiftStartTime);
      const zonedShiftEndTime = parsedShiftStartDate && parsedShiftEndTime &&
        toZonedDateTime(parsedShiftStartDate, parsedShiftEndTime);

      const existingWorker = encounteredWorkers.get(shift.employeeCode);

      const validators: [WorkerShiftColumnName, (value: string) => string[]][] = [
        ['employeeCode', validateEmployeeCode],
        ['lastName', validateLastName(existingWorker)],
        ['firstName', validateFirstName(existingWorker)],
        ['basePayRate', validateBasePayRate(existingWorker, parsedBasePayRate)],
        ['shiftStartDate', validateShiftStartDate(parsedShiftStartDate)],
        ['shiftStartTime', validateShiftStartTime(parsedShiftStartTime)],
        ['shiftEndTime', validateShiftEndTime(parsedShiftEndTime, zonedShiftStartTime, zonedShiftEndTime)],
        ['casualLoading', validateCasualLoading(existingWorker, parsedCasualLoading)],
      ];

      validators.forEach(([columnId, validator]) => {
        const failureMessages = validator(shift[columnId]);
        isValid = isValid && failureMessages.length === 0;

        this.store.dispatch(setCellValidationMessages({
          cellIdentifier: {
            rowIndex,
            columnId,
          },
          failureMessages: failureMessages,
        }));
      });

      if (existingWorker) {
        existingWorker.lastName = existingWorker.lastName || shift.lastName;
        existingWorker.firstName = existingWorker.firstName || shift.firstName;
        existingWorker.basePayRate = existingWorker.basePayRate || parsedBasePayRate;
        existingWorker.casualLoading = existingWorker.casualLoading === null ? parsedCasualLoading :
          existingWorker.casualLoading;
      } else if (shift.employeeCode) {
        encounteredWorkers.set(shift.employeeCode, {
          lastName: shift.lastName,
          firstName: shift.firstName,
          basePayRate: parsedBasePayRate,
          casualLoading: parsedCasualLoading,
        });
      }
    });

    return isValid;
  }
}

const validateEmployeeCode = (employeeCode: string): string[] => {
  if (employeeCode.length < 1) {
    return [strings.validations.workerShiftEntry.employeeCode.tooShort];
  } else if (!/^[a-zA-Z0-9]+$/.test(employeeCode)) {
    return [strings.validations.workerShiftEntry.employeeCode.illegalChars];
  } else {
    return [];
  }
};

const validateLastName = (existingWorker: WorkerDetails | undefined) => (lastName: string): string[] => {
  if (lastName.length < 1) {
    return [strings.validations.workerShiftEntry.lastName.tooShort];
  } else if (!!existingWorker?.lastName && existingWorker.lastName !== lastName) {
    return [strings.validations.workerShiftEntry.lastName.doesNotMatchPriorEntry];
  } else {
    return [];
  }
};

const validateFirstName = (existingWorker: WorkerDetails | undefined) => (firstName: string): string[] => {
  if (firstName.length < 1) {
    return [strings.validations.workerShiftEntry.firstName.tooShort];
  } else if (!!existingWorker?.firstName && existingWorker.firstName !== firstName) {
    return [strings.validations.workerShiftEntry.lastName.doesNotMatchPriorEntry];
  } else {
    return [];
  }
};

const validateBasePayRate = (existingWorker: WorkerDetails | undefined, parsedBasePayRate: MonetaryAmount | null) =>
  (basePayRate: string): string[] => {
    if (!/^\$?[0-9]+(\.[0-9]+)?$/.test(basePayRate)) {
      return [strings.validations.workerShiftEntry.basePayRate.illegalFormat];
    }

    const failures: string[] = [];
    const parsedAmount = new Decimal(basePayRate.replace('$', ''));
    if (parsedAmount.decimalPlaces() > 2) {
      failures.push(strings.validations.workerShiftEntry.basePayRate.illegalPrecision);
    }
    if (parsedAmount < new Decimal('0.01')) {
      failures.push(strings.validations.workerShiftEntry.basePayRate.tooLow);
    }

    if (!!existingWorker?.basePayRate && parsedBasePayRate && !existingWorker.basePayRate.equals(parsedBasePayRate)) {
      failures.push(strings.validations.workerShiftEntry.basePayRate.doesNotMatchPriorEntry);
    }

    return failures;
  };

const validateShiftStartDate = (parsedShiftStartDate: LocalDate | null) => (shiftStartDate: string): string[] => {
  if (!/^[0-9]{1,2}\/[0-9]{1,2}\/([0-9]{2}|[0-9]{4})$/.test(shiftStartDate)) {
    return [strings.validations.workerShiftEntry.shiftStartDate.illegalFormat];
  }

  if (parsedShiftStartDate === null) {
    return [strings.validations.workerShiftEntry.shiftStartDate.invalidDate];
  } else {
    return [];
  }
};

const validateShiftStartTime = (parsedShiftStartTime: LocalTime | null) =>
  (shiftStartTime: string): string[] => {
    if (!/^[0-9]{2}:[0-9]{2}$/.test(shiftStartTime)) {
      return [strings.validations.workerShiftEntry.shiftStartTime.illegalFormat];
    }

    if (parsedShiftStartTime === null) {
      return [strings.validations.workerShiftEntry.shiftStartTime.invalidTime];
    } else {
      return [];
    }
  };

const validateShiftEndTime = (parsedShiftEndTime: LocalTime | null, shiftStartTime: ZonedDateTime | null,
  zonedShiftEndTime: ZonedDateTime | null) => (shiftEndTime: string): string[] => {
    if (!/^[0-9]{2}:[0-9]{2}$/.test(shiftEndTime)) {
      return [strings.validations.workerShiftEntry.shiftEndTime.illegalFormat];
    }

    if (parsedShiftEndTime === null) {
      return [strings.validations.workerShiftEntry.shiftEndTime.invalidTime];
    }

    if (!!shiftStartTime && !!zonedShiftEndTime && !shiftStartTime.isBefore(zonedShiftEndTime)) {
      return [strings.validations.workerShiftEntry.shiftEndTime.beforeShiftStart];
    }

    return [];
  };

const validateCasualLoading = (existingWorker: WorkerDetails | undefined, parsedCasualLoading: boolean | null) =>
  (casualLoading: string): string[] => {
    if (parsedCasualLoading === null) {
      return [strings.validations.workerShiftEntry.casualLoading.illegalValue];
    } else if (!!existingWorker && existingWorker.casualLoading !== null
      && existingWorker.casualLoading !== parsedCasualLoading) {
      return [strings.validations.workerShiftEntry.casualLoading.doesNotMatchPriorEntry];
    } else {
      return [];
    }
  };

export const useShiftTableValidator = () => {
  const store = useStore<AppState>();

  return new ShiftTableValidator(store);
};
