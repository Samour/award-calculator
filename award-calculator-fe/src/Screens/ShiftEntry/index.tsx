import { useSelector } from 'react-redux';
import { useShiftFileUpload } from 'services/shiftFileUpload';
import { useComputeShiftPay } from 'services/computeShiftPay';
import strings from 'strings';
import { AppState } from 'models/store';
import FileSelect from 'Components/FileSelect';
import ShiftTable from './ShiftTable';
import ValidationNotification from './ValidationNotification';
import CsvParsingFailureNotification from './CsvParsingFailureNotification';

const selector = (state: AppState): boolean => state.shiftEntry.validationInProgress;

const ShiftEntry = (): JSX.Element => {
  const handleShiftFileUpload = useShiftFileUpload();
  const computeShiftPay = useComputeShiftPay();

  const validationInProgress = useSelector(selector);

  return (
    <div className="ShiftEntry">
      <CsvParsingFailureNotification />
      <div className="row">
        <div className="twelve columns">
          <h1>{strings.screens.shiftEntry.title}</h1>
        </div>
      </div>
      <ValidationNotification />
      <div className="row">
        <div className="twelve columns">
          <ShiftTable />
        </div>
      </div>
      <div className="row">
        <div className="twelve columns">
          <button className="button-primary u-pull-right" disabled={validationInProgress} onClick={computeShiftPay}>
            {
              validationInProgress ? strings.screens.shiftEntry.buttons.computePay.disabled :
                strings.screens.shiftEntry.buttons.computePay.active
            }
          </button>
          <FileSelect label={strings.screens.shiftEntry.buttons.uploadFile} className="u-pull-right u-spacer-right"
            onSelect={handleShiftFileUpload} />
        </div>
      </div>
    </div>
  );
};

export default ShiftEntry;
