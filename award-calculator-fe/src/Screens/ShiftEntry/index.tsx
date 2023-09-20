import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useShiftFileUpload } from 'services/shiftFileUpload';
import { useShiftTableValidator } from 'services/ShiftTableValidator';
import strings from 'strings';
import { navigateToScreen } from 'store/navigation';
import { finishTableValidation, startTableValidation } from 'store/shiftEntry';
import { Screen } from 'models/store/navigation';
import { AppState } from 'models/store';
import FileSelect from 'Components/FileSelect';
import ShiftTable from './ShiftTable';
import ValidationNotification from './ValidationNotification';
import CsvParsingFailureNotification from './CsvParsingFailureNotification';

const selector = (state: AppState): boolean => state.shiftEntry.validationInProgress;

const ShiftEntry = (): JSX.Element => {
  const dispatch = useDispatch();
  const handleShiftFileUpload = useShiftFileUpload();
  const validateShiftTable = useShiftTableValidator();

  const [validationScrollNonce, setValidationScrollNonce] = useState('');

  const validationInProgress = useSelector(selector);

  const onComputePayClick = () => {
    console.log('Validation started');
    dispatch(startTableValidation());
    console.time('validateShiftData');
    if (validateShiftTable()) {
      dispatch(navigateToScreen(Screen.PAY_REPORT));
    } else {
      setValidationScrollNonce(`${Math.random()}`);
    }
    console.log('Validation completed');
    console.timeEnd('validateShiftData');
    dispatch(finishTableValidation());
  };

  return (
    <div className="ShiftEntry">
      <CsvParsingFailureNotification />
      <div className="row">
        <div className="twelve columns">
          <h1>{strings.screens.shiftEntry.title}</h1>
        </div>
      </div>
      <ValidationNotification scrollNonce={validationScrollNonce} />
      <div className="row">
        <div className="twelve columns">
          <ShiftTable />
        </div>
      </div>
      <div className="row">
        <div className="twelve columns">
          <button className="button-primary u-pull-right" disabled={validationInProgress} onClick={onComputePayClick}>
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
