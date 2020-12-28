import { useMemo, forwardRef } from 'react';
import styled, { css } from 'styled-components';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import ReactionsList from './reactions-list';
import Avatar from './avatar';
import ZoomableImage from './zoomable-image';
import Highlight from './highlight';

const VideoPlayer = dynamic(() => import('./video-player'));
const LinkAttachment = dynamic(() => import('./link-attachment'));
const PostPreview = dynamic(() => import('./post-preview'));
const PostLabel = dynamic(() => import('./post-label'));

const formatter = new Intl.RelativeTimeFormat('zh-TW');

function ElapsedDateTime({ datetime }) {
  const date = useMemo(() => new Date(datetime), [datetime]);
  const elapsedTime = useMemo(() => {
    const elapsedMilliseconds = Date.now() - date.getTime();
    const elapsedMinutes = elapsedMilliseconds / 1000 / 60;

    if (elapsedMinutes < 1) {
      return '才剛發布';
    } else if (elapsedMinutes < 60) {
      return formatter.format(-Math.floor(elapsedMinutes), 'minute');
    } else if (elapsedMinutes < 24 * 60) {
      return formatter.format(-Math.floor(elapsedMinutes / 60), 'hour');
    } else if (elapsedMinutes < 7 * 24 * 60) {
      return formatter.format(-Math.floor(elapsedMinutes / 60 / 24), 'day');
    } else if (date.getFullYear() === new Date().getFullYear()) {
      return `${date.getMonth() + 1} 月 ${date.getDate()} 日`;
    } else {
      return `${date.getFullYear()} 年 ${
        date.getMonth() + 1
      } 月 ${date.getDate()} 日`;
    }
  }, [date]);

  return (
    <>
      <span aria-hidden="true">・</span>
      <time dateTime={date.toISOString()} title={date.toLocaleString()}>
        {elapsedTime}
      </time>
    </>
  );
}

const Description = styled.p.attrs((props) => ({
  id: `${props.postID}_description`,
}))`
  font-weight: 400;
  min-height: 20px;
  line-height: 20px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: rgba(0, 0, 0, 0.75);
  margin: 0;
`;

function PostItem(
  {
    id: postID,
    forumAlias,
    forumName,
    title,
    school,
    department,
    anonymousSchool,
    anonymousDepartment,
    gender,
    withNickname,
    excerpt,
    likeCount,
    commentCount,
    reactions,
    withImages,
    mediaMeta = [],
    media,
    shouldShowForumName,
    customStyle,
    pinned,
    createdAt,
    shouldShowDateTime,
    postAvatar,
    link,
    layout = 'classic',
    onClick,
    handleClick,
    href,
    highlight,
    replyId,
    replyTitle,
  },
  ref
) {
  const displaySchool = !anonymousSchool && school;
  const displayDepartment = !anonymousDepartment && department;
  const image =
    mediaMeta.find((meta) => meta.type.startsWith('image/')) ?? media[0];

  const LinkAgnostic = href ? 'a' : ({ children }) => children;

  let content;
  if (replyId) {
    content = (
      <Description
        postID={postID}
        as="blockquote"
        css={css`
          font-size: 14px;
          padding-left: 4px;
          border-left: 4px solid rgba(0, 0, 0, 0.15);
          color: rgba(0, 0, 0, 0.6);
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        `}
      >
        {replyTitle}
      </Description>
    );
  } else if (layout === 'image' && image) {
    content = (
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          margin-top: 8px;
          width: 100%;
          height: 0;
          position: relative;
          overflow: hidden;
        `}
        style={{
          paddingTop: `${Math.min(image.height / image.width, 1) * 100}%`,
        }}
      >
        <ZoomableImage
          src={image.url}
          alt=""
          layout="fill"
          objectFit="contain"
          css={css`
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            margin: auto;
            z-index: 6;
          `}
        />
      </div>
    );
  } else if (layout === 'link') {
    const contentDescription = (
      <Description
        postID={postID}
        css={css`
          margin: 0 0 12px;
        `}
      >
        {highlight ? <Highlight>{excerpt}</Highlight> : excerpt}
      </Description>
    );
    if (link.match(/youtu\.be\//) || link.match(/youtube\.com\/watch/)) {
      const video = mediaMeta.find((media) => media.url === link);
      content = (
        <div>
          {contentDescription}
          <VideoPlayer
            type="video/youtube"
            src={video?.normalizedUrl}
            thumbnail={video?.thumbnail}
            css={css`
              border-radius: 12px;
              overflow: hidden;
              z-index: 6;
            `}
          />
        </div>
      );
    } else if (link.match(/dcard\.tw\/f\/\w+\/p\/\d+/)) {
      const [, forumAlias, postID] = link.match(
        /dcard\.tw\/f\/(\w+)\/p\/(\d+)/
      );

      content = (
        <div>
          {contentDescription}
          <PostPreview
            forumAlias={forumAlias}
            postID={postID}
            css={css`
              position: relative;
              z-index: 6;
            `}
          />
        </div>
      );
    } else {
      content = (
        <div>
          {contentDescription}
          <LinkAttachment
            src={link}
            css={css`
              position: relative;
              z-index: 6;
            `}
          />
        </div>
      );
    }
  } else if (layout === 'video') {
    const video = mediaMeta.find((media) => media.type.startsWith('video/'));
    content = (
      <div
        css={css`
          border-radius: 12px;
          margin-top: 8px;
          overflow: hidden;
          width: 100%;
          height: 0;
          position: relative;
          background: #000;
        `}
        style={{
          paddingTop: `${Math.min(video.height / video.width, 1) * 100}%`,
        }}
      >
        <div
          css={css`
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          `}
        >
          <video
            src={video.url}
            playsInline
            // TODO: Lazy loading video
            autoPlay
            // TODO: I'm too lazy to implement yet another video player...
            controls
            muted
            css={css`
              position: relative;
              width: 100%;
              height: 100%;
              z-index: 6;
            `}
          />
        </div>
      </div>
    );
  } else {
    content = (
      <Description postID={postID}>
        {highlight ? <Highlight>{excerpt}</Highlight> : excerpt}
      </Description>
    );
  }

  return (
    <>
      <div
        css={css`
          min-width: 0;
          flex-grow: 1;
        `}
      >
        <div
          id={`${postID}_header`}
          css={css`
            display: flex;
            align-items: center;
          `}
        >
          <span
            css={css`
              display: inline-flex;
              margin-right: 8px;
            `}
          >
            <Avatar
              gender={gender}
              nickname={withNickname && displayDepartment}
              postAvatar={postAvatar}
              size={16}
            />
          </span>
          <span
            css={css`
              display: inline-flex;
              align-items: center;
              margin-right: 10px;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              color: rgba(0, 0, 0, 0.5);
            `}
          >
            {shouldShowForumName && (
              <span>
                {forumName}
                <span aria-hidden="true">・</span>
              </span>
            )}
            {!displaySchool && !displayDepartment && '匿名'}
            {displaySchool} {!withNickname && displayDepartment}
            {pinned && (
              <PostLabel
                css={css`
                  margin-left: 8px;
                `}
              >
                置頂
              </PostLabel>
            )}
            {customStyle?.label && (
              <PostLabel
                style={{ background: customStyle.label.bgColor }}
                css={css`
                  margin-left: 8px;
                `}
              >
                {customStyle.label.text}
              </PostLabel>
            )}
            {shouldShowDateTime && <ElapsedDateTime datetime={createdAt} />}
          </span>
        </div>
        <LinkAgnostic
          href={href}
          onClick={(event) => {
            handleClick?.(event);
            onClick?.(event);
          }}
          ref={ref}
        >
          <h2
            id={`${postID}_title`}
            css={css`
              margin: 12px 0 4px;
              color: #000;
              font-size: 18px;
              font-weight: 600;
              line-height: 25px;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;

              &:after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 100%;
                z-index: 5;
              }
            `}
          >
            {highlight ? <Highlight>{title}</Highlight> : title}
          </h2>
        </LinkAgnostic>
        {content}
        <footer
          id={`${postID}_footer`}
          css={css`
            display: flex;
            align-items: center;
            color: rgba(0, 0, 0, 0.35);
            margin-top: 16px;
          `}
        >
          <ReactionsList
            reactions={reactions.slice(0, 3)}
            size={16}
            css={css`
              margin-right: 6px;
            `}
          />
          <span
            css={css`
              margin-right: 16px;
            `}
          >
            {likeCount}
          </span>
          <span
            css={css`
              margin-right: 16px;
            `}
          >
            回應 {commentCount}
          </span>
        </footer>
      </div>
      {layout === 'classic' && withImages && image && (
        <div
          css={css`
            align-self: flex-end;
            height: 84px;
            width: 84px;
            flex-shrink: 0;
            margin-left: 20px;
            border-radius: 4px;
            border: 1px solid rgba(0, 0, 0, 0.1);
          `}
        >
          <Image
            src={image.url}
            alt=""
            height={84}
            width={84}
            objectFit="cover"
          />
        </div>
      )}
    </>
  );
}

export default forwardRef(PostItem);
