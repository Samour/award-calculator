import { PropsWithChildren, SyntheticEvent, useEffect, useRef } from 'react';
import strings from 'strings';
import './style.css';

interface ModalProps {
  className?: string;
  open: boolean;
  backdrop?: boolean;
  onClose?: () => void;
}

const Modal = ({
  className,
  open,
  backdrop = true,
  children,
  onClose,
}: PropsWithChildren<ModalProps>): JSX.Element => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [open]);

  const handleCloseEvent = (e: SyntheticEvent<HTMLDialogElement>) => {
    e.preventDefault();
    onClose?.();
  };

  let dialogClassName = 'Modal';
  if (!backdrop) {
    dialogClassName += ' no-backdrop';
  }
  if (className) {
    dialogClassName += ' ' + className;
  }

  return (
    <dialog ref={ref} className={dialogClassName} onCancel={handleCloseEvent}>
      <button className="modal-close" onClick={onClose}>&times;</button>
      <div className="container">
        {children}
        <div className="row">
          <div className="twelve columns">
            <button className="u-pull-right" onClick={onClose}>
              {strings.components.modal.buttons.close}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default Modal;
