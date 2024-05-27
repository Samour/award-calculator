import { ZonedDateTime } from '@js-joda/core';
import { ClassifiedWorkedTime, OvertimeCounter, TimeClassifier, WorkTimeClassification } from 'award/TimeClassifier';
import { ClassifiedOvertimeSpan, OvertimeReason } from 'models/outputs/payable';

const SHIFT_START_TIME = ZonedDateTime.parse('2023-09-22T08:00:00Z');
const SHIFT_END_TIME = SHIFT_START_TIME.plusHours(1);

const makeOvertimeCounter = (reason: OvertimeReason, minutesStart: number, minutesEnd: number): OvertimeCounter => ({
  reason,
  countOvertimeInShift: () => [{
    startTime: SHIFT_START_TIME.plusMinutes(minutesStart),
    endTime: SHIFT_START_TIME.plusMinutes(minutesEnd),
  }],
});

const asClassifiedOvertimeSpan = (
  reason: OvertimeReason,
  minutesStart: number,
  minutesEnd: number,
): ClassifiedOvertimeSpan => ({
  reason,
  startTime: SHIFT_START_TIME.plusMinutes(minutesStart),
  endTime: SHIFT_START_TIME.plusMinutes(minutesEnd),
});

const expectWorkedTime = (workerTime: ClassifiedWorkedTime) => ({
  toEqual: (startMinutes: number, endMinutes: number, classification: WorkTimeClassification) => {
    expect(workerTime.startTime.toString()).toEqual(SHIFT_START_TIME.plusMinutes(startMinutes).toString());
    expect(workerTime.endTime.toString()).toEqual(SHIFT_START_TIME.plusMinutes(endMinutes).toString());
    expect(workerTime.duration.toNumber()).toEqual(endMinutes - startMinutes);
    expect(workerTime.classification).toEqual(classification);
  },
});

const expectShiftClassifications = (overtimeSpans: [OvertimeReason, number, number][]) => {
  const result = new TimeClassifier(
    [],
    overtimeSpans.map(([reason, start, end]) => makeOvertimeCounter(reason, start, end)),
  ).classifyShifts([{
    sourceRow: 0,
    startTime: SHIFT_START_TIME,
    endTime: SHIFT_END_TIME,
  }]);

  return {
    toHaveSpans: (
      expected: [number, number, WorkTimeClassification][],
      expectedOvertimeSpans?: [OvertimeReason, number, number][],
    ) => {
      expect(result).toHaveLength(1);
      expect(result[0].classifiedTime).toHaveLength(expected.length);
      expect(result[0].classifiedOvertime).toHaveLength(overtimeSpans.length);
      expected.forEach((workedTime, idx) =>
        expectWorkedTime(result[0].classifiedTime[idx]).toEqual(workedTime[0], workedTime[1], workedTime[2]),
      );
      (expectedOvertimeSpans || overtimeSpans).map(([reason, start, end]) =>
        asClassifiedOvertimeSpan(reason, start, end),
      ).forEach((span, idx) =>
        expect(result[0].classifiedOvertime[idx]).toEqual(span),
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
      [OvertimeReason.CONSECUTIVE_DAYS, 15, 25],
      [OvertimeReason.DAILY_HOURS, 35, 45],
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
      [OvertimeReason.CONSECUTIVE_DAYS, 0, 15],
      [OvertimeReason.DAILY_HOURS, 30, 45],
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
      [OvertimeReason.CONSECUTIVE_DAYS, 25, 35],
      [OvertimeReason.DAILY_HOURS, 45, 60],
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
      [OvertimeReason.CONSECUTIVE_DAYS, 0, 15],
      [OvertimeReason.DAILY_HOURS, 15, 30],
      [OvertimeReason.CONSECUTIVE_DAYS, 30, 45],
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
      [OvertimeReason.CONSECUTIVE_DAYS, 0, 15],
      [OvertimeReason.DAILY_HOURS, 30, 45],
      [OvertimeReason.CONSECUTIVE_DAYS, 15, 30],
    ]).toHaveSpans([
      [0, 45, WorkTimeClassification.OVERTIME],
      [45, 60, WorkTimeClassification.REGULAR_TIME],
    ], [
      [OvertimeReason.CONSECUTIVE_DAYS, 0, 15],
      [OvertimeReason.CONSECUTIVE_DAYS, 15, 30],
      [OvertimeReason.DAILY_HOURS, 30, 45],
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
      [OvertimeReason.CONSECUTIVE_DAYS, 0, 60],
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
      [OvertimeReason.CONSECUTIVE_DAYS, 0, 15],
      [OvertimeReason.DAILY_HOURS, 10, 20],
      [OvertimeReason.CONSECUTIVE_DAYS, 30, 40],
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
      [OvertimeReason.CONSECUTIVE_DAYS, 0, 15],
      [OvertimeReason.DAILY_HOURS, 10, 35],
      [OvertimeReason.CONSECUTIVE_DAYS, 30, 40],
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
      [OvertimeReason.CONSECUTIVE_DAYS, 0, 15],
      [OvertimeReason.DAILY_HOURS, 30, 40],
      [OvertimeReason.CONSECUTIVE_DAYS, 10, 35],
    ]).toHaveSpans([
      [0, 40, WorkTimeClassification.OVERTIME],
      [40, 60, WorkTimeClassification.REGULAR_TIME],
    ], [
      [OvertimeReason.CONSECUTIVE_DAYS, 0, 15],
      [OvertimeReason.CONSECUTIVE_DAYS, 10, 35],
      [OvertimeReason.DAILY_HOURS, 30, 40],
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
      [OvertimeReason.CONSECUTIVE_DAYS, 15, 25],
      [OvertimeReason.DAILY_HOURS, 15, 30],
      [OvertimeReason.CONSECUTIVE_DAYS, 40, 50],
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
      [OvertimeReason.CONSECUTIVE_DAYS, 40, 50],
      [OvertimeReason.DAILY_HOURS, 15, 30],
      [OvertimeReason.CONSECUTIVE_DAYS, 15, 25],
    ]).toHaveSpans([
      [0, 15, WorkTimeClassification.REGULAR_TIME],
      [15, 30, WorkTimeClassification.OVERTIME],
      [30, 40, WorkTimeClassification.REGULAR_TIME],
      [40, 50, WorkTimeClassification.OVERTIME],
      [50, 60, WorkTimeClassification.REGULAR_TIME],
    ], [
      [OvertimeReason.CONSECUTIVE_DAYS, 15, 25],
      [OvertimeReason.DAILY_HOURS, 15, 30],
      [OvertimeReason.CONSECUTIVE_DAYS, 40, 50],
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
      [OvertimeReason.CONSECUTIVE_DAYS, 10, 20],
      [OvertimeReason.DAILY_HOURS, 10, 25],
      [OvertimeReason.CONSECUTIVE_DAYS, 15, 30],
    ]).toHaveSpans([
      [0, 10, WorkTimeClassification.REGULAR_TIME],
      [10, 30, WorkTimeClassification.OVERTIME],
      [30, 60, WorkTimeClassification.REGULAR_TIME],
    ]);
  });
});
