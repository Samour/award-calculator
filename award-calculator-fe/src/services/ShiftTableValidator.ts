import { useStore } from 'react-redux';
import { Store } from '@reduxjs/toolkit';
import { setCellValidationMessages } from 'store/shiftEntry';
import strings from 'strings';
import { WorkerShiftColumnName, WorkerShiftRow } from 'models/inputs/table';
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

    var isValid = true;

    this.getShiftsFromStore().forEach((shift, rowIndex) => {
      const validators: [WorkerShiftColumnName, (value: string) => string[]][] = [
        ['employeeCode', validateEmployeeCode],
        ['lastName', validateLastName],
        ['firstName', validateFirstName],
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

export const useShiftTableValidator = () => {
  const store = useStore<AppState>();

  return new ShiftTableValidator(store);
};
