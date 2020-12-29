import { css } from 'styled-components';
import Image from 'next/image';
import {
  useDialogState,
  Dialog,
  DialogBackdrop,
  DialogDisclosure,
  VisuallyHidden,
} from 'reakit';

// TODO: Load the placeholder
export default function ZoomableImage({ children, ...props }) {
  const dialog = useDialogState({ animated: true });

  return (
    <>
      <DialogDisclosure
        {...dialog}
        type="button"
        css={css`
          cursor: zoom-in;

          /* Weird hack for next/image to work in post content in Safari */
          > div {
            max-height: 60vh;
          }
        `}
      >
        {children || <Image {...props} />}
        <VisuallyHidden>放大圖片</VisuallyHidden>
      </DialogDisclosure>

      {(dialog.visible || dialog.animating) && (
        <DialogBackdrop
          {...dialog}
          css={css`
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 200;
            opacity: 0;
            transition: opacity 0.15s ease;

            &[data-enter] {
              opacity: 1;
            }

            img {
              transform: scale(0.8);
              transition: transform 0.15s ease;
            }

            &[data-enter] img {
              transform: scale(1);
            }
          `}
        >
          <Dialog {...dialog} aria-label="Zoomed in image">
            <button
              type="button"
              onClick={dialog.hide}
              css={css`
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: zoom-out;
              `}
            >
              <img
                src={props.src}
                alt={props.alt}
                css={css`
                  max-width: 100%;
                  max-height: 100%;
                  object-fit: contain;
                `}
              />
              <VisuallyHidden>縮小圖片</VisuallyHidden>
            </button>
          </Dialog>
        </DialogBackdrop>
      )}
    </>
  );
}
