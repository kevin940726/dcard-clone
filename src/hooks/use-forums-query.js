import { useMemo } from 'react';
import { useQueryClient, useQuery } from 'react-query';

const QUERY_KEY = '@server:forums';

export function setDehydratedForums(queryClient, dehydratedForums) {
  queryClient.setQueryData(QUERY_KEY, (forumsData = {}) => ({
    ...forumsData,
    ...dehydratedForums,
  }));
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

export function useForumByAlias(alias) {
  const { data: forums } = useForumsQuery();

  return useMemo(
    () =>
      forums && Object.values(forums).find((forum) => forum.alias === alias),
    [forums, alias]
  );
}

export function useForumByID(id) {
  const { data: forums } = useForumsQuery();

  return useMemo(() => forums?.[id], [forums, id]);
}
