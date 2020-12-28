import { api, HOST } from './api';
import { filterQuery } from '../utils/filter-query';

export const getPosts = ({ popular = true, limit = 30, before } = {}) =>
  api('posts', { query: { popular, limit, before } });

export const getForumPosts = (
  forum,
  { popular = true, limit = 30, before } = {}
) =>
  api(`forums/${forum}/posts`, {
    query: { popular, limit, before },
  });

export const getPost = (postID) => api(`posts/${postID}`);

export const getInfinityIndex = ({ forum } = {}) =>
  api(`posts/infinityIndex`, {
    query: { forum },
  });

export const getInfinitePosts = async ({
  forum,
  popular = true,
  limit = 30,
  before,
}) => {
  const getPostsData = forum ? getForumPosts.bind(null, forum) : getPosts;

  let posts = await getPostsData({ popular, limit, before });

  if (!popular && !posts.length) {
    return {
      items: posts,
      nextQuery: null,
    };
  }

  let nextQuery = filterQuery({
    forum,
    popular,
    limit,
    before: posts[posts.length - 1]?.id,
  });

  if (posts.length < limit) {
    if (popular) {
      const { id: infinityIndex } = await getInfinityIndex({ forum });

      const latestPosts = await getPostsData({
        popular: false,
        limit: limit - posts.length,
        before: infinityIndex,
      });

      posts = posts.concat(latestPosts);

      if (posts.length < limit) {
        nextQuery = null;
      } else {
        nextQuery.popular = false;
        nextQuery.before = posts[posts.length - 1].id;
      }
    } else {
      nextQuery = null;
    }
  }

  return {
    items: posts,
    nextQuery,
  };
};

export const getComments = (postID, { popular, after, limit } = {}) =>
  api(`posts/${postID}/comments`, { query: { popular, after, limit } });

export const getComment = (postID, floor) =>
  api(`posts/${postID}/comments`, {
    query: { limit: 1, after: floor - 1 },
  }).then(([comment]) => comment);

export const getLinkAttachment = (url) =>
  api(`${HOST}/v2/linkAttachment`, {
    query: { url },
    headers: {
      'request-through-cf': true,
    },
  });

export const getDarsys = (postID) => api(`darsys/${postID}`);

export const getPostPreview = (postID) =>
  api('posts', { query: { id: postID } });

export const getReactions = () => api('reactions');
