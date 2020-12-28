import { useEffect, useRef } from 'react';
import { css } from 'styled-components';
import { useRouter } from 'next/router';
import { Dialog, useDialogState } from './route-dialog';
import Floor from './floor';

export default function CommentModal() {
  const router = useRouter();
  const dialog = useDialogState({ animated: 150 });
  const { floor, stepsFromPost } = router.query;
  const isOpen = !!floor;
  const { show, hide } = dialog;
  const closeModalTimeoutRef = useRef();

  useEffect(() => {
    if (isOpen) {
      show();
    } else {
      hide();
    }
  }, [isOpen, show, hide]);

  function closeModal() {
    if (dialog.visible) {
      dialog.hide();
      closeModalTimeoutRef.current = setTimeout(() => {
        window.history.go(-parseInt(stepsFromPost ?? 1, 10));
      }, 150);
    }
  }

  useEffect(
    () => () => {
      clearTimeout(closeModalTimeoutRef.current);
    },
    []
  );

  return (
    (dialog.visible || dialog.animating) && (
      <Dialog
        dialog={dialog}
        visible={dialog.visible}
        hide={closeModal}
        hideOnClickOutside={false}
        backdropStyle={css`
          opacity: 0;
          transition: opacity 0.15s ease;

          &[data-enter] {
            opacity: 1;
          }
        `}
        css={css`
          width: 720px;
          padding: 6px 30px;
          border-radius: 12px;
          transform: scale(0.8);
          transition: transform 0.15s ease;
          opacity: ${isOpen ? 1 : 0};

          &[data-enter] {
            transform: scale(1);
          }
        `}
        tabIndex="0"
        aria-label={`B${floor}`}
      >
        {isOpen && <Floor />}
      </Dialog>
    )
  );
}
