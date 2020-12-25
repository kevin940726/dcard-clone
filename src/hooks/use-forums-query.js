import { useQueryClient, useQuery } from 'react-query';

const QUERY_KEY = '@server:forums';

export function setDehydratedForums(queryClient, dehydratedForums) {
  queryClient.setQueryData(QUERY_KEY, (forumsData = {}) => ({
    ...forumsData,
    ...dehydratedForums,
  }));
}

export default function useForumsQuery() {
  const queryClient = useQueryClient();

  const dehydratedForums = queryClient.getQueryData('@server:forums');

  const forumsQuery = useQuery('forums', {
    staleTime: Infinity,
    placeholderData: dehydratedForums,
  });

  return forumsQuery;
}
