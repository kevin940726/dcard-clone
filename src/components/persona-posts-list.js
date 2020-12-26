import { useMemo, Fragment } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { css } from 'styled-components';
import usePostsList from '../hooks/use-posts-list';
import useModalParentLocation from '../hooks/use-modal-parent-location';
import PostItem from './post-item';

const PAGE_SIZE = 30;

function PersonaPostsList() {
  const router = useRouter();
  const { postID } = router.query;
  const isModalOpen = !!postID;
  const modalParentLocation = useModalParentLocation(isModalOpen);
  const { persona } = modalParentLocation.query;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery(['personas/posts', { persona }], {
    getNextPageParam: (lastGroup, pages) =>
      lastGroup.length < PAGE_SIZE
        ? null
        : {
            before: lastGroup[PAGE_SIZE - 1].id,
          },
    staleTime: Infinity,
  });

  const isLoading = isFetching || isFetchingNextPage;

  const posts = useMemo(() => (data ? data.pages.flat() : []), [data]);

  const [modal, activePostItemRef] = usePostsList(posts, {
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  });

  const postsGroupedByMonth = useMemo(() => {
    const groups = {};

    posts.forEach((post) => {
      const postDate = new Date(post.createdAt);
      const month = `${postDate.getFullYear()}年${postDate.getMonth() + 1}月`;
      groups[month] = groups[month] ?? [];
      groups[month].push(post);
    });

    return Object.entries(groups);
  }, [posts]);

  return (
    <>
      <div role="feed" aria-busy={isLoading}>
        {postsGroupedByMonth.map(([month, groupPosts]) => (
          <Fragment key={month}>
            <h3
              css={css`
                font-weight: 500;
                font-size: 12px;
                line-height: 17px;
                color: rgba(0, 0, 0, 0.45);
                margin: 0 0 8px;
              `}
            >
              {month}
            </h3>
            {groupPosts.map((post, index) => (
              <article
                key={post.id}
                aria-posinset={index + 1}
                aria-setsize={posts.length}
                aria-labelledby={`${post.id}_title`}
                aria-describedby={`${post.id}_header ${post.id}_description ${post.id}_footer`}
                css={css`
                  display: flex;
                  position: relative;
                  margin: 0;
                  padding: 20px;
                  text-decoration: none;
                  background-color: #fff;

                  &:after {
                    content: '';
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    height: 1px;
                    margin: 0 40px;
                    background-color: rgba(0, 0, 0, 0.1);
                  }

                  ${index === 0 &&
                  css`
                    border-top: 8px solid #fff;
                    border-top-left-radius: 12px;
                    border-top-right-radius: 12px;
                  `}

                  ${index === groupPosts.length - 1 &&
                  css`
                    border-bottom: 8px solid #fff;
                    border-bottom-left-radius: 12px;
                    border-bottom-right-radius: 12px;
                    margin-bottom: 24px;

                    &:after {
                      content: none;
                    }
                  `}
                `}
              >
                <Link
                  href={{
                    pathname: router.pathname,
                    query: {
                      postID: post.id,
                      persona,
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
                    {...post}
                  />
                </Link>
              </article>
            ))}
          </Fragment>
        ))}
      </div>

      {modal}
    </>
  );
}

PersonaPostsList.prefetchQueries = async function prefetchQueries(
  queryClient,
  context
) {
  const { persona } = context.router.query;

  await queryClient.prefetchInfiniteQuery(['personas/posts', { persona }]);
};

export default PersonaPostsList;
