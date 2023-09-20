import { ShiftFileParser } from './ShiftFileParser';

export const useShiftFileUpload = (): ((file: File) => void) => {
  return (file: File) => {
    new ShiftFileParser().uploadFile(file);
  };
};
