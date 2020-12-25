import { css } from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import ForumPostsFrequency from './forum-posts-frequency';

export default function ForumCard({ forum }) {
  if (!forum) {
    return null;
  }

  return (
    <Link href={`/f/${forum.alias}`} passHref>
      <a
        css={css`
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          width: 146px;
          height: 110px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: rgba(0, 0, 0, 0.08) 0px 3px 12px;
          text-align: center;
        `}
      >
        <div>
          <Image
            src={forum.heroImage?.url ?? '/forum-hero-placeholder.svg'}
            alt=""
            width={146}
            height={48.66}
          />
        </div>
        <span
          css={css`
            display: inline-flex;
            border-radius: 50%;
            overflow: hidden;
            border: 2px solid white;
            margin-top: -30.66px;
            z-index: 1;
          `}
        >
          <Image
            src={forum.logo?.url ?? 'forum-logo-placeholder.svg'}
            alt=""
            width={40}
            height={40}
          />
        </span>
        <h3
          css={css`
            font-size: 14px;
            color: rgb(0, 0, 0);
            margin: 4px 0 0;
            width: 126px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          `}
        >
          {forum.name}
        </h3>
        <span
          css={css`
            font-size: 12px;
            color: rgba(0, 0, 0, 0.35);
            margin-top: 4px;
            padding: 0px 6px;
            width: 126px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          `}
        >
          <ForumPostsFrequency forum={forum} />
        </span>
      </a>
    </Link>
  );
}
