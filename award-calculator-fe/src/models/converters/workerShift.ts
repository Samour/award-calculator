import { WorkerShiftRow } from 'models/inputs/table';
import { ValidatedCell, ValidatedWorkerShiftRow } from 'models/store/shiftEntry';

export const validatedToWorkerShift = (validated: ValidatedWorkerShiftRow): WorkerShiftRow => ({
  employeeCode: validated.employeeCode.value,
  lastName: validated.lastName.value,
  firstName: validated.firstName.value,
  basePayRate: validated.basePayRate.value,
  shiftStartDate: validated.shiftStartDate.value,
  shiftStartTime: validated.shiftStartTime.value,
  shiftEndTime: validated.shiftEndTime.value,
  casualLoading: validated.casualLoading.value,
});

export const createValidatedCell = (value: string): ValidatedCell => ({
  value,
  failureMessages: [],
});

export const workerShiftToEmptyValidated = (shift: WorkerShiftRow): ValidatedWorkerShiftRow => ({
  employeeCode: createValidatedCell(shift.employeeCode),
  lastName: createValidatedCell(shift.lastName),
  firstName: createValidatedCell(shift.firstName),
  basePayRate: createValidatedCell(shift.basePayRate),
  shiftStartDate: createValidatedCell(shift.shiftStartDate),
  shiftStartTime: createValidatedCell(shift.shiftStartTime),
  shiftEndTime: createValidatedCell(shift.shiftEndTime),
  casualLoading: createValidatedCell(shift.casualLoading),
});
