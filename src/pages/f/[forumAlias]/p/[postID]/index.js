import { useRouter } from 'next/router';
import Post from '../../../../../components/post';
import Layout from '../../../../../components/layout';
import withLayout from '../../../../../components/with-layout';

function PostPage() {
  const router = useRouter();
  const { postID } = router.query;

  return <Post postID={postID} />;
}

PostPage.prefetchQueries = async function prefetchQueries(
  queryClient,
  context
) {
  await Promise.all([
    Layout.prefetchQueries(queryClient, context),
    queryClient.fetchQuery(`posts/${context.router.query.postID}`),
    Post.prefetchQueries(queryClient, context),
  ]);
};

export default withLayout((children) => (props) => (
  <Layout {...props}>{children}</Layout>
))(PostPage);
