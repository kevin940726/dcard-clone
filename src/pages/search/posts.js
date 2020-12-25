import { useRouter } from 'next/router';
import Head from '../../components/head';
import SearchPostsList from '../../components/search-posts-list';
import withLayout from '../../components/with-layout';
import Layout from '../../components/layout';
import Search from '../../components/search';
import SearchPostsFilter from '../../components/search-posts-filter';
import useModalParentLocation from '../../hooks/use-modal-parent-location';

function SearchPostsPage() {
  const router = useRouter();
  const modalParentLocation = useModalParentLocation(!!router.query.postID);
  const { query } = modalParentLocation.query;

  return (
    <>
      <Head title={`「${query}」的文章搜尋結果`} />

      <SearchPostsFilter />
      <SearchPostsList />
    </>
  );
}

SearchPostsPage.prefetchQueries = async function prefetchQueries(
  queryClient,
  context
) {
  await Promise.all([
    Layout.prefetchQueries(queryClient, context),
    SearchPostsList.prefetchQueries(queryClient, context),
  ]);
};

export default withLayout((children) => (props) => (
  <Layout {...props}>
    <Search>{children}</Search>
  </Layout>
))(SearchPostsPage);
