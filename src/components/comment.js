import { memo } from 'react';
import { css } from 'styled-components';
import UserInfo from './user-info';
import ReadableDateTime from './readable-date-time';
import LikeIcon from './like-icon';
import PostContent from './post-content';

function Comment({
  id: commentID,
  gender,
  withNickname,
  school,
  department,
  postAvatar,
  floor,
  createdAt,
  mediaMeta,
  content,
  likeCount,
  hidden,
  hiddenByAuthor,
  children,
  ...props
}) {
  return (
    <div
      css={css`
        padding: 16px 0;
        color: rgba(0, 0, 0, 0.85);
        font-size: 18px;
        border-bottom: 1px solid rgb(233, 233, 233);

        &:last-child {
          border: none;
        }
      `}
      {...props}
    >
      <header
        id={`${commentID}_header`}
        css={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
        `}
      >
        <UserInfo
          gender={gender}
          withNickname={withNickname}
          school={school}
          department={department}
          postAvatar={postAvatar}
          hidden={hidden || hiddenByAuthor}
        >
          <span>
            {!hidden && (
              <>
                B{floor}
                <span aria-hidden="true">・</span>
              </>
            )}
            <ReadableDateTime dateTime={createdAt} />
          </span>
        </UserInfo>

        {!hidden && (
          <button
            css={css`
              display: inline-flex;
              align-items: center;
              color: rgba(0, 0, 0, 0.5);
              cursor: pointer;
              font-size: 14px;
              line-height: 20px;

              svg {
                fill: rgba(0, 0, 0, 0.3);
                transition: fill 0.15s cubic-bezier(0.4, 0, 0.2, 1) 0s;
              }

              &:hover {
                svg {
                  fill: rgb(234, 92, 92);
                }
              }
            `}
          >
            <span
              css={css`
                display: inline-flex;
                margin-right: 8px;
              `}
            >
              <LikeIcon width={24} height={24} />
            </span>
            {likeCount}
          </button>
        )}
      </header>

      {children}

      <PostContent
        id={`${commentID}_content`}
        mediaMeta={mediaMeta}
        css={css`
          padding: 20px 0 0;
        `}
      >
        {hidden
          ? '已經刪除的內容就像 Dcard 一樣，錯過是無法再相見的！'
          : content}
      </PostContent>
    </div>
  );
}

export default memo(Comment);
