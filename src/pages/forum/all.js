import Head from '../../components/head';
import withLayout from '../../components/with-layout';
import Layout from '../../components/layout';
import ForumCategory from '../../components/forum-category';

function AllForumPage() {
  return (
    <>
      <Head title="看板分類" />

      <ForumCategory />
    </>
  );
}

AllForumPage.prefetchQueries = async function prefetchQueries(
  queryClient,
  context
) {
  await Promise.all([
    Layout.prefetchQueries(queryClient, context),
    ForumCategory.prefetchQueries(queryClient, context),
  ]);
};

export default withLayout((children) => (props) => (
  <Layout {...props}>{children}</Layout>
))(AllForumPage);
