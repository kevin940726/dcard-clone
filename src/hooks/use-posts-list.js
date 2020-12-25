import { useEffect, useRef } from 'react';
import { css } from 'styled-components';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import useCurrent from './use-current';
import useInfinite from './use-infinite';

const PostModal = dynamic(() => import('../components/post-modal'), {
  ssr: false,
});

export default function usePostsList(
  posts,
  { fetchNextPage, hasNextPage, isFetching, isFetchingNextPage }
) {
  const router = useRouter();

  const activePostItemRef = useRef();

  const isLoading = isFetching || isFetchingNextPage;

  const anchor = useInfinite(fetchNextPage, isLoading);
  const postsLengthRef = useCurrent(posts.length);
  const postIndex = parseInt(router.query.postIndex, 10);

  const prevPost = posts[postIndex - 1];
  const nextPost = posts[postIndex + 1];

  useEffect(() => {
    if (postIndex === postsLengthRef.current - 1 && hasNextPage) {
      fetchNextPage();
    }
  }, [postIndex, postsLengthRef, fetchNextPage, hasNextPage]);

  const children = (
    <>
      {hasNextPage && anchor}
      {!isFetching && !hasNextPage && (
        <div
          css={css`
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            height: 120px;
            color: rgba(0, 0, 0, 0.35);
            font-size: 14px;
          `}
        >
          沒有更多文章囉！
        </div>
      )}
      <PostModal
        placeholderData={posts[postIndex]}
        prevPost={prevPost}
        prevPostIndex={postIndex - 1}
        nextPost={nextPost}
        nextPostIndex={postIndex + 1}
        activePostItemRef={activePostItemRef}
      />
    </>
  );

  return [children, activePostItemRef];
}
