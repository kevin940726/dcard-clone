import { api } from './api';

export const getPersonaInfo = (persona) => api(`personas/${persona}`);

export const getPersonaPosts = (persona, { limit = 30, before } = {}) =>
  api(`personas/${persona}/posts`, {
    query: { limit, before },
  });
