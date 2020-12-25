import { useInfiniteQuery } from 'react-query';
import { useRouter } from 'next/router';
import { css } from 'styled-components';
import useInfinite from '../hooks/use-infinite';
import ForumItem from './forum-item';

const PAGE_SIZE = 30;

function SearchForumsList() {
  const router = useRouter();
  const { query } = router.query;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery(['search/forums', { query }], {
    getNextPageParam: (lastGroup, pages) =>
      lastGroup.length < PAGE_SIZE
        ? null
        : {
            offset: pages
              .map((page) => page.length)
              .reduce((sum, cur) => sum + cur, 0),
          },
    staleTime: Infinity,
  });

  const isLoading = isFetching || isFetchingNextPage;

  const anchor = useInfinite(fetchNextPage, isLoading);

  const forumsList = data ? data.pages.flat() : [];

  return (
    <>
      <div
        role="feed"
        aria-busy={isLoading}
        css={css`
          margin: 0 40px;
          padding: 0 20px;
        `}
      >
        {forumsList.map((forum, index) => (
          <article
            key={forum.id}
            aria-posinset={index + 1}
            aria-setsize={forumsList.length}
            aria-labelledby={`${forum.id}_title`}
          >
            <ForumItem forum={forum} />
          </article>
        ))}
      </div>
      {hasNextPage && anchor}
    </>
  );
}

SearchForumsList.prefetchQueries = async function prefetchQueries(
  queryClient,
  context
) {
  const { query } = context.router.query;

  await queryClient.prefetchInfiniteQuery(['search/forums', { query }]);
};

export default SearchForumsList;
