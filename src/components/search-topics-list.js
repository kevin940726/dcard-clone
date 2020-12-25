import { useInfiniteQuery } from 'react-query';
import { useRouter } from 'next/router';
import { css } from 'styled-components';
import useInfinite from '../hooks/use-infinite';
import TopicItem from './topic-item';

const PAGE_SIZE = 30;

function SearchTopicsList() {
  const router = useRouter();
  const { query } = router.query;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery(['search/topics', { query }], {
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

  const topicsList = data ? data.pages.flat() : [];

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
        {topicsList.map((topic, index) => (
          <article
            key={topic.id}
            aria-posinset={index + 1}
            aria-setsize={topicsList.length}
            aria-labelledby={`${topic.id}_title`}
            aria-describedby={`${topic.id}_description`}
          >
            <TopicItem topic={topic} />
          </article>
        ))}
      </div>
      {hasNextPage && anchor}
    </>
  );
}

SearchTopicsList.prefetchQueries = async function prefetchQueries(
  queryClient,
  context
) {
  const { query } = context.router.query;

  await queryClient.prefetchInfiniteQuery(['search/topics', { query }]);
};

export default SearchTopicsList;
