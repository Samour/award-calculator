import { useDispatch } from 'react-redux';
import { useShiftFileUpload } from 'services/shiftFileUpload';
import { useShiftTableValidator } from 'services/ShiftTableValidator';
import strings from 'strings';
import { navigateToScreen } from 'store/navigation';
import { Screen } from 'models/store/navigation';
import FileSelect from 'Components/FileSelect';
import ShiftTable from './ShiftTable';
import ValidationNotification from './ValidationNotification';
import CsvParsingFailureNotification from './CsvParsingFailureNotification';

const ShiftEntry = (): JSX.Element => {
  const dispatch = useDispatch();
  const handleShiftFileUpload = useShiftFileUpload();
  const validateShiftTable = useShiftTableValidator();

  const onComputePayClick = () => {
    if (validateShiftTable()) {
      dispatch(navigateToScreen(Screen.PAY_REPORT));
    }
  };

  return (
    <div className="ShiftEntry">
      <CsvParsingFailureNotification/>
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
          <button className="button-primary u-pull-right" onClick={onComputePayClick}>
            {strings.screens.shiftEntry.buttons.computePay}
          </button>
          <FileSelect label={strings.screens.shiftEntry.buttons.uploadFile} className="u-pull-right u-spacer-right"
            onSelect={handleShiftFileUpload} />
        </div>
      </div>
    </div>
  );
};

export default ShiftEntry;
