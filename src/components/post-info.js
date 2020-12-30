import Link from 'next/link';
import { css } from 'styled-components';
import Image from 'next/image';
import { useQuery } from 'react-query';
import ForumPostsFrequency from './forum-posts-frequency';
import UserInfo from './user-info';
import { useForumByAlias } from '../hooks/use-forums-query';

export default function PostInfo({ forumAlias, persona, ...props }) {
  const { data: personaInfo } = useQuery(`personas/${persona}`, {
    staleTime: Infinity,
    enabled: !!persona,
  });
  const forum = useForumByAlias(forumAlias);

  if (!forum) {
    return null;
  }

  const forumInfo = (
    <Link href={`/f/${forumAlias}`} passHref>
      <a
        css={css`
          display: inline-flex;
          align-items: center;
          padding: 16px 0;
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

  const userInfo = personaInfo && (
    <UserInfo
      gender={personaInfo.gender}
      withNickname
      school={personaInfo.nickname}
      department={personaInfo.uid}
      postAvatar={personaInfo.postAvatar}
      css={css`
        width: 100%;
        padding: 16px 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      `}
    >
      {personaInfo.postCount} 篇文章
      <span aria-hidden>・</span>
      {personaInfo.subscriptionCount} 位粉絲
    </UserInfo>
  );

  return (
    <>
      {userInfo}
      {forumInfo}
    </>
  );
}
