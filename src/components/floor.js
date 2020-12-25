import { useMemo } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import Comment from './comment';

function Floor({ children }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { postID, floor } = router.query;

  const initialData = useMemo(() => {
    const popularComments =
      queryClient.getQueryData(
        [`posts/${postID}/comments`, { popular: true }],
        { exact: true }
      ) ?? [];
    const allComments =
      queryClient.getQueryData(`posts/${postID}/comments`, {
        exact: true,
      }) ?? [];
    return popularComments
      .concat(...(allComments?.pages ?? []))
      .find((comment) => comment.floor === parseInt(floor, 10));
  }, [queryClient, postID, floor]);

  const { data: comment } = useQuery([`posts/${postID}/comment`, { floor }], {
    initialData,
    staleTime: Infinity,
  });

  if (!comment) {
    return null;
  }

  return (
    <Comment id={comment.id} {...comment}>
      {children}
    </Comment>
  );
}

Floor.prefetchQueries = async function prefetchQueries(queryClient, context) {
  const { postID, floor } = context.router.query;

  await queryClient.prefetchQuery([`posts/${postID}/comment`, { floor }]);
};

export default Floor;
