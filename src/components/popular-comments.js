import { css } from 'styled-components';
import { useQuery } from 'react-query';
import Comment from './comment';

export default function PopularComments({ postID, Wrapper }) {
  const { data: popularComments, isFetching } = useQuery(
    [`posts/${postID}/comments`, { popular: true }],
    {
      staleTime: 30 * 60 * 1000, // 30 mins
    }
  );

  if (!popularComments || !popularComments.length) {
    // TODO: skeleton?
    return null;
  }

  return (
    <Wrapper>
      <div role="feed" aria-busy={isFetching}>
        {popularComments.map((comment, index) => (
          <article
            key={comment.id}
            tabIndex="0"
            aria-posinset={index + 1}
            aria-setsize={popularComments.length}
            aria-labelledby={`${comment.id}_title`}
            aria-describedby={`${comment.id}_header ${comment.id}_content`}
            css={css`
              &:focus:not(:focus-visible) {
                outline: none;
              }
            `}
          >
            <Comment {...comment} />
          </article>
        ))}
      </div>
    </Wrapper>
  );
}
