import PostsList from '../../components/posts-list';
import withLayout from '../../components/with-layout';
import Layout from '../../components/layout';
import Forum from '../../components/forum';

function IndexForumPage() {
  return <PostsList />;
}

IndexForumPage.prefetchQueries = async function prefetchQueries(
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
))(IndexForumPage);
