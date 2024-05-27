import { Duration, ZonedDateTime } from '@js-joda/core';
import Decimal from 'decimal.js';
import { AwardPayCalculator } from 'award/AwardPayCalculator';
import { PayClassifier } from 'award/PayClassifier';
import { TimeClassifier } from 'award/TimeClassifier';
import { ClassifiedPayableTime, LoadingClassification } from 'models/outputs/payable';
import { Worker } from 'models/inputs/worker';

const START_TIME = ZonedDateTime.parse('2023-09-21T10:00:00Z');
const END_TIME = ZonedDateTime.parse('2023-09-21T15:00:00Z');
const DURATION = new Decimal(Duration.between(START_TIME, END_TIME).toMinutes());
const LOADING_CLASSIFICATION = LoadingClassification.REGULAR_TIME;
const LOADING_RATE = new Decimal('1');

const worker: Worker = {
  code: 'code',
  name: {
    firstName: 'first-name',
    lastName: 'last-name',
  },
  basePayRate: new Decimal('1'),
  casualLoading: false,
  shifts: [
    {
      sourceRow: 0,
      startTime: START_TIME,
      endTime: END_TIME,
    },
    {
      sourceRow: 1,
      startTime: START_TIME,
      endTime: END_TIME,
    },
  ],
};

const makePayClassifier = (result: ClassifiedPayableTime[]): PayClassifier => ({
  classifyPayForSpan: () => result,
});

const makeClassifiedPayableTime = (amount: string): ClassifiedPayableTime => ({
  startTime: START_TIME,
  endTime: END_TIME,
  duration: DURATION,
  classification: LOADING_CLASSIFICATION,
  loading: LOADING_RATE,
  payableAmount: new Decimal(amount),
});

describe('AwardPayClassifier', () => {
  test('should correctly sum shifts and increments', () => {
    const result = new AwardPayCalculator(
      new TimeClassifier([], []),
      [
        makePayClassifier([
          makeClassifiedPayableTime('123'),
          makeClassifiedPayableTime('456'),
        ]),
        makePayClassifier([makeClassifiedPayableTime('789')]),
      ],
    ).calculateWorkerPay(worker);

    expect(result.shifts).toHaveLength(2);
    result.shifts.forEach((shift) => {
      expect(shift.increments).toHaveLength(3);
      expect(shift.increments[0].payableAmount.toString()).toEqual('123');
      expect(shift.increments[1].payableAmount.toString()).toEqual('456');
      expect(shift.increments[2].payableAmount.toString()).toEqual('789');
      expect(shift.payableAmount.toString()).toEqual('1368');
    });
    expect(result.payableAmount.toString()).toEqual('2736');
  });

  test('should correctly sum shifts and increments with rounding', () => {
    const result = new AwardPayCalculator(
      new TimeClassifier([], []),
      [
        makePayClassifier([
          makeClassifiedPayableTime('1.2345'),
          makeClassifiedPayableTime('4.5678'),
        ]),
        makePayClassifier([makeClassifiedPayableTime('7.8901')]),
      ],
    ).calculateWorkerPay(worker);

    expect(result.shifts).toHaveLength(2);
    result.shifts.forEach((shift) => {
      expect(shift.increments).toHaveLength(3);
      expect(shift.increments[0].payableAmount.toString()).toEqual('1.2345');
      expect(shift.increments[1].payableAmount.toString()).toEqual('4.5678');
      expect(shift.increments[2].payableAmount.toString()).toEqual('7.8901');
      expect(shift.payableAmount.toString()).toEqual('14');
    });
    expect(result.payableAmount.toString()).toEqual('28');
  });
});
