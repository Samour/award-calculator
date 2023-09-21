/* eslint-disable no-restricted-globals */

import { dummyShiftPayableRows } from 'dummyData';
import flags from 'flags';
import {
  ComputePayForShiftData,
  DataValidationFailureResult,
  PayBreakdownResult,
  PayComputationResult,
} from 'models/messages/computePay';
import { ShiftTableValidator } from 'services/ShiftTableValidator';

const makeDelay = (delay: number) => {
  // busy-wait to freeze UI
  const start = Date.now();
  let increment = 0;
  while (start + increment < start + delay) {
    increment = Date.now() - start;
  }
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

  // TODO continue with calculation
  const outcome: PayBreakdownResult = {
    outcome: 'pay_breakdown',
    shiftPayables: dummyShiftPayableRows,
  };
  return outcome;
};

self.onmessage = ({ data }: { data: ComputePayForShiftData }) => {
  computeShiftPay(data).then((result) => {
    self.postMessage(result);
  });
};
