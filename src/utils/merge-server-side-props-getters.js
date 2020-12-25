export default function mergeServerSidePropsGetters(...serverSidePropsGetters) {
  return async function getServerSideProps(context) {
    const results = await Promise.all(
      serverSidePropsGetters.map((serverSidePropsGetter) =>
        serverSidePropsGetter(context)
      )
    );

    if (results.some((result) => result.notFound)) {
      return {
        notFound: true,
      };
    }

    const props = {};

    results.forEach((result) => {
      Object.assign(props, result.props);
    });

    return {
      props,
    };
  };
}
