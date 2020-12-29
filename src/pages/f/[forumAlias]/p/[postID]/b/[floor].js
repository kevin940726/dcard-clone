import { css } from 'styled-components';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import Head from '../../../../../../components/head';
import Floor from '../../../../../../components/floor';
import Layout from '../../../../../../components/layout';
import Forum from '../../../../../../components/forum';
import withLayout from '../../../../../../components/with-layout';
import PostPreview from '../../../../../../components/post-preview';

function PostFloorPage() {
  const router = useRouter();
  const { forumAlias, postID, floor } = router.query;

  const { data: post } = useQuery(`posts/${postID}`);

  return (
    <div
      css={css`
        padding: 32px 60px;
      `}
    >
      {post && <Head title={`${post.title} - B${floor} 回應`} />}

      <Floor>
        <div
          css={css`
            margin-top: 20px;
            padding: 10px 0px;
            border-top: 1px solid rgb(233, 233, 233);
            border-bottom: 1px solid rgb(233, 233, 233);
          `}
        >
          <p
            css={css`
              font-size: 16px;
              line-height: 30px;
              color: rgba(0, 0, 0, 0.35);
              margin: 0 0 3px;
            `}
          >
            此回應位於文章 B{floor}
          </p>
          <PostPreview
            forumAlias={forumAlias}
            postID={postID}
            css={css`
              margin: 4px 0;
            `}
          />
        </div>
      </Floor>
    </div>
  );
}

PostFloorPage.prefetchQueries = async function prefetchQueries(
  queryClient,
  context
) {
  const { postID } = context.router.query;

  await Promise.all([
    Layout.prefetchQueries(queryClient, context),
    queryClient.prefetchQuery(`posts/${postID}`),
    Floor.prefetchQueries(queryClient, context),
  ]);
};

export default withLayout((children) => (props) => (
  <Layout aside={<Forum.Aside {...props} />} {...props}>
    {children}
  </Layout>
))(PostFloorPage);
