import { css } from 'styled-components';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useQuery } from 'react-query';
import Head from '../../components/head';
import TopicPostsList from '../../components/topic-posts-list';
import withLayout from '../../components/with-layout';
import Layout from '../../components/layout';
import TabList from '../../components/tab-list';
import useModalParentLocation from '../../hooks/use-modal-parent-location';

function TopicInfo() {
  const router = useRouter();
  const modalParentLocation = useModalParentLocation(!!router.query.postID);
  const { topic, latest } = modalParentLocation.query;

  const { data: topicInfo } = useQuery(['topics', { topic }], {
    staleTime: Infinity,
  });

  return (
    <header
      css={css`
        position: sticky;
        top: 48px;
        padding: 20px 60px 0;
        z-index: 10;
        border-bottom: 1px solid rgba(0, 0, 0, 0.15);
        background: #fff;
        margin-top: 24px;
      `}
    >
      <Head title={topic} />

      <h1
        css={css`
          font-weight: 500;
          font-size: 24px;
          line-height: 33px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          color: #000;
          margin: 0 0 8px;
        `}
      >
        {topic}
      </h1>
      <h2
        css={css`
          font-weight: 400;
          font-size: 16px;
          line-height: 22px;
          color: rgba(0, 0, 0, 0.75);
          margin: 0;
        `}
      >
        {topicInfo && (
          <>
            {topicInfo.postCount} 篇文章
            <span
              aria-hidden="true"
              css={css`
                margin: 0 0.5em;
              `}
            >
              ‧
            </span>
            {topicInfo.subscriptionCount} 人追蹤
          </>
        )}
      </h2>
      <TabList>
        <Link href={`/topics/${topic}`} passHref>
          <TabList.Tab isActive={!latest}>熱門文章</TabList.Tab>
        </Link>
        <Link
          href={{
            pathname: `/topics/${topic}`,
            query: { latest: true },
          }}
          passHref
        >
          <TabList.Tab isActive={!!latest}>最新文章</TabList.Tab>
        </Link>
      </TabList>
    </header>
  );
}

function TopicPostsPage() {
  return (
    <>
      <TopicInfo />

      <TopicPostsList />
    </>
  );
}

TopicPostsPage.prefetchQueries = async function prefetchQueries(
  queryClient,
  context
) {
  const { topic } = context.router.query;

  await Promise.all([
    Layout.prefetchQueries(queryClient, context),
    queryClient.prefetchQuery(['topics', { topic }]),
    TopicPostsList.prefetchQueries(queryClient, context),
  ]);
};

export default withLayout((children) => (props) => (
  <Layout {...props}>{children}</Layout>
))(TopicPostsPage);
