import { WorkerCode, WorkerName } from 'models/inputs/worker';
import { LoadingClassification } from './payable';

export interface SerializableWorker {
  code: WorkerCode;
  name: WorkerName;
  basePayRate: string;
  casualLoading: boolean;
}

export interface SerializableShift {
  startTime: string;
  endTime: string;
}

export interface SerializablePayableTime {
  startTime: string;
  endTime: string;
  duration: string;
  classification: LoadingClassification;
  loading: string;
  payableAmount: string;
}

export interface ShiftPayableRow {
  sourceRow: number;
  worker: SerializableWorker;
  shift: SerializableShift;
  increments: SerializablePayableTime[];
  payableAmount: string;
}
