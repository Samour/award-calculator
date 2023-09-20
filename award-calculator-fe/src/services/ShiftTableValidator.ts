import { useStore } from 'react-redux';
import Decimal from 'decimal.js';
import { setCellValidationMessages } from 'store/shiftEntry';
import strings from 'strings';
import {
  WorkerShiftColumnName,
  WorkerShiftRow,
  normaliseRow,
  translateCasualLoading,
  translateMonetaryAmount,
  translateToLocalDate,
  translateToLocalTime,
} from 'models/inputs/table';
import { WorkerCode } from 'models/inputs/worker';
import { MonetaryAmount } from 'models/money';
import { AppState } from 'models/store';
import { validatedToWorkerShift } from 'models/converters/workerShift';
import { LocalDate, LocalTime, ZonedDateTime } from '@js-joda/core';
import { toZonedDateTime } from 'models/time';

interface WorkerDetails {
  lastName: string | null;
  firstName: string | null;
  basePayRate: MonetaryAmount | null;
  casualLoading: boolean | null;
}

export interface ValidationOutcome {
  rowIndex: number;
  columns: {
    columnId: WorkerShiftColumnName;
    failureMessages: string[];
  }[];
}

export class ShiftTableValidator {

  private readonly workerShiftTimes: Map<WorkerCode, [ZonedDateTime, ZonedDateTime][]> = new Map();

  constructor(private readonly shifts: WorkerShiftRow[]) { }

  validateShiftRows(): ValidationOutcome[] {
    const validationOutcomes: ValidationOutcome[] = [];

    const encounteredWorkers: Map<WorkerCode, WorkerDetails> = new Map();

    this.shifts.forEach((shift, rowIndex) => {
      const parsedShiftStartDate = translateToLocalDate(shift.shiftStartDate);
      const parsedShiftStartTime = translateToLocalTime(shift.shiftStartTime);
      const parsedShiftEndTime = translateToLocalTime(shift.shiftEndTime);
      const parsedBasePayRate = translateMonetaryAmount(shift.basePayRate);
      const parsedCasualLoading = translateCasualLoading(shift.casualLoading);

      const zonedShiftStartTime = parsedShiftStartDate && parsedShiftStartTime &&
        toZonedDateTime(parsedShiftStartDate, parsedShiftStartTime);
      const zonedShiftEndTime = parsedShiftStartDate && parsedShiftEndTime &&
        toZonedDateTime(parsedShiftStartDate, parsedShiftEndTime);

      const existingWorker = encounteredWorkers.get(shift.employeeCode);

      const validators: [WorkerShiftColumnName, string[]][] = [
        ['employeeCode', validateEmployeeCode(shift.employeeCode)],
        ['lastName', validateLastName(existingWorker, shift.lastName)],
        ['firstName', validateFirstName(existingWorker, shift.firstName)],
        ['basePayRate', validateBasePayRate(existingWorker, parsedBasePayRate, shift.basePayRate)],
        ['shiftStartDate', validateShiftStartDate(parsedShiftStartDate, shift.shiftStartDate)],
        ['shiftStartTime',
          validateShiftStartTime(!!parsedShiftStartDate, parsedShiftStartTime, shift.shiftStartTime)
            .concat(
              this.checkForOverlappingShiftStart(shift.employeeCode, zonedShiftStartTime, zonedShiftEndTime)
            )],
        ['shiftEndTime', validateShiftEndTime(!!parsedShiftStartDate, zonedShiftStartTime, zonedShiftEndTime,
          shift.shiftEndTime)],
        ['casualLoading', validateCasualLoading(existingWorker, parsedCasualLoading)],
      ];

      validationOutcomes.push({
        rowIndex,
        columns: validators.map(([columnId, failureMessages]) => ({
          columnId,
          failureMessages,
        })),
      });

      if (existingWorker) {
        existingWorker.lastName = existingWorker.lastName || shift.lastName;
        existingWorker.firstName = existingWorker.firstName || shift.firstName;
        existingWorker.basePayRate = existingWorker.basePayRate || parsedBasePayRate;
        existingWorker.casualLoading = existingWorker.casualLoading === null ? parsedCasualLoading :
          existingWorker.casualLoading;
      } else if (shift.employeeCode) {
        encounteredWorkers.set(shift.employeeCode, {
          lastName: shift.lastName,
          firstName: shift.firstName,
          basePayRate: parsedBasePayRate,
          casualLoading: parsedCasualLoading,
        });
      }

      this.pushShiftTimes(shift.employeeCode, zonedShiftStartTime, zonedShiftEndTime);
    });

    return validationOutcomes;
  }

  private checkForOverlappingShiftStart(employeeCode: WorkerCode, shiftStartTime: ZonedDateTime | null,
    shiftEndTime: ZonedDateTime | null): string[] {
    const existingShifts = this.workerShiftTimes.get(employeeCode);
    if (!existingShifts?.length || !shiftStartTime || !shiftEndTime || !shiftStartTime.isBefore(shiftEndTime)) {
      return [];
    }

    for (let [start, end] of existingShifts) {
      if (shiftStartTime.isBefore(end) && shiftEndTime.isAfter(start)) {
        return [strings.validations.workerShiftEntry.shiftStartTime.overlappingShifts];
      } else if (shiftStartTime.isAfter(start)) {
        break;
      }
    }

    return [];
  }

  private pushShiftTimes(employeeCode: WorkerCode, shiftStartTime: ZonedDateTime | null,
    shiftEndTime: ZonedDateTime | null) {
    if (!employeeCode || !shiftStartTime || !shiftEndTime || !shiftStartTime.isBefore(shiftEndTime)) {
      return;
    }

    const shiftTimes = this.workerShiftTimes.get(employeeCode);
    if (shiftTimes) {
      shiftTimes.push([shiftStartTime, shiftEndTime]);
      shiftTimes.sort();
    } else {
      this.workerShiftTimes.set(employeeCode, [[shiftStartTime, shiftEndTime]]);
    }
  }
}

const validateEmployeeCode = (employeeCode: string): string[] => {
  if (employeeCode.length < 1) {
    return [strings.validations.workerShiftEntry.employeeCode.tooShort];
  } else if (!/^[a-zA-Z0-9]+$/.test(employeeCode)) {
    return [strings.validations.workerShiftEntry.employeeCode.illegalChars];
  } else {
    return [];
  }
};

const validateLastName = (existingWorker: WorkerDetails | undefined, lastName: string): string[] => {
  if (lastName.length < 1) {
    return [strings.validations.workerShiftEntry.lastName.tooShort];
  } else if (!!existingWorker?.lastName && existingWorker.lastName !== lastName) {
    return [strings.validations.workerShiftEntry.lastName.doesNotMatchPriorEntry];
  } else {
    return [];
  }
};

const validateFirstName = (existingWorker: WorkerDetails | undefined, firstName: string): string[] => {
  if (firstName.length < 1) {
    return [strings.validations.workerShiftEntry.firstName.tooShort];
  } else if (!!existingWorker?.firstName && existingWorker.firstName !== firstName) {
    return [strings.validations.workerShiftEntry.firstName.doesNotMatchPriorEntry];
  } else {
    return [];
  }
};

const validateBasePayRate = (existingWorker: WorkerDetails | undefined, parsedBasePayRate: MonetaryAmount | null,
  rawBasePayRate: string): string[] => {
  if (!/^\$?[0-9]+(\.[0-9]+)?$/.test(rawBasePayRate)) {
    return [strings.validations.workerShiftEntry.basePayRate.illegalFormat];
  }

  const failures: string[] = [];
  const parsedAmount = new Decimal(rawBasePayRate.replace('$', ''));
  if (parsedAmount.decimalPlaces() > 2) {
    failures.push(strings.validations.workerShiftEntry.basePayRate.illegalPrecision);
  }
  if (parsedAmount < new Decimal('0.01')) {
    failures.push(strings.validations.workerShiftEntry.basePayRate.tooLow);
  }

  if (!!existingWorker?.basePayRate && parsedBasePayRate && !existingWorker.basePayRate.equals(parsedBasePayRate)) {
    failures.push(strings.validations.workerShiftEntry.basePayRate.doesNotMatchPriorEntry);
  }

  return failures;
};

const validateShiftStartDate = (parsedShiftStartDate: LocalDate | null, rawShiftStartDate: string): string[] => {
  if (!/^[0-9]{1,2}\/[0-9]{1,2}\/([0-9]{2}|[0-9]{4})$/.test(rawShiftStartDate)) {
    return [strings.validations.workerShiftEntry.shiftStartDate.illegalFormat];
  }

  if (parsedShiftStartDate === null) {
    return [strings.validations.workerShiftEntry.shiftStartDate.invalidDate];
  } else {
    return [];
  }
};

const validateShiftStartTime = (shiftDateKnown: boolean, parsedShiftStartTime: LocalTime | null,
  rawShiftStartTime: string): string[] => {
  if (!/^[0-9]{1,2}:[0-9]{2}$/.test(rawShiftStartTime)) {
    return [strings.validations.workerShiftEntry.shiftStartTime.illegalFormat];
  }

  if (shiftDateKnown && parsedShiftStartTime === null) {
    return [strings.validations.workerShiftEntry.shiftStartTime.invalidTime];
  } else {
    return [];
  }
};

const validateShiftEndTime = (shiftDateKnown: boolean, shiftStartTime: ZonedDateTime | null,
  zonedShiftEndTime: ZonedDateTime | null,
  rawShiftEndTime: string): string[] => {
  if (!/^[0-9]{1,2}:[0-9]{2}$/.test(rawShiftEndTime)) {
    return [strings.validations.workerShiftEntry.shiftEndTime.illegalFormat];
  }

  if (shiftDateKnown && zonedShiftEndTime === null) {
    return [strings.validations.workerShiftEntry.shiftEndTime.invalidTime];
  }

  if (!!shiftStartTime && !!zonedShiftEndTime && !shiftStartTime.isBefore(zonedShiftEndTime)) {
    return [strings.validations.workerShiftEntry.shiftEndTime.beforeShiftStart];
  }

  return [];
};

const validateCasualLoading = (existingWorker: WorkerDetails | undefined, parsedCasualLoading: boolean | null) => {
  if (parsedCasualLoading === null) {
    return [strings.validations.workerShiftEntry.casualLoading.illegalValue];
  } else if (!!existingWorker && existingWorker.casualLoading !== null
    && existingWorker.casualLoading !== parsedCasualLoading) {
    return [strings.validations.workerShiftEntry.casualLoading.doesNotMatchPriorEntry];
  } else {
    return [];
  }
};

export const useShiftTableValidator = (): (() => boolean) => {
  const store = useStore<AppState>();

  const validateShiftTable = (): boolean => {
    const rows = store.getState().shiftEntry.rows
    const shifts = rows.map((row) => validatedToWorkerShift(row))
      .map((row) => normaliseRow(row))
      .slice(0, rows.length - 1);

    let isValid = true;

    new ShiftTableValidator(shifts).validateShiftRows().forEach(({ rowIndex, columns }) => {
      columns.forEach(({ columnId, failureMessages }) => {
        isValid = isValid && failureMessages.length === 0;
        store.dispatch(setCellValidationMessages({
          cellIdentifier: {
            rowIndex,
            columnId,
          },
          failureMessages: failureMessages,
        }));
      });
    });

    return isValid;
  };

  return validateShiftTable;
};
