import { ZonedDateTime } from '@js-joda/core';
import { ClassifiedWorkedTime, OvertimeCounter, TimeClassifier, WorkTimeClassification } from 'award/TimeClassifier';

const SHIFT_START_TIME = ZonedDateTime.parse('2023-09-22T08:00:00Z');
const SHIFT_END_TIME = SHIFT_START_TIME.plusHours(1);

const makeOvertimeCounter = (minutesStart: number, minutesEnd: number): OvertimeCounter => ({
  countOvertimeInShift: () => [{
    startTime: SHIFT_START_TIME.plusMinutes(minutesStart),
    endTime: SHIFT_START_TIME.plusMinutes(minutesEnd),
  }],
});

const expectWorkedTime = (workerTime: ClassifiedWorkedTime) => ({
  toEqual: (startMinutes: number, endMinutes: number, classification: WorkTimeClassification) => {
    expect(workerTime.startTime.toString()).toEqual(SHIFT_START_TIME.plusMinutes(startMinutes).toString());
    expect(workerTime.endTime.toString()).toEqual(SHIFT_START_TIME.plusMinutes(endMinutes).toString());
    expect(workerTime.duration.toNumber()).toEqual(endMinutes - startMinutes);
    expect(workerTime.classification).toEqual(classification);
  },
});

const expectShiftClassifications = (overtimeSpans: [number, number][]) => {
  const result = new TimeClassifier(
    overtimeSpans.map(([start, end]) => makeOvertimeCounter(start, end)),
  ).classifyShift({
    sourceRow: 0,
    startTime: SHIFT_START_TIME,
    endTime: SHIFT_END_TIME,
  });

  return {
    toHaveSpans: (expected: [number, number, WorkTimeClassification][]) => {
      expect(result).toHaveLength(expected.length);
      expected.forEach((workedTime, idx) =>
        expectWorkedTime(result[idx]).toEqual(workedTime[0], workedTime[1], workedTime[2]),
      );
    },
  };
};

describe('TimeClassifier', () => {
  /**
   * Shift time:      |================================|
   * Overtime spans:          |====|      |=====|
   * 
   * Expected:
   * Regular time:    |=======|    |======|     |======|
   * Overtime:                |====|      |=====|
   */
  test('should return spans of regular and overtime 1', () => {
    expectShiftClassifications([
      [15, 25],
      [35, 45],
    ]).toHaveSpans([
      [0, 15, WorkTimeClassification.REGULAR_TIME],
      [15, 25, WorkTimeClassification.OVERTIME],
      [25, 35, WorkTimeClassification.REGULAR_TIME],
      [35, 45, WorkTimeClassification.OVERTIME],
      [45, 60, WorkTimeClassification.REGULAR_TIME],
    ]);
  });

  /**
   * Shift time:      |================================|
   * Overtime spans:  |====|      |=====|
   * 
   * Expected:
   * Regular time:          |=====|     |==============|
   * Overtime:        |====|      |=====|
   */
  test('should return spans of regular and overtime 2', () => {
    expectShiftClassifications([
      [0, 15],
      [30, 45],
    ]).toHaveSpans([
      [0, 15, WorkTimeClassification.OVERTIME],
      [15, 30, WorkTimeClassification.REGULAR_TIME],
      [30, 45, WorkTimeClassification.OVERTIME],
      [45, 60, WorkTimeClassification.REGULAR_TIME],
    ]);
  });

  /**
   * Shift time:      |================================|
   * Overtime spans:                 |====|      |=====|
   * 
   * Expected:
   * Regular time:    |==============|    |======|
   * Overtime:                       |====|      |=====|
   */
  test('should return spans of regular and overtime 3', () => {
    expectShiftClassifications([
      [25, 35],
      [45, 60],
    ]).toHaveSpans([
      [0, 25, WorkTimeClassification.REGULAR_TIME],
      [25, 35, WorkTimeClassification.OVERTIME],
      [35, 45, WorkTimeClassification.REGULAR_TIME],
      [45, 60, WorkTimeClassification.OVERTIME],
    ]);
  });

  /**
   * Shift time:      |================================|
   * Overtime spans:  |======|      |=======|
   *                         |======|
   * 
   * Expected:
   * Regular time:                          |==========|
   * Overtime:        |=====================|
   */
  test('should return spans of regular and overtime 4', () => {
    expectShiftClassifications([
      [0, 15],
      [15, 30],
      [30, 45],
    ]).toHaveSpans([
      [0, 45, WorkTimeClassification.OVERTIME],
      [45, 60, WorkTimeClassification.REGULAR_TIME],
    ]);
  });

  /**
   * Shift time:      |================================|
   * Overtime spans:  |======|      |=======|
   *                         |======|
   * 
   * Expected:
   * Regular time:                          |==========|
   * Overtime:        |=====================|
   */
  test('should return spans of regular and overtime 4 (unordered)', () => {
    expectShiftClassifications([
      [0, 15],
      [30, 45],
      [15, 30],
    ]).toHaveSpans([
      [0, 45, WorkTimeClassification.OVERTIME],
      [45, 60, WorkTimeClassification.REGULAR_TIME],
    ]);
  });

  /**
   * Shift time:      |================================|
   * Overtime spans:
   * 
   * Expected:
   * Regular time:    |================================|
   * Overtime:
   */
  test('should return spans of regular and overtime 5', () => {
    expectShiftClassifications([]).toHaveSpans([
      [0, 60, WorkTimeClassification.REGULAR_TIME],
    ]);
  });

  /**
   * Shift time:      |================================|
   * Overtime spans:  |================================|
   * 
   * Expected:
   * Regular time:    |================================|
   * Overtime:        |================================|
   */
  test('should return spans of regular and overtime 6', () => {
    expectShiftClassifications([
      [0, 60],
    ]).toHaveSpans([
      [0, 60, WorkTimeClassification.OVERTIME],
    ]);
  });

  /**
   * Shift time:      |================================|
   * Overtime spans:  |======|      |=======|
   *                       |====|
   * 
   * Expected:
   * Regular time:              |===|       |==========|
   * Overtime:        |=========|   |=======|
   */
  test('should return spans of regular and overtime with overlapping overtime 1', () => {
    expectShiftClassifications([
      [0, 15],
      [10, 20],
      [30, 40],
    ]).toHaveSpans([
      [0, 20, WorkTimeClassification.OVERTIME],
      [20, 30, WorkTimeClassification.REGULAR_TIME],
      [30, 40, WorkTimeClassification.OVERTIME],
      [40, 60, WorkTimeClassification.REGULAR_TIME],
    ]);
  });

  /**
   * Shift time:      |================================|
   * Overtime spans:  |======|      |=======|
   *                       |===========|
   * 
   * Expected:
   * Regular time:                          |==========|
   * Overtime:        |=====================|
   */
  test('should return spans of regular and overtime with overlapping overtime 2', () => {
    expectShiftClassifications([
      [0, 15],
      [10, 35],
      [30, 40],
    ]).toHaveSpans([
      [0, 40, WorkTimeClassification.OVERTIME],
      [40, 60, WorkTimeClassification.REGULAR_TIME],
    ]);
  });

  /**
   * Shift time:      |================================|
   * Overtime spans:  |======|      |=======|
   *                       |===========|
   * 
   * Expected:
   * Regular time:                          |==========|
   * Overtime:        |=====================|
   */
  test('should return spans of regular and overtime with overlapping overtime 2 (unordered)', () => {
    expectShiftClassifications([
      [0, 15],
      [30, 40],
      [10, 35],
    ]).toHaveSpans([
      [0, 40, WorkTimeClassification.OVERTIME],
      [40, 60, WorkTimeClassification.REGULAR_TIME],
    ]);
  });

  /**
   * Shift time:      |================================|
   * Overtime spans:       |======|      |=======|
   *                       |==========|
   * 
   * Expected:
   * Regular time:    |====|          |==|       |=====|
   * Overtime:             |==========|  |=======|
   */
  test('should return spans of regular and overtime with overlapping overtime 3', () => {
    expectShiftClassifications([
      [15, 25],
      [15, 30],
      [40, 50],
    ]).toHaveSpans([
      [0, 15, WorkTimeClassification.REGULAR_TIME],
      [15, 30, WorkTimeClassification.OVERTIME],
      [30, 40, WorkTimeClassification.REGULAR_TIME],
      [40, 50, WorkTimeClassification.OVERTIME],
      [50, 60, WorkTimeClassification.REGULAR_TIME],
    ]);
  });

  /**
   * Shift time:      |================================|
   * Overtime spans:       |======|      |=======|
   *                       |==========|
   * 
   * Expected:
   * Regular time:    |====|          |==|       |=====|
   * Overtime:             |==========|  |=======|
   */
  test('should return spans of regular and overtime with overlapping overtime 3 (unordered)', () => {
    expectShiftClassifications([
      [40, 50],
      [15, 30],
      [15, 25],
    ]).toHaveSpans([
      [0, 15, WorkTimeClassification.REGULAR_TIME],
      [15, 30, WorkTimeClassification.OVERTIME],
      [30, 40, WorkTimeClassification.REGULAR_TIME],
      [40, 50, WorkTimeClassification.OVERTIME],
      [50, 60, WorkTimeClassification.REGULAR_TIME],
    ]);
  });

  /**
   * Shift time:      |================================|
   * Overtime spans:       |======|
   *                       |==========|
   *                           |==========|
   * 
   * Expected:
   * Regular time:    |====|              |============|
   * Overtime:             |==============|
   */
  test('should return spans of regular and overtime with overlapping overtime 4', () => {
    expectShiftClassifications([
      [10, 20],
      [10, 25],
      [15, 30],
    ]).toHaveSpans([
      [0, 10, WorkTimeClassification.REGULAR_TIME],
      [10, 30, WorkTimeClassification.OVERTIME],
      [30, 60, WorkTimeClassification.REGULAR_TIME],
    ]);
  });
});
