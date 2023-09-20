export interface ValidatedWorkerShiftRow {
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

export interface CsvFileParsingError {
  open: boolean;
  message: string;
}

export interface ShiftEntryState {
  rows: ValidatedWorkerShiftRow[];
  csvFileParsingError: CsvFileParsingError;
  tableValidationScrollNonce: string;
  validationInProgress: boolean; // TODO rename this
}
