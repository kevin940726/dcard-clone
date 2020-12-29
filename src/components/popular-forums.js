import { css } from 'styled-components';
import { useInfiniteQuery } from 'react-query';
import Image from 'next/image';
import Link from 'next/link';
import useInfinite from '../hooks/use-infinite';
import { useForumsQuery } from '../hooks/use-forums-query';

function ForumItem({ forumAlias, name, logo, isTop3 }) {
  return (
    <li>
      <Link href={`/f/${forumAlias}`} passHref>
        <a
          css={css`
            display: flex;
            align-items: center;
            height: 88px;
            border-bottom: 1px solid rgb(217, 217, 217);
            color: rgba(0, 0, 0, 0.75);

            &:before {
              counter-increment: popular-forums-count;
              content: counter(popular-forums-count);
              text-align: right;
              min-width: 18px;
              font-size: 16px;
              color: ${isTop3 ? 'rgb(234, 92, 92)' : 'rgba(0, 0, 0, 0.75)'};
              margin-right: 20px;
            }
          `}
        >
          <span
            css={css`
              display: inline-flex;
              flex-shrink: 0;
              border-radius: 50%;
              overflow: hidden;
              margin-right: 20px;
            `}
          >
            <Image
              src={logo ?? '/forum-logo-placeholder.svg'}
              alt=""
              width={48}
              height={48}
            />
          </span>
          <span
            css={css`
              font-size: 16px;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            `}
          >
            {name}
          </span>
        </a>
      </Link>
    </li>
  );
}

function PopularForums() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery('forums/popular-forums', {
    getNextPageParam: (lastGroup) =>
      lastGroup.nextKey
        ? {
            pageKey: lastGroup.nextKey,
          }
        : null,
    staleTime: Infinity,
    structuralSharing: false,
  });
  const isLoading = isFetching || isFetchingNextPage;
  const anchor = useInfinite(fetchNextPage, isLoading);

  const popularForums = data ? data.pages.flatMap((page) => page.items) : [];

  const { data: forums } = useForumsQuery();

  return (
    <div
      css={css`
        margin: 40px;
        border: 1px solid rgb(217, 217, 217);
        border-radius: 4px 4px 0px 0px;
        padding: 20px;
      `}
    >
      <h1
        css={css`
          font-size: 14px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.5);
          margin: 0 0 10px;
        `}
      >
        即時熱門看板
      </h1>

      <ol
        css={css`
          display: flex;
          flex-direction: column;
          counter-reset: popular-forums-count;
          list-style: none;
        `}
      >
        {popularForums.map((forum, index) => (
          <ForumItem
            key={forum.id}
            name={forum.name}
            forumAlias={forum.alias}
            logo={forums?.[forum.id]?.logo?.url}
            isTop3={index < 3}
          />
        ))}

        {hasNextPage && anchor}
      </ol>
    </div>
  );
}

PopularForums.prefetchQueries = async function prefetchQueries(queryClient) {
  await queryClient.prefetchInfiniteQuery('forums/popular-forums');
};

export default PopularForums;
