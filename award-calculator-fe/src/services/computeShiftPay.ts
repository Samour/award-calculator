import { useStore } from 'react-redux';
import { AppState } from 'models/store';
import { validatedToWorkerShift } from 'models/converters/workerShift';
import { normaliseRow } from 'models/inputs/table';
import { Screen } from 'models/store/navigation';
import { DataValidationFailureResult, PayBreakdownResult } from 'models/messages/computePay';
import { ValidationOutcome } from 'models/validation';
import {
  invalidateTableValidationScrollNonce,
  markPayComputationInProgress,
  setCellValidationMessages,
} from 'store/shiftEntry';
import { navigateToScreen } from 'store/navigation';
import { populateWorkerPayable } from 'store/payReport';
import { computePayInWorker } from 'workers/computePay/interface';

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

  return async () => {
    const rows = store.getState().shiftEntry.rows;
    const shifts = rows.map((row) => validatedToWorkerShift(row))
      .map((row) => normaliseRow(row))
      .slice(0, rows.length - 1);

    console.log('Validation started');
    console.time('validateShiftData');

    store.dispatch(markPayComputationInProgress({ payComputationInProgress: true }));
    const outcome = await computePayInWorker({ shiftRows: shifts });

    console.log('Validation completed');
    console.timeEnd('validateShiftData');

    if (outcome.outcome === 'data_validation_failure') {
      dispatchValidationFailures((outcome as DataValidationFailureResult).validationFailures);
      store.dispatch(invalidateTableValidationScrollNonce());
    } else if (outcome.outcome === 'pay_breakdown') {
      store.dispatch(populateWorkerPayable((outcome as PayBreakdownResult).workerPayables));
      store.dispatch(navigateToScreen(Screen.PAY_REPORT));
    }

    store.dispatch(markPayComputationInProgress({ payComputationInProgress: false }));
  };
};
