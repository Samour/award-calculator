import { useDispatch, useSelector } from 'react-redux';
import { closeParsingFailureModal } from 'store/shiftEntry';
import { AppState } from 'models/store';
import { CsvFileParsingError } from 'models/store/shiftEntry';
import Alert from 'Components/Alert';
import Modal from 'Components/Modal';

const selector = (state: AppState): CsvFileParsingError => state.shiftEntry.csvFileParsingError;

const CsvParsingFailureNotification = (): JSX.Element => {
  const dispatch = useDispatch();
  const { open, message } = useSelector(selector);

  const onClose = () => dispatch(closeParsingFailureModal());

  return (
    <Modal open={open} onClose={onClose}>
      <Alert>
        <div className="csv-parsing-validation-message">
          <strong>Reading CSV file failed</strong>
          <div>{message}</div>
        </div>
      </Alert>
    </Modal>
  );
};

export default CsvParsingFailureNotification;
