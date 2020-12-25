import { useRouter } from 'next/router';
import Head from '../../components/head';
import SearchForumsList from '../../components/search-forums-list';
import withLayout from '../../components/with-layout';
import Layout from '../../components/layout';
import Search from '../../components/search';

function SearchForumsPage() {
  const router = useRouter();
  const { query } = router.query;

  return (
    <>
      <Head title={`「${query}」的看板搜尋結果`} />

      <SearchForumsList />
    </>
  );
}

SearchForumsPage.prefetchQueries = async function prefetchQueries(
  queryClient,
  context
) {
  await Promise.all([
    Layout.prefetchQueries(queryClient, context),
    SearchForumsList.prefetchQueries(queryClient, context),
  ]);
};

export default withLayout((children) => (props) => (
  <Layout {...props}>
    <Search>{children}</Search>
  </Layout>
))(SearchForumsPage);
