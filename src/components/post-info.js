import Link from 'next/link';
import { css } from 'styled-components';
import Image from 'next/image';
import { useQuery } from 'react-query';
import ForumPostsFrequency from './forum-posts-frequency';

export default function PostInfo({ forumAlias, ...props }) {
  const { data: forums } = useQuery('forums', { staleTime: Infinity });
  const forum = forums?.[forumAlias];

  if (!forum) {
    return null;
  }

  return (
    <Link href={`/f/${forumAlias}`} passHref>
      <a
        css={css`
          display: inline-flex;
          align-items: center;
        `}
        {...props}
      >
        <span
          css={css`
            display: inline-flex;
            margin-right: 8px;
          `}
        >
          <Image
            src={forum.logo?.url ?? '/forum-logo-placeholder.svg'}
            alt={`${forum.name} logo`}
            width={32}
            height={32}
            css={css`
              border-radius: 50%;
            `}
          />
        </span>

        <span
          css={css`
            display: inline-flex;
            flex-direction: column;
          `}
        >
          <span
            css={css`
              display: flex;
              align-items: center;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              color: rgba(0, 0, 0);
              font-weight: 500;
              font-size: 14px;
              line-height: 20px;
              margin-right: 2px;
            `}
          >
            {forum.name}
          </span>

          <span
            css={css`
              color: rgba(0, 0, 0, 0.5);
              font-weight: 500;
              font-size: 12px;
              line-height: 17px;
              margin-top: -1px;
            `}
          >
            <ForumPostsFrequency forum={forum} />
          </span>
        </span>
      </a>
    </Link>
  );
}
