import { WorkerShiftRow } from 'models/inputs/table';
import { WorkerCode } from 'models/inputs/worker';
import { MonetaryAmount } from 'models/money';
import { ValidatedWorkerShiftRow } from 'models/store/shiftEntry';

interface WorkerDetails {
  lastName: string | null;
  firstName: string | null;
  basePayRate: MonetaryAmount | null;
  casualLoading: boolean;
}

export class ShiftTableValidator {
  validateShiftRows(shifts: WorkerShiftRow[]): ValidatedWorkerShiftRow[] {
    const encounteredWorkers: Map<WorkerCode, WorkerDetails> = new Map();

    return shifts.map((shift) => {
      return {
        employeeCode: {
          value: shift.employeeCode,
          failureMessages: validateEmployeeCode(shift.employeeCode),
        },
        lastName: {
          value: shift.lastName,
          failureMessages: validateLastName(shift.lastName),
        },
        firstName: {
          value: shift.firstName,
          failureMessages: validateFirstName(shift.firstName),
        },
        basePayRate: {
          value: shift.basePayRate,
          failureMessages: [],
        },
        shiftStartDate: {
          value: shift.shiftStartDate,
          failureMessages: [],
        },
        shiftStartTime: {
          value: shift.shiftStartTime,
          failureMessages: [],
        },
        shiftEndTime: {
          value: shift.shiftEndTime,
          failureMessages: [],
        },
        casualLoading: {
          value: shift.casualLoading,
          failureMessages: [],
        },
      };
    });
  }
}

const validateEmployeeCode = (employeeCode: string): string[] => {
  if (employeeCode.length < 1) {
    return ['Employee code must have at least 1 character'];
  } else if (!/$[a-zA-Z0-9]+^/.test(employeeCode)) {
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

export const useShiftTableValidator = () => new ShiftTableValidator();
