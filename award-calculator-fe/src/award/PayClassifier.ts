import { ClassifiedPayableTime } from 'models/outputs/payable';
import { ClassifiedWorkedTime } from './TimeClassifier';

export interface PayClassifier {
  classifyPayForSpan(worker: Worker, classifiedTime: ClassifiedWorkedTime[]): ClassifiedPayableTime[];
}
