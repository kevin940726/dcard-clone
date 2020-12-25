import { css } from 'styled-components';
import Link from 'next/link';
import { useQuery, useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import Head from '../../components/head';
import SearchPostsList from '../../components/search-posts-list';
import withLayout from '../../components/with-layout';
import Layout from '../../components/layout';
import Search from '../../components/search';
import ForumCard from '../../components/forum-card';
import TopicItem from '../../components/topic-item';
import useModalParentLocation from '../../hooks/use-modal-parent-location';

// TODO: Show up to 5 forums and a slider.
function ForumsSection({ query }) {
  const queryClient = useQueryClient();
  const forumsLimit30 = queryClient.getQueryData(['search/forums', { query }]);
  const { data: forumsLimit4 = [] } = useQuery(
    ['search/forums', { query, limit: 4 }],
    { staleTime: Infinity, enabled: !forumsLimit30 }
  );

  const forums = (forumsLimit30 ?? forumsLimit4).slice(0, 4);

  if (!forums.length) {
    return null;
  }

  return (
    <section
      aria-labelledby="forums-search-results"
      css={css`
        padding: 20px;
        margin: 0px 40px;
        border-bottom: 1px solid rgb(233, 233, 233);
      `}
    >
      <h2
        id="forums-search-results"
        css={css`
          color: rgba(0, 0, 0, 0.75);
          margin: 0;
          font-size: 14px;
        `}
      >
        看板
      </h2>

      <ul
        css={css`
          display: flex;
          margin: 8px -14px 24px;
          padding: 0 12px;
          list-style: none;
        `}
      >
        {forums.map((forum) => (
          <li
            key={forum.id}
            css={css`
              margin-right: 8px;

              &:last-child {
                margin-right: 0;
              }
            `}
          >
            <ForumCard forum={forum} />
          </li>
        ))}
      </ul>

      <Link
        href={{
          pathname: '/search/forums',
          query: { query },
        }}
      >
        <a>查看更多看板</a>
      </Link>
    </section>
  );
}

function TopicsSection({ query }) {
  const queryClient = useQueryClient();
  const topicsLimit30 = queryClient.getQueryData(['search/topics', { query }]);
  const { data: topicsLimit3 = [] } = useQuery(
    ['search/topics', { query, limit: 3 }],
    { staleTime: Infinity, enabled: !topicsLimit30 }
  );

  const topics = (topicsLimit30 ?? topicsLimit3).slice(0, 3);

  if (!topics.length) {
    return null;
  }

  return (
    <section
      aria-labelledby="topics-search-results"
      css={css`
        padding: 20px;
        margin: 0px 40px;
        border-bottom: 1px solid rgb(233, 233, 233);
      `}
    >
      <h2
        id="topics-search-results"
        css={css`
          color: rgba(0, 0, 0, 0.75);
          margin: 0 0 4px;
          font-size: 14px;
        `}
      >
        話題
      </h2>

      <ul
        css={css`
          display: flex;
          flex-direction: column;
        `}
      >
        {topics.map((topic) => (
          <TopicItem key={topic.id} topic={topic} />
        ))}
      </ul>

      <Link
        href={{
          pathname: '/search/topics',
          query: { query },
        }}
      >
        <a>查看更多話題</a>
      </Link>
    </section>
  );
}
function SearchPage() {
  const router = useRouter();
  const isModalOpen = !!router.query.postID;
  const modalParentLocation = useModalParentLocation(isModalOpen);
  const { query } = modalParentLocation.query;

  return (
    <>
      <Head title={`「${query}」的搜尋結果`} />

      <ForumsSection query={query} />

      <SearchPostsList thirdSlot={<TopicsSection query={query} />} />
    </>
  );
}

SearchPage.prefetchQueries = async function prefetchQueries(
  queryClient,
  context
) {
  const { query } = context.router.query;

  await Promise.all([
    Layout.prefetchQueries(queryClient, context),
    SearchPostsList.prefetchQueries(queryClient, context),
    queryClient.prefetchQuery(['search/forums', { query, limit: 4 }]),
  ]);
};

export default withLayout((children) => (props) => (
  <Layout {...props}>
    <Search>{children}</Search>
  </Layout>
))(SearchPage);
