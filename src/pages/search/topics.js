import { useRouter } from 'next/router';
import Head from '../../components/head';
import SearchTopicsList from '../../components/search-topics-list';
import withLayout from '../../components/with-layout';
import Layout from '../../components/layout';
import Search from '../../components/search';

function SearchTopicsPage() {
  const router = useRouter();
  const { query } = router.query;

  return (
    <>
      <Head title={`「${query}」的話題搜尋結果`} />

      <SearchTopicsList />
    </>
  );
}

SearchTopicsPage.prefetchQueries = async function prefetchQueries(
  queryClient,
  context
) {
  await Promise.all([
    Layout.prefetchQueries(queryClient, context),
    SearchTopicsList.prefetchQueries(queryClient, context),
  ]);
};

export default withLayout((children) => (props) => (
  <Layout {...props}>
    <Search>{children}</Search>
  </Layout>
))(SearchTopicsPage);
