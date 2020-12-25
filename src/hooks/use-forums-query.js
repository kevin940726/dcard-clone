import { useMemo } from 'react';
import { useQueryClient, useQuery } from 'react-query';

const QUERY_KEY = '@server:forums';

export function setDehydratedForums(queryClient, dehydratedForums) {
  queryClient.setQueryData(QUERY_KEY, (forumsData = {}) => ({
    ...forumsData,
    ...dehydratedForums,
  }));
}

export function mapForumsById(forums) {
  const map = {};
  for (const forum of Object.values(forums)) {
    map[forum.id] = forum;
  }
  return map;
}

export function useForumsQuery() {
  const queryClient = useQueryClient();

  const dehydratedForums = queryClient.getQueryData('@server:forums');

  const forumsQuery = useQuery('forums', {
    staleTime: Infinity,
    placeholderData: dehydratedForums,
  });

  return forumsQuery;
}

export function useForumsByIDQuery() {
  const { data: forums, ...rest } = useForumsQuery();

  const forumsByID = useMemo(() => forums && mapForumsById(forums), [forums]);

  return { data: forumsByID, ...rest };
}

export function useForumByAlias(alias) {
  const { data: forums } = useForumsQuery();

  return forums?.[alias];
}

export function useForumByID(id) {
  const { data: forumsByID } = useForumsByIDQuery();

  return forumsByID?.[id];
}

export async function fetchForumByAlias(queryClient, alias) {
  const forums = await queryClient.fetchQuery('forums');

  const forum = forums[alias];

  if (!forum) {
    throw { statusCode: 404 };
  }

  setDehydratedForums(queryClient, {
    [alias]: forum,
  });

  return forum;
}

export async function fetchForumByID(queryClient, id) {
  const forums = await queryClient.fetchQuery('forums');
  const forumsByID = mapForumsById(forums);

  const forum = forumsByID[id];

  if (!forum) {
    throw { statusCode: 404 };
  }

  setDehydratedForums(queryClient, {
    [forum.alias]: forum,
  });

  return forum;
}
