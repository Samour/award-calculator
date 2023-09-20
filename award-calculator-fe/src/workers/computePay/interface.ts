import { ComputePayForShiftData, PayComputationResult } from 'models/messages/computePay';

export const computePayInWorker = (shiftData: ComputePayForShiftData): Promise<PayComputationResult> => {
  const worker = new Worker(new URL('./worker', import.meta.url));

  return new Promise((res) => {
    worker.onmessage = ({ data }: { data: PayComputationResult }) => {
      res(data);
    };

    worker.postMessage(shiftData);
  });
};
