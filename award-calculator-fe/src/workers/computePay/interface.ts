import { ComputePayForShiftData, PayComputationResult } from 'models/messages/computePay';

const worker = new Worker(new URL('./worker', import.meta.url));

export const computePayInWorker = (shiftData: ComputePayForShiftData): Promise<PayComputationResult> => {
  return new Promise((res) => {
    worker.onmessage = ({ data }: { data: PayComputationResult }) => {
      res(data);
    };

    worker.postMessage(shiftData);
  });
};
