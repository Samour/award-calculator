export interface TableValidationFailures {
  rowFailures: Map<number, RowValidationFailures>;
}

export interface RowValidationFailures {
  employeeCode: string[];
  lastName: string[];
  firstName: string[];
  payRate: string[];
  shiftStartDate: string[];
  shiftStartTime: string[];
  shiftEndTime: string[];
  casualLoading: string[];
}
