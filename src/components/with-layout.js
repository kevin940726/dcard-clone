export default function withLayout(getLayout) {
  return (Page) => {
    const Component = (props) => <Page {...props} />;

    Component.getLayout = getLayout;
    Component.getInitialProps = Page.getInitialProps;
    Component.prefetchQueries = Page.prefetchQueries;

    Component.displayName = `withLayout(${Page.displayName || Page.name})`;

    return Component;
  };
}
