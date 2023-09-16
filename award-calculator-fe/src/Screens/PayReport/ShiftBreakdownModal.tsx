import Modal from 'Components/Modal';

interface ShiftBreakdownModalProps {
  open: boolean;
  onClose: () => void;
}

const ShiftBreakdownModal = ({ open, onClose }: ShiftBreakdownModalProps): JSX.Element => {
  return (
    <Modal className="shift-pay-breakdown-modal" open={open} onClose={onClose}>
      <strong>This is some modal content</strong>
    </Modal>
  );
};

export default ShiftBreakdownModal;
