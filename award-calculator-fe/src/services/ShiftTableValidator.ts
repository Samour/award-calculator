import { useDispatch, useSelector } from 'react-redux';
import { Dispatch, createSelector } from '@reduxjs/toolkit';
import { setCellValidationMessages } from 'store/reducers/shiftEntry';
import { WorkerShiftColumnName, WorkerShiftRow } from 'models/inputs/table';
import { WorkerCode } from 'models/inputs/worker';
import { MonetaryAmount } from 'models/money';
import { AppState } from 'models/store';
import { ValidatedWorkerShiftRow } from 'models/store/shiftEntry';

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
    return ['Employee code must have at least 1 character'];
  } else if (!/^[a-zA-Z0-9]+$/.test(employeeCode)) {
    return ['Employee code must only consist of alphabetic (a-z or A-Z) and numeric (0-9) characters'];
  } else {
    return [];
  }
};

const validateLastName = (lastName: string): string[] => {
  if (lastName.length < 1) {
    return ['Last name must have at least 1 character'];
  } else {
    return [];
  }
};

const validateFirstName = (firstName: string): string[] => {
  if (firstName.length < 1) {
    return ['First name must have at least 1 character'];
  } else {
    return [];
  }
};

const workerShiftsSelector = (state: AppState): ValidatedWorkerShiftRow[] =>
  state.shiftEntry.rows;

const workerShiftsConverter = (rows: ValidatedWorkerShiftRow[]): WorkerShiftRow[] =>
  rows.map((row) => ({
    employeeCode: row.employeeCode.value,
    lastName: row.lastName.value,
    firstName: row.firstName.value,
    basePayRate: row.basePayRate.value,
    shiftStartDate: row.shiftStartDate.value,
    shiftStartTime: row.shiftStartTime.value,
    shiftEndTime: row.shiftEndTime.value,
    casualLoading: row.casualLoading.value,
  })).slice(0, rows.length - 1);

export const useShiftTableValidator = () => {
  const dispatch = useDispatch();
  const shifts = useSelector(createSelector([workerShiftsSelector], workerShiftsConverter));

  return new ShiftTableValidator(dispatch, shifts);
};
