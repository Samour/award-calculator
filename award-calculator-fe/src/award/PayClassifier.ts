import { ClassifiedPayableTime } from 'models/outputs/payable';
import { Worker } from 'models/inputs/worker';
import { ClassifiedWorkedTime } from './TimeClassifier';

export interface PayClassifier {
  /**
   * Classify pay for **a single shift**
   * 
   * The classifiedTime must represent the increments for exactly 1 complete shift
   */
  classifyPayForSpan(worker: Worker, classifiedTime: ClassifiedWorkedTime[]): ClassifiedPayableTime[];
}
