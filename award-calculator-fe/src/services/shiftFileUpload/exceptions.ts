import { WorkerShiftColumnName } from 'models/inputs/table';

export abstract class ShiftFileParsingException extends Error { }

export class NotCsvContentTypeException extends ShiftFileParsingException { }

export class EmptyShiftFileException extends ShiftFileParsingException { }

export class CsvHeaderRepeated extends ShiftFileParsingException {

  constructor(readonly repeatedHeader: WorkerShiftColumnName) {
    super();
  }
}

export class CsvHeadersMissing extends ShiftFileParsingException {

  constructor(readonly missingHeaders: WorkerShiftColumnName[]) {
    super();
  }
}
