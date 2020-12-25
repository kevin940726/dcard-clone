import Head from '../../components/head';
import withLayout from '../../components/with-layout';
import Layout from '../../components/layout';
import PopularForums from '../../components/popular-forums';

function PopularForumsPage() {
  return (
    <>
      <Head title="即時熱門看板" />

      <PopularForums />
    </>
  );
}

PopularForumsPage.prefetchQueries = async function prefetchQueries(
  queryClient,
  context
) {
  await Promise.all([
    Layout.prefetchQueries(queryClient, context),
    PopularForums.prefetchQueries(queryClient, context),
  ]);
};

export default withLayout((children) => (props) => (
  <Layout {...props}>{children}</Layout>
))(PopularForumsPage);
