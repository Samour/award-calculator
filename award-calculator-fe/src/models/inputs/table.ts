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
