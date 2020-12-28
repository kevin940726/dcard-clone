import { memo } from 'react';
import Link from 'next/link';
import styled, { css } from 'styled-components';
import dynamic from 'next/dynamic';
import { useQuery } from 'react-query';
import { useDialogState, DialogDisclosure } from 'reakit';
import Head from './head';
import ReadableDateTime from './readable-date-time';
import UserInfo from './user-info';
import PostContent from './post-content';
import TopicTag from './topic-tag';
import ReactionsList from './reactions-list';
import PostInfo from './post-info';
import PopularComments from './popular-comments';
import dedupe from '../utils/dedupe';

const PostLabel = dynamic(() => import('./post-label'));
const AllComments = dynamic(() => import('./all-comments'));
const Darsys = dynamic(() => import('./darsys'));
const PostPreview = dynamic(() => import('./post-preview'));
const CommentModal = dynamic(() => import('./comment-modal'), { ssr: false });
const ReactionsModal = dynamic(() => import('./reactions-modal'), {
  ssr: false,
});

const Section = styled.section`
  padding: 40px 60px;
`;

const H2 = styled.h2`
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  color: rgba(0, 0, 0, 0.5);
  margin: 0;
  padding-bottom: 4px;
`;

function ReactionsCount({ reactions, likeCount }) {
  const dialog = useDialogState({
    animated: true,
  });

  return (
    <>
      <DialogDisclosure
        {...dialog}
        css={css`
          font-size: inherit;
          color: inherit;
          display: inline-flex;
          align-items: center;
          cursor: pointer;
        `}
      >
        <ReactionsList
          reactions={reactions.slice(0, 3)}
          size={24}
          css={css`
            margin-right: 6px;
          `}
        />
        {likeCount}
      </DialogDisclosure>
      <ReactionsModal reactions={reactions} {...dialog} />
    </>
  );
}

let Post = function Post({ postID, placeholderData, closeButton, modalRef }) {
  const { data: post, isPlaceholderData } = useQuery(`posts/${postID}`, {
    placeholderData,
    staleTime: 30 * 60 * 1000, // 30 mins
  });

  if (!post) {
    // TODO: skeleton?
    return null;
  }

  const { customStyle } = post;

  return (
    <>
      <article
        css={css`
          padding: 40px 60px 0;
          position: relative;
        `}
      >
        <Head
          title={`${post.title} - ${post.forumName}板`}
          description={post.excerpt}
          images={
            // TODO: Resize and host it via next/image
            post.mediaMeta && dedupe(post.mediaMeta.map((media) => media.url))
          }
        />

        {customStyle?.headerColor && (
          <>
            <div
              css={css`
                height: 28px;
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;

                ${!modalRef &&
                css`
                  border-top-left-radius: 4px;
                  border-top-right-radius: 4px;
                `}
              `}
              style={{
                background: customStyle.headerColor,
              }}
            />
            <div
              css={css`
                height: 28px;
              `}
            />
          </>
        )}

        <div
          css={css`
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 22px;
          `}
        >
          <UserInfo
            gender={post.gender}
            withNickname={post.withNickname}
            school={post.school}
            department={post.department}
            postAvatar={post.postAvatar}
          />

          {closeButton}
        </div>

        {customStyle?.label && (
          <PostLabel
            style={{ background: customStyle.label.bgColor }}
            css={css`
              font-size: 18px;
              font-weight: 500;
              padding: 4px 7px;
              line-height: 24px;
              margin-bottom: 18px;
            `}
          >
            {customStyle.label.text}
          </PostLabel>
        )}

        <h1
          id="post-title"
          css={css`
            font-weight: 500;
            font-size: 28px;
            line-height: 40px;
            overflow-wrap: break-word;
            color: rgba(0, 0, 0, 0.95);
            margin: 0;
          `}
        >
          {post.title}
        </h1>

        <div
          css={css`
            color: rgba(0, 0, 0, 0.35);
            font-size: 14px;
            margin-top: 12px;
          `}
        >
          <Link href={`/f/${post.forumAlias}`}>
            <a>{post.forumName}</a>
          </Link>
          <span
            aria-hidden="true"
            css={css`
              padding: 0 0.5em;
            `}
          >
            ·
          </span>
          <ReadableDateTime dateTime={post.createdAt} />
        </div>

        {post.replyId && (
          <section
            aria-labelledby="reply-section-title"
            css={css`
              padding: 10px 0;
              border-top: 1px solid rgb(233, 233, 233);
              border-bottom: 1px solid rgb(233, 233, 233);
              margin-top: 20px;
            `}
          >
            <h2
              id="reply-section-title"
              css={css`
                font-weight: normal;
                font-size: 16px;
                line-height: 30px;
                color: rgba(0, 0, 0, 0.35);
                margin: 0;
                padding-bottom: 3px;
              `}
            >
              前情提要
            </h2>
            <PostPreview
              postID={post.replyId}
              forumAlias={post.forumAlias}
              css={css`
                margin: 4px 0;
              `}
            />
          </section>
        )}

        <PostContent
          skipParsing={isPlaceholderData}
          mediaMeta={post.mediaMeta?.length ? post.mediaMeta : post.media}
          css={css`
            padding: 20px 0 40px;
          `}
        >
          {post.content ?? post.excerpt}
        </PostContent>

        <ul
          css={css`
            margin-bottom: 16px;
            list-style: none;
            display: block;
          `}
        >
          {post.topics.map((topic) => (
            <li
              key={topic}
              css={css`
                display: inline-block;
                margin: 8px 8px 0 0;

                &:last-child {
                  margin-right: 0;
                }
              `}
            >
              <TopicTag>{topic}</TopicTag>
            </li>
          ))}
        </ul>

        <footer
          css={css`
            color: rgba(0, 0, 0, 0.5);
            font-size: 18px;
            display: flex;
            align-items: center;
            margin: 6px 0;
          `}
        >
          <ReactionsCount
            reactions={post.reactions}
            likeCount={post.likeCount}
          />
          <span aria-hidden="true">・</span>
          回應 {post.commentCount}
        </footer>
      </article>

      <Section
        aria-labelledby="post-info-title"
        css={css`
          display: flex;
          flex-direction: column;
        `}
      >
        <H2 id="post-info-title">文章資訊</H2>

        <PostInfo
          forumAlias={post.forumAlias}
          persona={post.withNickname && post.department}
        />
      </Section>

      <PopularComments
        postID={post.id}
        Wrapper={({ children }) => (
          <Section
            aria-labelledby="popular-comments-title"
            css={css`
              background: rgb(245, 245, 245);
            `}
          >
            <H2 id="popular-comments-title">熱門回應</H2>
            {children}
          </Section>
        )}
      />

      <Darsys
        postID={post.id}
        isInModal={!!modalRef}
        Wrapper={({ children }) => (
          <Section
            aria-labelledby="darsys-title"
            css={css`
              background: #fff;
            `}
          >
            <H2 id="darsys-title">你可能感興趣的文章</H2>
            {children}
          </Section>
        )}
      />

      <AllComments
        postID={post.id}
        modalRef={modalRef}
        Wrapper={({ children }) => (
          <Section
            aria-labelledby="all-comments-title"
            css={css`
              background: rgb(245, 245, 245);
            `}
          >
            <H2 id="all-comments-title">共 {post.commentCount} 則回應</H2>
            {children}
          </Section>
        )}
      />

      <CommentModal />
    </>
  );
};

Post = memo(Post);

Post.prefetchQueries = async function prefetchQueries(queryClient, context) {
  const { postID } = context.router.query;

  async function loadPostAndPersonaInfo() {
    // Use fetchQuery to catch the error
    const postInfo = await queryClient.fetchQuery(`posts/${postID}`);

    const persona = postInfo.withNickname && postInfo.department;
    if (persona) {
      await queryClient.prefetchQuery(`personas/${persona}`);
    }
  }

  await Promise.all([
    loadPostAndPersonaInfo(),
    // Loaded in popular-comments
    queryClient.prefetchQuery([`posts/${postID}/comments`, { popular: true }]),
    // Loaded in darsys
    queryClient.prefetchQuery(['posts/darsys', { postID }]),
  ]);
};

export default Post;
