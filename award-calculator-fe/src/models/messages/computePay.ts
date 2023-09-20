import { WorkerShiftRow } from 'models/inputs/table';
import { WorkerPayable } from 'models/outputs/payable';
import { ValidationOutcome } from 'models/validation';

export interface ComputePayForShiftData {
  shiftRows: WorkerShiftRow[];
}

export interface PayComputationResult {
  outcome: 'data_validation_failure' | 'pay_breakdown';
}

export interface DataValidationFailureResult extends PayComputationResult {
  outcome: 'data_validation_failure';
  validationFailures: ValidationOutcome[];
}

export interface PayBreakdownResult extends PayComputationResult {
  outcome: 'pay_breakdown';
  workerPayables: WorkerPayable[];
}
