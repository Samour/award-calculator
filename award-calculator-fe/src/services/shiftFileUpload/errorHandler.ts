import { Dispatch } from '@reduxjs/toolkit';
import strings from 'strings';
import { displayCsvParsingFailureMessage } from 'store/shiftEntry';
import { CsvHeaderRepeated, CsvHeadersMissing, EmptyShiftFileException, NotCsvContentTypeException } from './exceptions';

const selectMessage = (e: any): string => {
  if (e instanceof NotCsvContentTypeException) {
    return strings.exceptions.csvShiftUpload.notCsvFile;
  } else if (e instanceof EmptyShiftFileException) {
    return strings.exceptions.csvShiftUpload.invalidHeaders;
  } else if (e instanceof CsvHeaderRepeated) {
    return strings.exceptions.csvShiftUpload.headerRepeated(e.repeatedHeader);
  } else if (e instanceof CsvHeadersMissing) {
    return strings.exceptions.csvShiftUpload.headersMissing(e.missingHeaders);
  } else {
    return strings.exceptions.csvShiftUpload.unknownError;
  }
};

export const handleCsvParsingError = (dispatch: Dispatch) => (e: any) => {
  dispatch(displayCsvParsingFailureMessage({
    message: selectMessage(e),
  }));
};
