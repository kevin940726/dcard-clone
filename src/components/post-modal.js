import { useEffect, useCallback, useMemo, useRef } from 'react';
import { css } from 'styled-components';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useDialogState, Dialog, DialogBackdrop } from 'reakit';
import CloseIcon from './close-icon';
import PostArrowLink, { PostArrowBackground } from './post-arrow-link';

const Post = dynamic(() => import('../components/post'));

function ScrollPositionManager({ modalRef }) {
  const router = useRouter();
  const { postID } = router.query;

  useEffect(
    function scrollToTopWhenOpeningModal() {
      if (postID && modalRef.current) {
        modalRef.current.scrollTop = 0;
      }
    },
    [postID, modalRef]
  );

  return null;
}

export default function PostModal({
  placeholderData,
  children,
  prevPost,
  prevPostIndex,
  nextPost,
  nextPostIndex,
  activePostItemRef,
}) {
  const modalRef = useRef();

  const dialog = useDialogState();
  const router = useRouter();
  const { postID, stepsFromList } = router.query;
  const isOpen = !!postID;

  const closeModal = useCallback(() => {
    window.history.go(-parseInt(stepsFromList ?? 1, 10));
  }, [stepsFromList]);

  const closeButton = useMemo(
    () => (
      <button
        aria-label="Close"
        onClick={closeModal}
        css={css`
          cursor: pointer;

          svg {
            width: 24px;
            height: 24px;
            fill: rgb(196, 196, 196);
            transition: fill 0.15s cubic-bezier(0.4, 0, 0.2, 1);
          }

          &:hover svg {
            fill: rgb(51, 151, 207);
          }
        `}
      >
        <CloseIcon />
      </button>
    ),
    [closeModal]
  );

  return (
    <DialogBackdrop
      {...dialog}
      visible={isOpen}
      css={css`
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        overflow-y: scroll;
        overflow-x: hidden;
        z-index: 100;
      `}
      ref={modalRef}
    >
      <Dialog
        {...dialog}
        visible={isOpen}
        hide={closeModal}
        css={css`
          position: relative;
          top: 0;
          width: 728px;
          min-height: 100%;
          margin: 0 auto;
          background: #fff;

          &:focus:not(:focus-visible) {
            outline: none;
          }
        `}
        aria-labelledby="post-title"
        unstable_finalFocusRef={activePostItemRef}
      >
        {isOpen && (
          <>
            <ScrollPositionManager modalRef={modalRef} />

            <Post
              postID={postID}
              placeholderData={placeholderData}
              closeButton={closeButton}
              modalRef={modalRef}
            />

            {prevPost && (
              <PostArrowLink
                post={prevPost}
                postIndex={prevPostIndex}
                activePostItemRef={activePostItemRef}
                direction="left"
              />
            )}
            {nextPost && (
              <PostArrowLink
                post={nextPost}
                postIndex={nextPostIndex}
                activePostItemRef={activePostItemRef}
                direction="right"
              />
            )}
            <PostArrowBackground />
          </>
        )}
      </Dialog>
    </DialogBackdrop>
  );
}
