import { filterQuery } from './filter-query';

function getAbsoluteURL(req, localhost) {
  let protocol = 'https:';
  let host = req
    ? req.headers['x-forwarded-host'] ?? req.headers['host']
    : window.location.host;
  if (host.indexOf('localhost') > -1) {
    if (localhost) {
      host = localhost;
    }
    protocol = 'http:';
  }
  return protocol + '//' + host;
}

export default async function queryFn(context) {
  const [key, queries] = context.queryKey;
  const nextQuery = context.pageParam ?? {};

  const params = {
    ...queries,
    ...nextQuery,
  };

  const search = params
    ? '?' + new URLSearchParams(filterQuery(params)).toString()
    : '';
  const host = getAbsoluteURL(context.req, 'localhost:3000');

  const url = `${host}/api/${key}${search}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.error) {
    throw data;
  }

  return data;
}
