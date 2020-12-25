import { css } from 'styled-components';
import { useInfiniteQuery } from 'react-query';
import useInfinite from '../hooks/use-infinite';
import Comment from './comment';

const PAGE_SIZE = 30;

export default function AllComments({ postID, Wrapper, modalRef }) {
  const {
    data,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery(`posts/${postID}/comments`, {
    getNextPageParam: (lastGroup, pages) =>
      lastGroup.length < PAGE_SIZE
        ? null
        : {
            after: pages
              .map((group) => group.length)
              .reduce((sum, cur) => sum + cur, 0),
          },
    staleTime: 10 * 60 * 1000, // 10 mins
  });

  const isLoading = isFetching || isFetchingNextPage;
  const anchor = useInfinite(fetchNextPage, isLoading, {
    rootRef: modalRef,
  });

  if (!data || !data.pages.length) {
    // TODO: skeleton?
    return null;
  }

  const allComments = data.pages.flat();

  return (
    <Wrapper>
      <div role="feed" aria-busy={isLoading}>
        {allComments.map((comment, index) => (
          <article
            key={comment.id}
            tabIndex="0"
            aria-posinset={index + 1}
            aria-setsize={allComments.length}
            aria-labelledby={`${comment.id}_title`}
            aria-describedby={`${comment.id}_header ${comment.id}_content`}
            css={css`
              &:focus:not(:focus-visible) {
                outline: none;
              }
            `}
          >
            <Comment {...comment} />
          </article>
        ))}
      </div>
      {hasNextPage && anchor}
    </Wrapper>
  );
}
