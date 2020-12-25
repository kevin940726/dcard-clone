import PostsList from '../../../components/posts-list';
import Layout from '../../../components/layout';
import Forum from '../../../components/forum';
import withLayout from '../../../components/with-layout';

function ForumPage() {
  return <PostsList />;
}

ForumPage.prefetchQueries = async function prefetchQueries(
  queryClient,
  context
) {
  await Promise.all([
    Layout.prefetchQueries(queryClient, context),
    Forum.prefetchQueries(queryClient, context),
    PostsList.prefetchQueries(queryClient, context),
  ]);
};

export default withLayout((children) => (props) => (
  <Layout aside={<Forum.Aside {...props} />} {...props}>
    <Forum {...props}>{children}</Forum>
  </Layout>
))(ForumPage);
