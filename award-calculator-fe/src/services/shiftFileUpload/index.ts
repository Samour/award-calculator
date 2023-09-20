import { useDispatch } from 'react-redux';
import { ShiftFileParser } from './ShiftFileParser';
import { handleCsvParsingError } from './errorHandler';

export const useShiftFileUpload = (): ((file: File) => Promise<void>) => {
  const dispatch = useDispatch();

  return async (file: File) => {
    try {
      await new ShiftFileParser().uploadFile(file);
    } catch (e) {
      handleCsvParsingError(dispatch)(e);
    }
  };
};
