export interface ValidatedRow {
  employeeCode: ValidatedCell;
  lastName: ValidatedCell;
  firstName: ValidatedCell;
  basePayRate: ValidatedCell;
  shiftStartDate: ValidatedCell;
  shiftStartTime: ValidatedCell;
  shiftEndTime: ValidatedCell;
  casualLoading: ValidatedCell;
}

export interface ValidatedCell {
  value: string;
  failureMessages: string[];
}
