import { useDispatch, useSelector } from 'react-redux';
import { Dispatch, createSelector } from '@reduxjs/toolkit';
import { setCellValidationMessages } from 'store/shiftEntry';
import strings from 'strings';
import { WorkerShiftColumnName, WorkerShiftRow } from 'models/inputs/table';
import { WorkerCode } from 'models/inputs/worker';
import { MonetaryAmount } from 'models/money';
import { AppState } from 'models/store';
import { ValidatedWorkerShiftRow } from 'models/store/shiftEntry';
import { validatedToWorkerShift } from 'models/converters/workerShift';

interface WorkerDetails {
  lastName: string | null;
  firstName: string | null;
  basePayRate: MonetaryAmount | null;
  casualLoading: boolean;
}

export class ShiftTableValidator {

  constructor(private readonly dispatch: Dispatch, private readonly shifts: WorkerShiftRow[]) { }

  validateShiftRows(): boolean {
    const encounteredWorkers: Map<WorkerCode, WorkerDetails> = new Map();

    var isValid = true;

    this.shifts.map((shift, rowIndex) => {
      const validators: [WorkerShiftColumnName, (value: string) => string[]][] = [
        ['employeeCode', validateEmployeeCode],
        ['lastName', validateLastName],
        ['firstName', validateFirstName],
      ];

      validators.forEach(([columnId, validator]) => {
        const failureMessages = validator(shift[columnId]);
        isValid = isValid && failureMessages.length === 0;

        this.dispatch(setCellValidationMessages({
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

const workerShiftsSelector = (state: AppState): ValidatedWorkerShiftRow[] =>
  state.shiftEntry.rows;

const workerShiftsConverter = (rows: ValidatedWorkerShiftRow[]): WorkerShiftRow[] =>
  rows.map((row) => validatedToWorkerShift(row))
    .slice(0, rows.length - 1);

export const useShiftTableValidator = () => {
  const dispatch = useDispatch();
  const shifts = useSelector(createSelector([workerShiftsSelector], workerShiftsConverter));

  return new ShiftTableValidator(dispatch, shifts);
};
