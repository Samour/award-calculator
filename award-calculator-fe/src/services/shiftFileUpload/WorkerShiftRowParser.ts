import { WorkerShiftColumnName, WorkerShiftRow } from 'models/inputs/table';
import { CsvHeaderRepeated, CsvHeadersMissing } from './exceptions';

type FieldIndexes = { [key in WorkerShiftColumnName]: number };

const normalisedColumnNames: { [key in string]: WorkerShiftColumnName } = {
  'employeecode': 'employeeCode',

  'lastname': 'lastName',

  'firstname': 'firstName',

  'basepayrate': 'basePayRate',
  'payrate': 'basePayRate',

  'shiftstartdate': 'shiftStartDate',
  'startdate': 'shiftStartDate',
  'shiftdate': 'shiftStartDate',
  'date': 'shiftStartDate',

  'shiftstarttime': 'shiftStartTime',
  'starttime': 'shiftStartTime',

  'shiftendtime': 'shiftEndTime',
  'endtime': 'shiftEndTime',

  'casualloading': 'casualLoading',
};

const splitFields = (rawRow: string): string[] => {
  const fields = [];
  let inQuote = false;
  let inEscape = false;
  let currentField = '';

  for (let c of rawRow) {
    if (inEscape) {
      currentField += c;
      inEscape = false;
    } else if (c === '\\') {
      inEscape = true;
    } else if (c === '"') {
      inQuote = !inQuote;
    } else if (!inQuote && c === ',') {
      fields.push(currentField);
      currentField = '';
    } else {
      currentField += c;
    }
  }
  fields.push(currentField);

  return fields;
};

const normaliseHeader = (header: string): string =>
  header.trim()
    .replaceAll(' ', '')
    .replaceAll('_', '')
    .toLowerCase();

export class WorkerShiftRowParser {

  constructor(private readonly fieldIndexes: FieldIndexes) { }

  parseRow(rawRow: string): WorkerShiftRow {
    const fields = splitFields(rawRow);

    return {
      employeeCode: fields[this.fieldIndexes.employeeCode] || '',
      lastName: fields[this.fieldIndexes.lastName] || '',
      firstName: fields[this.fieldIndexes.firstName] || '',
      basePayRate: fields[this.fieldIndexes.basePayRate] || '',
      shiftStartDate: fields[this.fieldIndexes.shiftStartDate] || '',
      shiftStartTime: fields[this.fieldIndexes.shiftStartTime] || '',
      shiftEndTime: fields[this.fieldIndexes.shiftEndTime] || '',
      casualLoading: fields[this.fieldIndexes.casualLoading] || '',
    };
  }
}

export const buildWorkerShiftRowParser = (rawHeaderRow: string): WorkerShiftRowParser => {
  const fields = splitFields(rawHeaderRow);

  const fieldIndexes: Partial<FieldIndexes> = {};
  const missingColumns: Set<WorkerShiftColumnName> = new Set<WorkerShiftColumnName>([
    'employeeCode',
    'lastName',
    'firstName',
    'basePayRate',
    'shiftStartDate',
    'shiftStartTime',
    'shiftEndTime',
    'casualLoading',
  ]);

  for (let i = 0; i < fields.length; i++) {
    const columnName = normalisedColumnNames[normaliseHeader(fields[i])];
    if (!columnName) {
      continue;
    }

    if (columnName in fieldIndexes) {
      throw new CsvHeaderRepeated(columnName);
    } else {
      fieldIndexes[columnName] = i;
      missingColumns.delete(columnName);
    }
  }

  if (missingColumns.size > 0) {
    throw new CsvHeadersMissing(Array.from(missingColumns));
  }

  return new WorkerShiftRowParser(fieldIndexes as FieldIndexes);
};
