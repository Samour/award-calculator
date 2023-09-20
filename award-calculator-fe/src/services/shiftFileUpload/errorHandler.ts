import { Dispatch } from '@reduxjs/toolkit';
import strings from 'strings';
import { displayCsvParsingFailureMessage } from 'store/shiftEntry';
import { EmptyShiftFileException, NotCsvContentTypeException } from './exceptions';

const selectMessage = (e: any): string => {
  if (e instanceof NotCsvContentTypeException) {
    return strings.exceptions.csvShiftUpload.notCsvFile;
  } else if (e instanceof EmptyShiftFileException) {
    return strings.exceptions.csvShiftUpload.invalidHeaders;
  } else {
    return strings.exceptions.csvShiftUpload.unknownError;
  }
};

export const handleCsvParsingError = (dispatch: Dispatch) => (e: any) => {
  dispatch(displayCsvParsingFailureMessage({
    message: selectMessage(e),
  }));
};
