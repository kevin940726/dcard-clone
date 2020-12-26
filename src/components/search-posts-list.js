import { useInfiniteQuery } from 'react-query';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { css } from 'styled-components';
import useModalParentLocation from '../hooks/use-modal-parent-location';
import usePostsList from '../hooks/use-posts-list';
import PostItem from './post-item';

const PAGE_SIZE = 30;

function PostArticle({ post, index, totalSize, activePostItemRef }) {
  const router = useRouter();

  return (
    <article
      key={post.id}
      aria-posinset={index + 1}
      aria-setsize={totalSize}
      aria-labelledby={`${post.id}_title`}
      aria-describedby={`${post.id}_header ${post.id}_description ${post.id}_footer`}
      css={css`
        display: flex;
        position: relative;
        margin: 0 40px;
        padding: 20px;
        border-bottom: 1px solid rgb(233, 233, 233);
        text-decoration: none;
      `}
    >
      <Link
        href={{
          pathname: router.pathname,
          query: {
            postID: post.id,
            forumAlias: post.forumAlias,
            postIndex: index,
          },
        }}
        as={`/f/${post.forumAlias}/p/${post.id}`}
        shallow
        scroll={false}
        passHref
      >
        <PostItem
          shouldShowForumName
          handleClick={(event) => {
            activePostItemRef.current = event.currentTarget;
          }}
          highlight
          {...post}
        />
      </Link>
    </article>
  );
}

function SearchPostsList({ thirdSlot }) {
  const router = useRouter();
  const { postID } = router.query;
  const isModalOpen = !!postID;
  const modalParentLocation = useModalParentLocation(isModalOpen);
  const { query, sort, since, field, forum } = modalParentLocation.query;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery(['search/posts', { query, sort, since, field, forum }], {
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
  const posts = data ? data.pages.flat() : [];

  const [modal, activePostItemRef] = usePostsList(posts, {
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  });

  return (
    <>
      <div role="feed" aria-busy={isLoading}>
        {posts.slice(0, 2).map((post, index) => (
          <PostArticle
            key={post.id}
            post={post}
            index={index}
            totalSize={posts.length}
            activePostItemRef={activePostItemRef}
          />
        ))}

        {thirdSlot}

        {posts.slice(2).map((post, index) => (
          <PostArticle
            key={post.id}
            post={post}
            index={index}
            totalSize={posts.length}
            activePostItemRef={activePostItemRef}
          />
        ))}
      </div>

      {modal}
    </>
  );
}

SearchPostsList.prefetchQueries = async function prefetchQueries(
  queryClient,
  context
) {
  const { query, sort, since, field } = context.router.query;

  await queryClient.prefetchInfiniteQuery([
    'search/posts',
    { query, sort, since, field },
  ]);
};

export default SearchPostsList;
