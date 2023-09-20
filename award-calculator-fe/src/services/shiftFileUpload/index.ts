import { useDispatch } from 'react-redux';
import { ShiftFileParser } from './ShiftFileParser';
import { handleCsvParsingError } from './errorHandler';
import { populateWorkerShiftTable } from 'store/shiftEntry';
import { workerShiftToEmptyValidated } from 'models/converters/workerShift';

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
