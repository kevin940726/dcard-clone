import Layout from '../../../components/layout';
import Forum from '../../../components/forum';
import Rule from '../../../components/rule';
import withLayout from '../../../components/with-layout';
function ForumRulePage() {
  return <Rule />;
}

ForumRulePage.prefetchQueries = async function prefetchQueries(
  queryClient,
  context
) {
  await Promise.all([
    Layout.prefetchQueries(queryClient, context),
    Forum.prefetchQueries(queryClient, context),
    Rule.prefetchQueries(queryClient, context),
  ]);
};

export default withLayout((children) => (props) => (
  <Layout aside={<Forum.Aside {...props} />} {...props}>
    <Forum {...props}>{children}</Forum>
  </Layout>
))(ForumRulePage);
