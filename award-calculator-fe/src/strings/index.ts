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
