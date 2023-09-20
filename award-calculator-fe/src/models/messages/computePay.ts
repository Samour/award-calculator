import { WorkerShiftRow } from 'models/inputs/table';
import { ValidationOutcome } from 'models/validation';

export interface ComputePayForShiftData {
  shiftRows: WorkerShiftRow[];
}

export interface PayComputationResult {
  outcome: 'data_validation_failure' | 'TODO_WIP';
}

export interface DataValidationFailureResult extends PayComputationResult {
  outcome: 'data_validation_failure';
  validationFailures: ValidationOutcome[];
}
