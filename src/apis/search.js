import { api } from './api';

export const getSearchPosts = (
  query,
  { limit = 30, highlight = true, offset, field, sort, since, forum } = {}
) => {
  if (since) {
    const now = new Date();
    const elapsed = now.setDate(now.getDate() - 1);
    since = Math.floor(elapsed / 1000);
  }

  return api('search/posts', {
    query: { query, limit, highlight, offset, field, sort, since, forum },
    headers: {
      // Required for images to show up?
      'request-through-cf': true,
    },
  });
};

export const getSearchForums = (query, { limit = 30, offset } = {}) =>
  api('search/forums', {
    query: { query, limit, offset },
    headers: {
      // Required for images to show up?
      'request-through-cf': true,
    },
  });

export const getSearchTopics = (query, { limit = 30, offset } = {}) =>
  api('search/topics', {
    query: { query, limit, offset },
    headers: {
      // Required for images to show up?
      'request-through-cf': true,
    },
  });

export const getSearchPersonas = (query, { limit = 30, offset } = {}) =>
  api('search/personas', {
    query: { query, limit, offset },
    headers: {
      // Required for images to show up?
      'request-through-cf': true,
    },
  });
