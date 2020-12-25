import { useInfiniteQuery } from 'react-query';
import { useRouter } from 'next/router';
import { css } from 'styled-components';
import useInfinite from '../hooks/use-infinite';
import PersonaItem from './persona-item';

const PAGE_SIZE = 30;

function SearchPersonasList() {
  const router = useRouter();
  const { query } = router.query;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery(['search/personas', { query }], {
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

  const personasList = data ? data.pages.flat() : [];

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
        {personasList.map((persona, index) => (
          <article
            key={persona.uid}
            aria-posinset={index + 1}
            aria-setsize={personasList.length}
            aria-labelledby={`${persona.uid}_title`}
            aria-describedby={`${persona.uid}_description`}
          >
            <PersonaItem persona={persona} />
          </article>
        ))}
      </div>
      {hasNextPage && anchor}
    </>
  );
}

SearchPersonasList.prefetchQueries = async function prefetchQueries(
  queryClient,
  context
) {
  const { query } = context.router.query;

  await queryClient.prefetchInfiniteQuery(['search/personas', { query }]);
};

export default SearchPersonasList;
