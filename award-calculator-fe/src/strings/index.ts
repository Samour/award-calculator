import { LoadingClassification } from 'models/outputs/payable';

const strings = {
  validations: {
    workerShiftEntry: {
      employeeCode: {
        tooShort: 'Employee code must have at least 1 character',
        illegalChars: 'Employee code must only consist of alphabetic (a-z or A-Z) and numeric (0-9) characters',
      },
      lastName: {
        tooShort: 'Last name must have at least 1 character',
        doesNotMatchPriorEntry: 'Last name must be the same for all rows with the same Employee code',
      },
      firstName: {
        tooShort: 'First name must have at least 1 character',
        doesNotMatchPriorEntry: 'First name must be the same for all rows with the same Employee code',
      },
      basePayRate: {
        illegalFormat: 'Pay rate must be in a valid dollar format such as $123.45, 123.45 or 123',
        illegalPrecision: 'Pay rate must not include fractions of a cent',
        tooLow: 'Pay rate must be at least $0.01',
        doesNotMatchPriorEntry: 'Pay rate must be the same for all rows with the same Employee code',
      },
      shiftStartDate: {
        illegalFormat: 'Shift start date must be in the format of dd/mm/yy or dd/mm/yyyy',
        invalidDate: 'Shift start date must refer to a real date',
      },
      shiftStartTime: {
        illegalFormat: 'Shift start time must be in the format of HH:MM using 24-hour time',
        invalidTime: 'Shift start time must refer to a real time',
        overlappingShifts: '2 shifts cannot have overlapping times for a single worker',
      },
      shiftEndTime: {
        illegalFormat: 'Shift end time must be in the format of HH:MM using 24-hour time',
        invalidTime: 'Shift end time must refer to a real time',
        beforeShiftStart: 'Shift end time must be at least 1 minute after the shift start time',
      },
      casualLoading: {
        illegalValue: 'Casual loading must be one of the following: y, yes, true, n, no, false',
        doesNotMatchPriorEntry: 'Casual loading must be the same for all rows with the same Employee code',
      },
    },
  },
  screens: {
    shiftEntry: {
      title: 'View/Edit Hours',
      tableHeadings: {
        employeeCode: 'Employee code',
        lastName: 'Last name',
        firstName: 'First name',
        basePayRate: 'Pay rate',
        shiftStartDate: 'Shift start date',
        shiftStartTime: 'Shift start time',
        shiftEndTime: 'Shift end time',
        casualLoading: 'Casual loading',
      },
      validation: {
        message: 'Data entry is not valid. Fix data before proceeding.',
        subtitle: (problemCount: number) => `Problems (${problemCount}):`,
      },
      buttons: {
        uploadFile: 'Upload File',
        computePay: 'Compute Pay',
      },
    },
    payReport: {
      title: 'Pay Report',
      tableHeadings: {
        employeeCode: 'Employee code',
        lastName: 'Last name',
        firstName: 'First name',
        shiftDate: 'Shift date',
        shiftPayable: 'Shift payable',
        details: 'Details',
      },
      shiftBreakdownModal: {
        shiftDate: 'Shift date:',
        shiftStartTime: 'Shift start time:',
        shiftEndTime: 'Shift end time:',
        basePayRate: 'Base pay rate:',
        totalPayable: 'Total payable for shift:',
        tableHeadings: {
          payType: 'Pay type',
          loadingRate: 'Loading rate',
          effectiveStartTime: 'Effective start time',
          effectiveEndTime: 'Effective end time',
          payableDuration: 'Payable duration',
          payableAmount: 'Payable amount',
        },
      },
      buttons: {
        back: 'Back to edit',
      },
    },
  },
  components: {
    modal: {
      buttons: {
        close: 'close',
      },
    },
  },
  loadingClassification: {
    [LoadingClassification.REGULAR_TIME]: 'Regular time',
    [LoadingClassification.TIME_AND_A_HALF]: 'Overtime (time and a half)',
    [LoadingClassification.DOUBLE_TIME]: 'Overtime (double time)',
    [LoadingClassification.WEEKEND_PENALTY]: 'Weekend penalty rate',
    [LoadingClassification.CASUAL]: 'Casual loading',
  },
  exceptions: {
    csvShiftUpload: {
      notCsvFile: 'Provided file is not a CSV file',
      invalidHeaders: 'CSV file does not have the correct headers',
      unknownError: 'A problem occurred while reading CSV file',
    },
  },
};

export default strings;
