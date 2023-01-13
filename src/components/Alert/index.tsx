import React, {
  forwardRef,
  ForwardRefRenderFunction,
  ReactElement,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Modal } from 'bootstrap';
export type IAlert = {
  toggle: () => void;
};

type props = {
  onClose?: () => void;
  backdrop?: boolean | 'static';
  children?: ReactElement;
};

const Alert: ForwardRefRenderFunction<IAlert, props> = (
  { children, onClose, backdrop = 'static' },
  ref
) => {
  const modalToggleRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isShown, setIsShown] = useState(false);
  useEffect(() => {
    const modal = modalRef.current;

    const close = () => {
      onClose && onClose();
    };

    modal?.addEventListener('hidden.bs.modal', close);

    return () => {
      return modal?.removeEventListener('hidden.bs.modal', close);
    };
  }, [modalRef.current]);

  const showModal = () => {
    setIsShown(true);
    const modalEle = modalRef.current;
    if (modalEle) {
      const bsModal = new Modal(modalEle, {
        backdrop,
        keyboard: false,
      });
      bsModal.show();
    }
  };

  const hideModal = () => {
    setIsShown(false);
    const modalEle = modalRef.current;
    if (modalEle) {
      const bsModal = Modal.getInstance(modalEle);
      bsModal?.hide();
    }
  };

  const toggle = () => {
    if (isShown) {
      hideModal();
    } else {
      showModal();
    }
  };

  useImperativeHandle(ref, () => ({
    toggle,
  }));

  return (
    <>
      <div
        className="modal fade"
        id="exampleModalToggle"
        ref={modalRef}
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered modal-sm">
          <div className="modal-content">
            <div className="modal-body">{children}</div>
          </div>
        </div>
      </div>
      <button ref={modalToggleRef} className="d-none" data-bs-toggle="modal">
        Open first modal
      </button>
    </>
  );
};

export default forwardRef(Alert);
