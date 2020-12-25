import { css } from 'styled-components';
import Link from 'next/link';
import Avatar from './avatar';

export default function PersonaItem({ persona }) {
  if (!persona) {
    return null;
  }

  return (
    <Link href={`/@${persona.uid}`} passHref>
      <a
        css={css`
          display: flex;
          align-items: center;
          color: #000;
          height: 56px;
        `}
      >
        <span
          css={css`
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            margin-right: 10px;
            overflow: hidden;
            width: 32px;
            height: 32px;
            background-color: rgb(166, 166, 166);
          `}
        >
          <Avatar
            gender={persona.gender}
            nickname={persona.uid}
            postAvatar={persona.postAvatar}
            size={32}
          />
        </span>

        <div
          css={css`
            display: flex;
            flex-direction: column;
          `}
        >
          <span
            id={`${persona.uid}_title`}
            css={css`
              color: rgba(0, 0, 0, 0.95);
              font-size: 14px;
              margin: 0;
              font-weight: bold;
            `}
          >
            {persona.nickname}
          </span>

          <span
            id={`${persona.uid}_description`}
            css={css`
              color: rgba(0, 0, 0, 0.35);
              margin-top: 4px;
              font-size: 12px;
            `}
          >
            @{persona.uid}
            <span aria-hidden="true">・</span>
            {persona.postCount} 篇文章
          </span>
        </div>
      </a>
    </Link>
  );
}
