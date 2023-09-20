import { useDispatch } from 'react-redux';
import { workerShiftToEmptyValidated } from 'models/converters/workerShift';
import { populateWorkerShiftTable } from 'store/shiftEntry';
import { ShiftFileParser } from './ShiftFileParser';
import { handleCsvParsingError } from './errorHandler';

export const useShiftFileUpload = (): ((file: File) => Promise<void>) => {
  const dispatch = useDispatch();

  return async (file: File) => {
    try {
      const parsedRows = await new ShiftFileParser().parseFile(file);
      dispatch(populateWorkerShiftTable({
        rows: parsedRows.map((r) => workerShiftToEmptyValidated(r)),
      }));
    } catch (e) {
      handleCsvParsingError(dispatch)(e);
    }
  };
};
