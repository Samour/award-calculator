import { ClassifiedPayableTime } from 'models/outputs/payable';
import { Worker } from 'models/inputs/worker';
import { ClassifiedWorkedTime } from './TimeClassifier';

export interface PayClassifier {
  classifyPayForSpan(worker: Worker, classifiedTime: ClassifiedWorkedTime[]): ClassifiedPayableTime[];
}
