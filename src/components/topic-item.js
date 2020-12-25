import { css } from 'styled-components';
import Link from 'next/link';

export default function TopicItem({ topic }) {
  if (!topic) {
    return null;
  }

  return (
    <Link href={`/topics/${topic.name}`} passHref>
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
          <svg
            viewBox="0 0 24 24"
            focusable="false"
            width="14"
            height="14"
            role="img"
            aria-hidden="true"
            style={{ fill: 'rgb(225, 225, 225)' }}
          >
            <path d="M20.5 14h-3.8l.7-4h3.1a1.5 1.5 0 100-3h-2.6l.6-3.2a1.5 1.5 0 00-3-.6L15 7h-5l.6-3.2a1.5 1.5 0 00-3-.6L7 7H3.5a1.5 1.5 0 100 3h2.8l-.7 4H3.5a1.5 1.5 0 000 3h1.6l-.6 3.2A1.5 1.5 0 005.7 22a1.5 1.5 0 00.3 0 1.5 1.5 0 001.5-1.2L8 17h5l-.6 3.2a1.5 1.5 0 001.2 1.8 1.5 1.5 0 00.3 0 1.5 1.5 0 001.5-1.2L16 17h4.4a1.5 1.5 0 000-3zM8.7 14l.7-4h5l-.8 4z"></path>
          </svg>
        </span>

        <div
          css={css`
            display: flex;
            flex-direction: column;
          `}
        >
          <span
            id={`${topic.id}_title`}
            css={css`
              color: rgba(0, 0, 0, 0.95);
              font-size: 14px;
              margin: 0;
              font-weight: bold;
            `}
          >
            {topic.name}
          </span>

          <span
            id={`${topic.id}_description`}
            css={css`
              color: rgba(0, 0, 0, 0.35);
              margin-top: 4px;
              font-size: 12px;
            `}
          >
            {topic.postCount} 篇文章
            <span aria-hidden="true">・</span>
            {topic.subscriptionCount} 人追蹤
          </span>
        </div>
      </a>
    </Link>
  );
}
