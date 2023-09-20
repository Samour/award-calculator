import { useStore } from 'react-redux';
import { AppState } from 'models/store';

export const useComputeShiftPay = (): (() => void) => {
  const store = useStore<AppState>();
  
  return () => {

  };
};
