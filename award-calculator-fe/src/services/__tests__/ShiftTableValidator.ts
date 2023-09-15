import { WorkerShiftColumnName, WorkerShiftRow } from 'models/inputs/table';
import { ShiftTableValidator, ValidationOutcome } from 'services/ShiftTableValidator';
import strings from 'strings';

const validWorkerShift1: WorkerShiftRow = {
  employeeCode: 'E001',
  lastName: 'Doe',
  firstName: 'John',
  basePayRate: '$25.75',
  shiftStartDate: '22/01/2023',
  shiftStartTime: '08:00',
  shiftEndTime: '16:00',
  casualLoading: 'N',
};

const validWorkerShift2: WorkerShiftRow = {
  ...validWorkerShift1,
  shiftStartDate: '23/01/2023',
};

const checkGeneralShape = (valiationOutcomes: ValidationOutcome[]) =>
  (expectedElements: number) => {
    expect(valiationOutcomes).toHaveLength(expectedElements);
    valiationOutcomes.forEach((row, rowIdx) => {
      expect(row.rowIndex).toEqual(rowIdx);
      expect(row.columns).toHaveLength(8);
      expect(row.columns.map((c) => c.columnId).sort()).toEqual(
        [
          'employeeCode',
          'lastName',
          'firstName',
          'basePayRate',
          'shiftStartDate',
          'shiftStartTime',
          'shiftEndTime',
          'casualLoading',
        ].sort()
      );
    });
  };

const expectNoFailures = (validationOutcomes: ValidationOutcome[]) => {
  validationOutcomes.forEach((row) => {
    row.columns.forEach((c) => expect(c.failureMessages).toHaveLength(0));
  });
};

const expectFailureMessage = (validationOutcomes: ValidationOutcome[]) =>
  (rowIndex: number, columnId: WorkerShiftColumnName, failureMessage: string) => {
    validationOutcomes.forEach((row, rowIdx) => {
      row.columns.forEach((c) => {
        if (rowIdx === rowIndex && c.columnId === columnId) {
          expect(c.failureMessages).toEqual([failureMessage]);
        } else {
          expect(c.failureMessages).toHaveLength(0);
        }
      });
    });
  };

describe('ShiftTableValidator', () => {
  test('should accept a single valid row', () => {
    const result = new ShiftTableValidator([validWorkerShift1]).validateShiftRows();

    checkGeneralShape(result)(1);
    expectNoFailures(result);
  });

  describe('Employee code', () => {

    test('should reject an empty value', () => {
      const result = new ShiftTableValidator([
        {
          ...validWorkerShift1,
          employeeCode: '',
        }
      ]).validateShiftRows();

      checkGeneralShape(result)(1);
      expectFailureMessage(result)(0, 'employeeCode', strings.validations.workerShiftEntry.employeeCode.tooShort);
    });

    test('should reject a value with illegal characters', () => {
      const result = new ShiftTableValidator([
        {
          ...validWorkerShift1,
          employeeCode: 'A$b@',
        }
      ]).validateShiftRows();

      checkGeneralShape(result)(1);
      expectFailureMessage(result)(0, 'employeeCode', strings.validations.workerShiftEntry.employeeCode.illegalChars);
    });
  });

  describe('Last name', () => {

    test('should reject an empty value', () => {
      const result = new ShiftTableValidator([
        {
          ...validWorkerShift1,
          firstName: '',
        }
      ]).validateShiftRows();

      checkGeneralShape(result)(1);
      expectFailureMessage(result)(0, 'firstName', strings.validations.workerShiftEntry.firstName.tooShort);
    });
  });

  describe('First name', () => {

    test('should reject an empty value', () => {
      const result = new ShiftTableValidator([
        {
          ...validWorkerShift1,
          lastName: '',
        }
      ]).validateShiftRows();

      checkGeneralShape(result)(1);
      expectFailureMessage(result)(0, 'lastName', strings.validations.workerShiftEntry.lastName.tooShort);
    });
  });

  describe('Pay rate', () => {

    it.each([
      '$25.75',
      '$25.70',
      '$25.7',
      '$25.00',
      '$25.00',
      '$25',
      '25.75',
      '25.70',
      '25.7',
      '25.00',
      '25.00',
      '25',
    ])('should accept valid value with format %s', (basePayRate) => {
      const result = new ShiftTableValidator([{
        ...validWorkerShift1,
        basePayRate,
      }]).validateShiftRows();

      checkGeneralShape(result)(1);
      expectNoFailures(result);
    });

    test('should reject an empty value', () => {
      const result = new ShiftTableValidator([
        {
          ...validWorkerShift1,
          basePayRate: '',
        }
      ]).validateShiftRows();

      checkGeneralShape(result)(1);
      expectFailureMessage(result)(0, 'basePayRate', strings.validations.workerShiftEntry.basePayRate.illegalFormat);
    });

    test('should reject a value with fractional cents', () => {
      const result = new ShiftTableValidator([
        {
          ...validWorkerShift1,
          basePayRate: '0.101',
        }
      ]).validateShiftRows();

      checkGeneralShape(result)(1);
      expectFailureMessage(result)(0, 'basePayRate', strings.validations.workerShiftEntry.basePayRate.illegalPrecision);
    });

    test('should reject a value less than 1 cent', () => {
      const result = new ShiftTableValidator([
        {
          ...validWorkerShift1,
          basePayRate: '0',
        }
      ]).validateShiftRows();

      checkGeneralShape(result)(1);
      expectFailureMessage(result)(0, 'basePayRate', strings.validations.workerShiftEntry.basePayRate.tooLow);
    });
  });

  describe('Shift start date', () => {

    it.each(['2023', '23'])('should accept a valid value with format %s', (year) => {
      const result = new ShiftTableValidator([
        {
          ...validWorkerShift1,
          shiftStartDate: `01/01/${year}`,
        }
      ]).validateShiftRows();

      checkGeneralShape(result)(1);
      expectNoFailures(result);
    });

    test('should reject an empty value', () => {
      const result = new ShiftTableValidator([
        {
          ...validWorkerShift1,
          shiftStartDate: '',
        }
      ]).validateShiftRows();

      checkGeneralShape(result)(1);
      expectFailureMessage(result)(0, 'shiftStartDate', strings.validations.workerShiftEntry.shiftStartDate.illegalFormat);
    });

    test('should reject a value with invalid format', () => {
      const result = new ShiftTableValidator([
        {
          ...validWorkerShift1,
          shiftStartDate: '2023-05-23',
        }
      ]).validateShiftRows();

      checkGeneralShape(result)(1);
      expectFailureMessage(result)(0, 'shiftStartDate', strings.validations.workerShiftEntry.shiftStartDate.illegalFormat);
    });
  });

  describe('Shift start time', () => {

    test('should reject an empty value', () => {
      const result = new ShiftTableValidator([
        {
          ...validWorkerShift1,
          shiftStartTime: '',
        }
      ]).validateShiftRows();

      checkGeneralShape(result)(1);
      expectFailureMessage(result)(0, 'shiftStartTime', strings.validations.workerShiftEntry.shiftStartTime.illegalFormat);
    });

    test('should reject a value with invalid format', () => {
      const result = new ShiftTableValidator([
        {
          ...validWorkerShift1,
          shiftStartTime: '07:00.00',
        }
      ]).validateShiftRows();

      checkGeneralShape(result)(1);
      expectFailureMessage(result)(0, 'shiftStartTime', strings.validations.workerShiftEntry.shiftStartTime.illegalFormat);
    });
  });

  describe('Shift end time', () => {

    test('should reject an empty value', () => {
      const result = new ShiftTableValidator([
        {
          ...validWorkerShift1,
          shiftEndTime: '',
        }
      ]).validateShiftRows();

      checkGeneralShape(result)(1);
      expectFailureMessage(result)(0, 'shiftEndTime', strings.validations.workerShiftEntry.shiftEndTime.illegalFormat);
    });

    test('should reject a value with invalid format', () => {
      const result = new ShiftTableValidator([
        {
          ...validWorkerShift1,
          shiftEndTime: '12:00.00',
        }
      ]).validateShiftRows();

      checkGeneralShape(result)(1);
      expectFailureMessage(result)(0, 'shiftEndTime', strings.validations.workerShiftEntry.shiftEndTime.illegalFormat);
    });
  });

  describe('Casual loading', () => {

    it.each([
      'y',
      'Y',
      'n',
      'N',
      'yes',
      'YES',
      'no',
      'NO',
      'true',
      'TRUE',
      'false',
      'FALSE',
    ])('should accept valid value \'%s\'', (casualLoading) => {
      const result = new ShiftTableValidator([{
        ...validWorkerShift1,
        casualLoading,
      }]).validateShiftRows();

      checkGeneralShape(result)(1);
      expectNoFailures(result);
    });

    test('should reject an empty value', () => {
      const result = new ShiftTableValidator([
        {
          ...validWorkerShift1,
          casualLoading: '',
        }
      ]).validateShiftRows();

      checkGeneralShape(result)(1);
      expectFailureMessage(result)(0, 'casualLoading', strings.validations.workerShiftEntry.casualLoading.illegalValue);
    });

    test('should reject an invalid value', () => {
      const result = new ShiftTableValidator([
        {
          ...validWorkerShift1,
          casualLoading: 'nah',
        }
      ]).validateShiftRows();

      checkGeneralShape(result)(1);
      expectFailureMessage(result)(0, 'casualLoading', strings.validations.workerShiftEntry.casualLoading.illegalValue);
    });
  });

  describe('Shift end date-time', () => {

    test('should reject a later start date-time', () => {
      const result = new ShiftTableValidator([
        {
          ...validWorkerShift1,
          shiftStartTime: '12:00',
          shiftEndTime: '11:00',
        }
      ]).validateShiftRows();

      checkGeneralShape(result)(1);
      expectFailureMessage(result)(0, 'shiftEndTime', strings.validations.workerShiftEntry.shiftEndTime.beforeShiftStart);
    });

    test('should reject an equal start date-time', () => {
      const result = new ShiftTableValidator([
        {
          ...validWorkerShift1,
          shiftStartTime: '12:00',
          shiftEndTime: '12:00',
        }
      ]).validateShiftRows();

      checkGeneralShape(result)(1);
      expectFailureMessage(result)(0, 'shiftEndTime', strings.validations.workerShiftEntry.shiftEndTime.beforeShiftStart);
    });
  });

  describe('Employee consistency', () => {

    test('should accept multiple employee rows with consistent values', () => {
      const result = new ShiftTableValidator([
        validWorkerShift1,
        validWorkerShift2,
      ]).validateShiftRows();

      checkGeneralShape(result)(2);
      expectNoFailures(result);
    });

    test('should reject when Last name is not consistent', () => {
      const result = new ShiftTableValidator([
        validWorkerShift1,
        {
          ...validWorkerShift2,
          lastName: 'Wrong',
        },
      ]).validateShiftRows();

      checkGeneralShape(result)(2);
      expectFailureMessage(result)(1, 'lastName', strings.validations.workerShiftEntry.lastName.doesNotMatchPriorEntry);
    });

    test('should reject when First name is not consistent', () => {
      const result = new ShiftTableValidator([
        validWorkerShift1,
        {
          ...validWorkerShift2,
          firstName: 'Wrong',
        },
      ]).validateShiftRows();

      checkGeneralShape(result)(2);
      expectFailureMessage(result)(1, 'firstName', strings.validations.workerShiftEntry.firstName.doesNotMatchPriorEntry);
    });

    test('should reject when Pay rate is not consistent', () => {
      const result = new ShiftTableValidator([
        validWorkerShift1,
        {
          ...validWorkerShift2,
          basePayRate: '50',
        },
      ]).validateShiftRows();

      checkGeneralShape(result)(2);
      expectFailureMessage(result)(1, 'basePayRate', strings.validations.workerShiftEntry.basePayRate.doesNotMatchPriorEntry);
    });

    test('should reject when Casual loading is not consistent', () => {
      const result = new ShiftTableValidator([
        validWorkerShift1,
        {
          ...validWorkerShift2,
          casualLoading: 'Y',
        },
      ]).validateShiftRows();

      checkGeneralShape(result)(2);
      expectFailureMessage(result)(1, 'casualLoading', strings.validations.workerShiftEntry.casualLoading.doesNotMatchPriorEntry);
    });

    test('should accept different values for different employees', () => {
      const result = new ShiftTableValidator([
        validWorkerShift1,
        {
          ...validWorkerShift2,
          employeeCode: 'E002',
          firstName: 'Jane',
        },
      ]).validateShiftRows();

      checkGeneralShape(result)(2);
      expectNoFailures(result);
    });
  });

  describe('Shifts on the same day', () => {

    test('should accept shifts that do not overlap', () => {
      const result = new ShiftTableValidator([
        validWorkerShift1,
        {
          ...validWorkerShift1,
          shiftStartTime: '17:00',
          shiftEndTime: '21:00',
        },
      ]).validateShiftRows();

      checkGeneralShape(result)(2);
      expectNoFailures(result);
    });

    test('should accept overlapping shifts for separate workers', () => {
      const result = new ShiftTableValidator([
        validWorkerShift1,
        {
          ...validWorkerShift1,
          employeeCode: 'S002',
          shiftStartTime: '09:00',
          shiftEndTime: '20:00',
        },
      ]).validateShiftRows();

      checkGeneralShape(result)(2);
      expectNoFailures(result);
    });

    test('should accept overlapping times if the shifts are on separate days', () => {
      const result = new ShiftTableValidator([
        validWorkerShift1,
        {
          ...validWorkerShift1,
          shiftStartDate: '23/01/2023',
          shiftStartTime: '09:00',
          shiftEndTime: '20:00',
        },
      ]).validateShiftRows();

      checkGeneralShape(result)(2);
      expectNoFailures(result);
    });

    test('should reject overlapping shift for a single worker', () => {
      const result = new ShiftTableValidator([
        validWorkerShift1,
        {
          ...validWorkerShift1,
          shiftStartTime: '09:00',
          shiftEndTime: '20:00',
        },
      ]).validateShiftRows();

      checkGeneralShape(result)(2);
      expectFailureMessage(result)(1, 'shiftStartTime', strings.validations.workerShiftEntry.shiftStartTime.overlappingShifts);
    });
  });

  test('should return all validation errors when more than 1 occurs', () => {
    const result = new ShiftTableValidator([
      {
        ...validWorkerShift1,
        employeeCode: '',
        basePayRate: '0.001',
        shiftStartDate: '2023-01-22',
      }
    ]).validateShiftRows();

    checkGeneralShape(result)(1);
    result[0].columns.forEach((c) => {
      if (c.columnId === 'employeeCode') {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(c.failureMessages).toEqual([strings.validations.workerShiftEntry.employeeCode.tooShort]);
      } else if (c.columnId === 'basePayRate') {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(c.failureMessages.sort()).toEqual([
          strings.validations.workerShiftEntry.basePayRate.illegalPrecision,
          strings.validations.workerShiftEntry.basePayRate.tooLow,
        ].sort());
      } else if (c.columnId === 'shiftStartDate') {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(c.failureMessages).toEqual([strings.validations.workerShiftEntry.shiftStartDate.illegalFormat]);
      } else {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(c.failureMessages).toHaveLength(0);
      }
    });
  });
});
