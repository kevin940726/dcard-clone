import { useEffect, useRef } from 'react';
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
