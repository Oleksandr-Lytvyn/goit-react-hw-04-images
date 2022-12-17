import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ModalBackdrop, ModalWindow } from './Modal.styled';

const modalRoot = document.querySelector('#modal-root');

export function Modal({ toggle, children }) {
  function keyDown(e) {
    if (e.code === 'Escape') {
      return toggle(false);
    }
  }
  function handleOnClick(e) {
    if (e.currentTarget === e.target) {
      return toggle(false);
    }
  }
  useEffect(() => {
    window.addEventListener('keydown', keyDown);
    return () => {
      window.removeEventListener('keydown', keyDown);
    };
  });

  return createPortal(
    <ModalBackdrop className="modal_backdrop" onClick={handleOnClick}>
      <ModalWindow className="modal__content">{children}</ModalWindow>
    </ModalBackdrop>,
    modalRoot
  );
}

// componentDidMount() {
//     console.log('modal component did mount');
//     window.addEventListener('keydown', this.keyDown);
//   }
