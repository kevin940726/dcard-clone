import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { css } from 'styled-components';
import usePostsList from '../hooks/use-posts-list';
import useModalParentLocation from '../hooks/use-modal-parent-location';
import PostItem from './post-item';
import dedupe from '../utils/dedupe';

function PostsList() {
  const router = useRouter();
  const modalParentLocation = useModalParentLocation(!!router.query.postID);
  const { forumAlias, latest } = modalParentLocation.query;
  const popular = !latest;
  const shouldShowForumName = !forumAlias;
  const shouldShowDateTime = !popular && !!forumAlias;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery(['posts', { forum: forumAlias, popular }], {
    getNextPageParam: (lastGroup) => lastGroup.nextQuery,
    staleTime: 5 * 60 * 1000, // 5 mins
  });

  const isLoading = isFetching || isFetchingNextPage;

  const posts = useMemo(
    () =>
      data
        ? dedupe(
            data.pages.flatMap((page) => page.items),
            (post) => post.id
          )
        : [],
    [data]
  );

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
                pathname: forumAlias ? `/f/${forumAlias}` : '/f',
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
                shouldShowForumName={shouldShowForumName}
                shouldShowDateTime={shouldShowDateTime}
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

PostsList.prefetchQueries = async function prefetchQueries(
  queryClient,
  context
) {
  const { forumAlias, latest } = context.router.query;

  await queryClient.prefetchInfiniteQuery([
    'posts',
    { forum: forumAlias, popular: !latest },
  ]);
};

export default PostsList;
