import querystring from 'querystring';
import { filterQuery } from '../utils/filter-query';

export const HOST = 'https://www.dcard.tw';
const API_ENDPOINT = 'https://www.dcard.tw/service/api/v2';

export async function api(path, { query, headers } = {}) {
  let isAbsoluteURL = false;
  try {
    new URL(path);
    isAbsoluteURL = true;
  } catch (err) {}

  const endpoint = isAbsoluteURL ? path : `${API_ENDPOINT}/${path}`;
  const filteredQuery = query ? filterQuery(query) : {};

  const url = `${encodeURI(endpoint)}${
    Object.keys(filteredQuery).length > 0
      ? `?${querystring.stringify(filteredQuery)}`
      : ''
  }`;

  try {
    const res = await fetch(url, { headers });
    const data = await res.json();

    if (data.error) {
      throw data;
    }

    return data;
  } catch (err) {
    console.error(err);
  }
}
