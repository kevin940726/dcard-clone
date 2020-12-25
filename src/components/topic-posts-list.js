import { useInfiniteQuery } from 'react-query';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { css } from 'styled-components';
import usePostsList from '../hooks/use-posts-list';
import useModalParentLocation from '../hooks/use-modal-parent-location';
import PostItem from './post-item';

const PAGE_SIZE = 30;

function TopicPostsList() {
  const router = useRouter();
  const { postID } = router.query;
  const isModalOpen = !!postID;
  const modalParentLocation = useModalParentLocation(isModalOpen);
  const { topic, latest } = modalParentLocation.query;
  const sort = latest ? 'created' : 'like';

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery(['topics/posts', { topic, sort }], {
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
        {posts.map((post, index) => (
          <article
            key={post.id}
            aria-posinset={index + 1}
            aria-setsize={posts.length}
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
                  topic,
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
                {...post}
              />
            </Link>
          </article>
        ))}
      </div>

      {modal}
    </>
  );
}

TopicPostsList.prefetchQueries = async function prefetchQueries(
  queryClient,
  context
) {
  const { topic, latest } = context.router.query;
  const sort = latest ? 'created' : 'like';

  await queryClient.prefetchInfiniteQuery(['topics/posts', { topic, sort }]);
};

export default TopicPostsList;
