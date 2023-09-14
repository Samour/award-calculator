import { Worker } from 'models/inputs/worker';
import { WorkerPayable } from 'models/outputs/payable';

export interface AwardPayCalculator {
  calculateWorkerPay(worker: Worker): WorkerPayable;
}
