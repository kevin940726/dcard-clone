import { api } from './api';

export const getTopicInfo = (topic) => api(`tagging/topics/${topic}/stat`);

export const getTopicPosts = (
  topic,
  { limit = 30, sort = 'like', offset } = {}
) =>
  api('search/posts', {
    query: { limit, query: topic, field: 'topics', sort, offset },
    headers: {
      // Required for images to show up?
      'request-through-cf': true,
    },
  });
