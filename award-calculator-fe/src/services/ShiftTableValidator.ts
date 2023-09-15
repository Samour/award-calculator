import { useStore } from 'react-redux';
import { Store } from '@reduxjs/toolkit';
import Decimal from 'decimal.js';
import { setCellValidationMessages } from 'store/shiftEntry';
import strings from 'strings';
import {
  WorkerShiftColumnName,
  WorkerShiftRow,
  translateCasualLoading,
  translateToLocalDate,
  translateToLocalTime,
} from 'models/inputs/table';
// import { WorkerCode } from 'models/inputs/worker';
// import { MonetaryAmount } from 'models/money';
import { AppState } from 'models/store';
import { validatedToWorkerShift } from 'models/converters/workerShift';

// interface WorkerDetails {
//   lastName: string | null;
//   firstName: string | null;
//   basePayRate: MonetaryAmount | null;
//   casualLoading: boolean;
// }

export class ShiftTableValidator {

  constructor(private readonly store: Store<AppState>) { }

  private getShiftsFromStore(): WorkerShiftRow[] {
    const rows = this.store.getState().shiftEntry.rows
    return rows.map((row) => validatedToWorkerShift(row))
      .slice(0, rows.length - 1);
  }

  validateShiftRows(): boolean {
    // const encounteredWorkers: Map<WorkerCode, WorkerDetails> = new Map();

    let isValid = true;

    this.getShiftsFromStore().forEach((shift, rowIndex) => {
      const validators: [WorkerShiftColumnName, (value: string) => string[]][] = [
        ['employeeCode', validateEmployeeCode],
        ['lastName', validateLastName],
        ['firstName', validateFirstName],
        ['basePayRate', validateBasePayRate],
        ['shiftStartDate', validateShiftStartDate],
        ['shiftStartTime', validateShiftStartTime],
        ['shiftEndTime', validateShiftEndTime],
        ['casualLoading', validateCasualLoading],
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

const validateLastName = (lastName: string): string[] => {
  if (lastName.length < 1) {
    return [strings.validations.workerShiftEntry.lastName.tooShort];
  } else {
    return [];
  }
};

const validateFirstName = (firstName: string): string[] => {
  if (firstName.length < 1) {
    return [strings.validations.workerShiftEntry.firstName.tooShort];
  } else {
    return [];
  }
};

const validateBasePayRate = (basePayRate: string): string[] => {
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

  return failures;
};

const validateShiftStartDate = (shiftStartDate: string): string[] => {
  if (!/^[0-9]{1,2}\/[0-9]{1,2}\/([0-9]{2}|[0-9]{4})$/.test(shiftStartDate)) {
    return [strings.validations.workerShiftEntry.shiftStartDate.illegalFormat];
  }

  if (translateToLocalDate(shiftStartDate) === null) {
    return [strings.validations.workerShiftEntry.shiftStartDate.invalidDate];
  } else {
    return [];
  }
};

const validateShiftStartTime = (shiftStartTime: string): string[] => {
  if (!/^[0-9]{2}:[0-9]{2}$/.test(shiftStartTime)) {
    return [strings.validations.workerShiftEntry.shiftStartTime.illegalFormat];
  }

  if (translateToLocalTime(shiftStartTime) === null) {
    return [strings.validations.workerShiftEntry.shiftStartTime.invalidTime];
  } else {
    return [];
  }
};

const validateShiftEndTime = (shiftEndTime: string): string[] => {
  if (!/^[0-9]{2}:[0-9]{2}$/.test(shiftEndTime)) {
    return [strings.validations.workerShiftEntry.shiftEndTime.illegalFormat];
  }

  if (translateToLocalTime(shiftEndTime) === null) {
    return [strings.validations.workerShiftEntry.shiftEndTime.invalidTime];
  } else {
    return [];
  }
};

const validateCasualLoading = (casualLoading: string): string[] => {
  if (translateCasualLoading(casualLoading) === null) {
    return [strings.validations.workerShiftEntry.casualLoading.illegalValue];
  } else {
    return [];
  }
};

export const useShiftTableValidator = () => {
  const store = useStore<AppState>();

  return new ShiftTableValidator(store);
};
