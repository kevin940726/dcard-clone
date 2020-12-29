import { api, HOST } from './api';

export const getForums = async ({ nsfw = true } = {}) => {
  const forums = await api('forums', { query: { nsfw } });

  const map = {};

  for (const forum of forums) {
    map[forum.id] = forum;
  }

  return map;
};

export async function getPopularForums({ pageKey, limit } = {}) {
  if (!pageKey) {
    const { head } = await api('popularForums/GetHead', {
      query: { listKey: 'popularForums' },
    });
    pageKey = head;
  }

  const result = await api('popularForums/GetPage', { query: { pageKey } });

  if (limit) {
    return result.items.slice(0, limit);
  }

  return result;
}

export const getSelectedForums = ({
  country = 'TW',
  sensitiveSelection = true,
} = {}) =>
  api(`selections/forums/${country}`, {
    query: { sensitiveSelection },
  });

export const getCategorization = ({ country = 'TW', nsfw = true } = {}) =>
  api('categorization/countries', {
    query: { country, nsfw },
  });

export const getCategory = (categoryID, { nsfw = true } = {}) =>
  api(`categorization/categories/${categoryID}`, {
    query: { nsfw },
  });

export const getBulletin = (forumID) =>
  api(`${HOST}/service/moderator/api/forum/${forumID}/bulletin`);
