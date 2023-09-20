import { useDispatch } from 'react-redux';
import { ShiftFileParser } from './ShiftFileParser';
import { handleCsvParsingError } from './errorHandler';

export const useShiftFileUpload = (): ((file: File) => Promise<void>) => {
  const dispatch = useDispatch();

  return async (file: File) => {
    try {
      const parsedRows = await new ShiftFileParser().parseFile(file);
      console.log(parsedRows);
    } catch (e) {
      handleCsvParsingError(dispatch)(e);
    }
  };
};
