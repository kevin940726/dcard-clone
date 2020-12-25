import { useRouter } from 'next/router';
import Head from '../../components/head';
import SearchPersonasList from '../../components/search-personas-list';
import withLayout from '../../components/with-layout';
import Layout from '../../components/layout';
import Search from '../../components/search';

function SearchPersonasPage() {
  const router = useRouter();
  const { query } = router.query;

  return (
    <>
      <Head title={`「${query}」的卡稱搜尋結果`} />

      <SearchPersonasList />
    </>
  );
}

SearchPersonasPage.prefetchQueries = async function prefetchQueries(
  queryClient,
  context
) {
  await Promise.all([
    Layout.prefetchQueries(queryClient, context),
    SearchPersonasList.prefetchQueries(queryClient, context),
  ]);
};

export default withLayout((children) => (props) => (
  <Layout {...props}>
    <Search>{children}</Search>
  </Layout>
))(SearchPersonasPage);
