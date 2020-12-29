import { forwardRef } from 'react';
import { css } from 'styled-components';
import {
  Dialog as BaseDialog,
  useDialogState,
  DialogBackdrop as BaseDialogBackdrop,
} from 'reakit';

const Dialog = forwardRef(
  ({ visible, dialog, backdropStyle, children, hide, ...props }, ref) => (
    <BaseDialogBackdrop
      {...dialog}
      visible={visible}
      css={css`
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        overflow-y: scroll;
        overflow-x: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 100;

        ${backdropStyle || ''}
      `}
      ref={ref}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          hide();
        }
      }}
    >
      <BaseDialog
        {...dialog}
        visible={visible}
        hideOnClickOutside={false}
        hide={hide}
        css={css`
          position: relative;
          margin: auto;
          background: #fff;

          &:focus:not(:focus-visible) {
            outline: none;
          }
        `}
        {...props}
      >
        {(visible || (!!dialog.animated && dialog.animating)) && children}
      </BaseDialog>
    </BaseDialogBackdrop>
  )
);

export { Dialog, useDialogState };
