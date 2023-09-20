export abstract class ShiftFileParsingException extends Error { }

export class NotCsvContentTypeException extends ShiftFileParsingException { }

export class EmptyShiftFileException extends ShiftFileParsingException { }
