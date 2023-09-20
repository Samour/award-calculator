import { useStore } from 'react-redux';
import { AppState } from 'models/store';
import { validatedToWorkerShift } from 'models/converters/workerShift';
import { WorkerShiftRow, normaliseRow } from 'models/inputs/table';
import {
  invalidateTableValidationScrollNonce,
  markPayComputationInProgress,
  setCellValidationMessages,
} from 'store/shiftEntry';
import { ShiftTableValidator, ValidationOutcome } from './ShiftTableValidator';
import { navigateToScreen } from 'store/navigation';
import { Screen } from 'models/store/navigation';

interface PayComputationResult {
  outcome: 'data_validation_failure' | 'TODO_WIP';
}

interface DataValidationFailureResult extends PayComputationResult {
  outcome: 'data_validation_failure';
  validationFailures: ValidationOutcome[];
}

const computeShiftPay = (shiftData: WorkerShiftRow[]): PayComputationResult => {
  // TODO logic will be executed in web worker
  const validationFailures = new ShiftTableValidator(shiftData).validateShiftRows();

  if (validationFailures.length > 0) {
    const outcome: DataValidationFailureResult = {
      outcome: 'data_validation_failure',
      validationFailures,
    };
    return outcome;
  }

  // TODO continue with calculation
  return { outcome: 'TODO_WIP' };
};

export const useComputeShiftPay = (): (() => void) => {
  const store = useStore<AppState>();

  const dispatchValidationFailures = (failures: ValidationOutcome[]) => {
    failures.forEach(({ rowIndex, columns }) => {
      columns.forEach(({ columnId, failureMessages }) => {
        store.dispatch(setCellValidationMessages({
          cellIdentifier: {
            rowIndex,
            columnId,
          },
          failureMessages: failureMessages,
        }));
      });
    });
  };

  return () => {
    const rows = store.getState().shiftEntry.rows;
    const shifts = rows.map((row) => validatedToWorkerShift(row))
      .map((row) => normaliseRow(row))
      .slice(0, rows.length - 1);

    console.log('Validation started');
    console.time('validateShiftData');

    store.dispatch(markPayComputationInProgress({ payComputationInProgress: true }));
    const outcome = computeShiftPay(shifts);

    console.log('Validation completed');
    console.timeEnd('validateShiftData');

    if (outcome.outcome === 'data_validation_failure') {
      dispatchValidationFailures((outcome as DataValidationFailureResult).validationFailures);
      store.dispatch(invalidateTableValidationScrollNonce());
    } else {
      // TODO populate store with pay results
      store.dispatch(navigateToScreen(Screen.PAY_REPORT));
    }

    store.dispatch(markPayComputationInProgress({ payComputationInProgress: false }));
  };
};
