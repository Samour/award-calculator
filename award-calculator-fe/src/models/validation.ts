import { WorkerShiftColumnName } from './inputs/table';

export interface ValidationOutcome {
  rowIndex: number;
  columns: CellValidationFailure[];
}

export interface CellValidationFailure {
  columnId: WorkerShiftColumnName;
  failureMessages: string[];
}
