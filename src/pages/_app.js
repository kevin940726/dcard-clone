import BaseApp from 'next/app';
import Error from 'next/error';
import { createGlobalStyle } from 'styled-components';
import { QueryClientProvider, QueryClient } from 'react-query';
import { Hydrate, dehydrate } from 'react-query/hydration';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Provider } from 'reakit';
import 'modern-normalize';
import queryFn from '../utils/query-fn';

const GlobalStyle = createGlobalStyle`
  html {
    line-height: 1.15;
    -webkit-text-size-adjust: 100%;
  }

  body {
    margin: 0;
    padding: 0;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: rgb(0, 50, 78);
  }

  body, button {
    font-family: Roboto,Helvetica Neue,Helvetica,Arial,PingFang TC,黑體-繁,Heiti TC,蘋果儷中黑,Apple LiGothic Medium,微軟正黑體,Microsoft JhengHei,sans-serif;
    text-rendering: optimizeLegibility;
  }

  button {
    background: transparent;
    border: none;
    font-size: 14px;
    padding: 0;

    :focus:not(:focus-visible) {
      outline: none;
    }
  }

  ul, ol {
    padding: 0;
    margin: 0;
  }

  a {
    text-decoration: none;
    color: #3397cf;
  }
`;

const getQueryClientConfig = (req) => ({
  defaultOptions: {
    queries: {
      queryFn: (context) => queryFn({ ...context, req }),
    },
  },
});

const queryClient = new QueryClient(getQueryClientConfig());

function App({ Component, pageProps, dehydratedState, ...rest }) {
  if (!dehydratedState) {
    return <Error statusCode={rest.statusCode ?? 404} />;
  }

  const children = <Component {...pageProps} />;
  const withLayout = Component.getLayout?.(children)?.(pageProps) ?? children;

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={dehydratedState}>
        <GlobalStyle />
        <Provider>{withLayout}</Provider>
        <ReactQueryDevtools position="bottom-right" />
      </Hydrate>
    </QueryClientProvider>
  );
}

App.getInitialProps = async function getInitialProps(context) {
  const queryClient = new QueryClient(getQueryClientConfig(context.ctx.req));

  // Skip prefetching on client-side
  if (typeof window === 'undefined') {
    try {
      await context.Component.prefetchQueries?.(queryClient, context);
    } catch (error) {
      if (error.statusCode) {
        return error;
      }
      return { statusCode: 404, error };
    }
  }

  // Don't send the whole forums data to client side on initial page load
  queryClient.removeQueries('forums', { exact: true });

  const appProps = await BaseApp.getInitialProps(context);

  return {
    ...appProps,
    dehydratedState: dehydrate(queryClient),
  };
};

export default App;
