/* eslint-disable no-restricted-globals */

import { buildRetailAwardCalculator } from 'award/retail';
import { dummyWorkerPayableOutcomes } from 'dummyData';
import flags from 'flags';
import { Worker } from 'models/inputs/worker';
import {
  ComputePayForShiftData,
  DataValidationFailureResult,
  PayBreakdownResult,
  PayComputationResult,
} from 'models/messages/computePay';
import { WorkerPayable } from 'models/outputs/payable';
import { ShiftTableValidator } from 'services/ShiftTableValidator';
import { translateFromWorkerShiftRows, translateToShiftPayableRows } from './translate';

const makeDelay = (delay: number) => {
  // busy-wait to freeze UI
  const start = Date.now();
  let increment = 0;
  while (start + increment < start + delay) {
    increment = Date.now() - start;
  }
};

const calculatePayByAward = (workers: Worker[]): WorkerPayable[] => {
  if (flags.useDummyCalculationResult) {
    return dummyWorkerPayableOutcomes;
  }

  return workers.map((worker) =>
    buildRetailAwardCalculator().calculateWorkerPay(worker),
  );
};

const computeShiftPay = async (shiftData: ComputePayForShiftData): Promise<PayComputationResult> => {
  if (flags.simulateComputationDelay > 0) {
    makeDelay(flags.simulateComputationDelay);
  }

  const validationFailures = new ShiftTableValidator(shiftData.shiftRows).validateShiftRows();

  if (validationFailures.length > 0) {
    const outcome: DataValidationFailureResult = {
      outcome: 'data_validation_failure',
      validationFailures,
    };
    return outcome;
  }

  const shiftPayables = calculatePayByAward(
    translateFromWorkerShiftRows(shiftData.shiftRows),
  ).map(translateToShiftPayableRows).flat();
  shiftPayables.sort((a, b) => a.sourceRow - b.sourceRow);
  
  const outcome: PayBreakdownResult = {
    outcome: 'pay_breakdown',
    shiftPayables,
  };
  return outcome;
};

self.onmessage = ({ data }: { data: ComputePayForShiftData }) => {
  computeShiftPay(data).then((result) => {
    self.postMessage(result);
  });
};
