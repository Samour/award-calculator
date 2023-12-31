import { Duration } from '@js-joda/core';
import Decimal from 'decimal.js';
import { ClassifiedWorkedTime } from 'award/TimeClassifier';
import { Worker } from 'models/inputs/worker';
import { ClassifiedPayableTime, LoadingClassification } from 'models/outputs/payable';
import { calculatePayableForIncrement } from 'models/money';
import { RegularTimePayClassifier } from './RegularTimePayClassifier';
import { retailAwardDetails } from '../retailAwardDetails';

export class CasualLoadingPayClassifier implements RegularTimePayClassifier {

  classifyPayForSpan(worker: Worker, classifiedTime: ClassifiedWorkedTime[]): ClassifiedPayableTime[] {
    if (!worker.casualLoading || classifiedTime.length === 0) {
      return [];
    }

    // Assumption: classifiedTime elements are fully contiguous
    const startTime = classifiedTime[0].startTime;
    const endTime = classifiedTime[classifiedTime.length - 1].endTime;
    const duration = new Decimal(Duration.between(startTime, endTime).toMinutes());
    const loading = retailAwardDetails.loadings[LoadingClassification.CASUAL];

    return [
      {
        startTime,
        endTime,
        duration,
        classification: LoadingClassification.CASUAL,
        loading,
        payableAmount: calculatePayableForIncrement(worker.basePayRate, loading, duration),
      },
    ];
  }
}
