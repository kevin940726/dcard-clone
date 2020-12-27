import { css } from 'styled-components';
import { useQuery } from 'react-query';
import { Dialog } from './route-dialog';
import Reaction from './reaction';
import CloseIcon from './close-icon';

export default function ReactionsModal({ reactions, ...dialog }) {
  const { data: reactionsData } = useQuery('posts/reactions');

  return (
    <Dialog
      dialog={dialog}
      visible={dialog.visible}
      hide={dialog.hide}
      aria-labelledby="post-reactions-title"
      backdropStyle={css`
        opacity: 0;
        transition: opacity 0.15s ease;

        &[data-enter] {
          opacity: 1;
        }
      `}
      css={css`
        background: #fff;
        border-radius: 12px;
        box-shadow: rgba(0, 0, 0, 0.05) 0px 4px 4px 0px,
          rgba(0, 0, 0, 0.15) 0px 0px 4px 0px;
        padding: 24px;
        min-width: 350px;
        max-width: 100%;
      `}
    >
      <header
        css={css`
          position: relative;
          margin-bottom: 14px;
        `}
      >
        <h1
          id="post-reactions-title"
          css={css`
            color: #000;
            font-size: 24px;
            line-height: 33px;
            font-weight: normal;
            text-align: center;
            margin: 0;
          `}
        >
          這篇文章獲得的心情
        </h1>

        <button
          css={css`
            cursor: pointer;
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
          `}
          onClick={dialog.hide}
        >
          <CloseIcon
            width={24}
            height={24}
            css={css`
              fill: #000;
            `}
          />
        </button>
      </header>

      <ul
        css={css`
          display: flex;
          align-items: flex-start;
          flex-wrap: wrap;
          list-style: none;
          font-size: 16px;
          padding: 0 20px;
          width: 323.84px;
        `}
      >
        {reactions.map((reaction) => (
          <li
            key={reaction.id}
            css={css`
              margin-bottom: 26px;
              display: inline-flex;
              align-items: center;
              width: 128.92px;
              color: rgba(0, 0, 0, 0.35);

              &:nth-child(2n + 1) {
                margin-right: 26px;
              }

              &:nth-last-child(1),
              &:nth-last-child(2) {
                margin-bottom: 0;
              }
            `}
          >
            <span
              css={css`
                display: inline-flex;
                margin-right: 10px;
              `}
            >
              <Reaction id={reaction.id} width={30} height={30} />
            </span>
            <span
              css={css`
                margin-right: 12px;
                color: rgba(0, 0, 0, 0.6);
              `}
            >
              {reactionsData?.find((item) => item.id === reaction.id)?.name}
            </span>
            {reaction.count}
          </li>
        ))}
      </ul>
    </Dialog>
  );
}
