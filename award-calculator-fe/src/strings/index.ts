const strings = {
  validations: {
    workerShiftEntry: {
      employeeCode: {
        tooShort: 'Employee code must have at least 1 character',
        illegalChars: 'Employee code must only consist of alphabetic (a-z or A-Z) and numeric (0-9) characters',
      },
      lastName: {
        tooShort: 'Last name must have at least 1 character',
      },
      firstName: {
        tooShort: 'First name must have at least 1 character',
      },
      basePayRate: {
        illegalFormat: 'Pay rate must be in a valid dollar format such as $123.45, 123.45 or 123',
        illegalPrecision: 'Pay rate must not include fractions of a cent',
        tooLow: 'Pay rate must be at least $0.01',
      },
      shiftStartDate: {
        illegalFormat: 'Shift start date must be in the format of dd/mm/yy or dd/mm/yyyy',
        invalidDate: 'Shift start date must refer to a real date',
      },
      shiftStartTime: {
        illegalFormat: 'Shift start time must be in the format of HH:MM using 24-hour time',
        invalidTime: 'Shift start time must refer to a real time',
      },
      shiftEndTime: {
        illegalFormat: 'Shift end time must be in the format of HH:MM using 24-hour time',
        invalidTime: 'Shift end time must refer to a real time',
        beforeShiftStart: 'Shift end time must be at least 1 minute after the shift start time',
      },
      casualLoading: {
        illegalValue: 'Casual loading must be one of the following: y, yes, true, n, no, false',
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
        computePay: 'Compute Pay',
      },
    },
  },
};

export default strings;
