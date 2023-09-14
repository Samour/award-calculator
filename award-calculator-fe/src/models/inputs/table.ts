export type WorkerShiftColumnName = 'employeeCode'
  | 'lastName'
  | 'firstName'
  | 'basePayRate'
  | 'shiftStartDate'
  | 'shiftStartTime'
  | 'shiftEndTime'
  | 'casualLoading';

function coalesce<T>(value: T | undefined, reserveValue: T): T {
  return value === undefined ? reserveValue : value;
}

export class WorkerShiftRow {

  constructor(readonly employeeCode: string,
    readonly lastName: string,
    readonly firstName: string,
    readonly basePayRate: string,
    readonly shiftStartDate: string,
    readonly shiftStartTime: string,
    readonly shiftEndTime: string,
    readonly casualLoading: string,
    ) {}

    clone(update: Partial<WorkerShiftRow>): WorkerShiftRow {
      return new WorkerShiftRow(
        coalesce(update.employeeCode, this.employeeCode),
        coalesce(update.lastName, this.lastName),
        coalesce(update.firstName, this.firstName),
        coalesce(update.basePayRate, this.basePayRate),
        coalesce(update.shiftStartDate, this.shiftStartDate),
        coalesce(update.shiftStartTime, this.shiftStartTime),
        coalesce(update.shiftEndTime, this.shiftEndTime),
        coalesce(update.casualLoading, this.casualLoading),
      );
    }

    isEmpty(): boolean {
      return this.employeeCode === ''
        && this.lastName === ''
        && this.firstName === ''
        && this.basePayRate === ''
        && this.shiftStartDate === ''
        && this.shiftStartTime === ''
        && this.shiftEndTime === ''
        && this.casualLoading === '';
    }

    static empty(): WorkerShiftRow {
      return new WorkerShiftRow('', '', '', '', '', '', '', '');
    }
}
