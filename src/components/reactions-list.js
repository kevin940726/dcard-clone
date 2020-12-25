import { css } from 'styled-components';
import Reaction from './reaction';

function ReactionItem({ reactionID, size, ...props }) {
  return (
    <span
      css={css`
        display: inline-flex;
        border-radius: 50%;
        border: 2px solid rgb(255, 255, 255);
        margin-left: -4px;
        box-sizing: content-box;

        &:first-child {
          margin-left: 0;
        }
      `}
      {...props}
    >
      <Reaction id={reactionID} width={size} height={size} />
    </span>
  );
}

export default function ReactionsList({ reactions, size, ...props }) {
  return (
    <span
      css={css`
        display: inline-flex;
      `}
      {...props}
    >
      {reactions.map((reaction, index) => (
        <ReactionItem
          key={reaction.id}
          style={{
            zIndex: reactions.length - index,
          }}
          reactionID={reaction.id}
          size={size}
        />
      ))}

      {!reactions.length && <ReactionItem reactionID={null} size={size} />}
    </span>
  );
}
