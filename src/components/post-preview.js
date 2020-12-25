import { useQuery } from 'react-query';
import { css } from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { LinkWrapper, LinkPreview } from './link-attachment';
import ReactionsList from './reactions-list';
import useModalParentLocation from '../hooks/use-modal-parent-location';

export default function PostPreview({ forumAlias, postID, ...props }) {
  const router = useRouter();
  const modalParentLocation = useModalParentLocation(!!router.query.postID);
  const { stepsFromList = 1 } = router.query;
  const { data: post } = useQuery(`posts/${postID}/preview`, {
    staleTime: Infinity,
  });

  let content = null;
  if (post) {
    content = (
      <LinkPreview
        title={post.title}
        description={post.replyId ? post.replyTitle : post.excerpt}
        hasBlockQuote={!!post.replyId}
        footer={
          <div
            css={css`
              font-size: 14px;
              font-weight: 400;
              line-height: 20px;
              display: flex;
              align-items: center;
            `}
          >
            <span
              css={css`
                display: inline-flex;
                align-items: center;
                margin-right: 16px;
              `}
            >
              <ReactionsList
                reactions={post.reactions.slice(0, 3)}
                size={20}
                css={css`
                  margin-right: 6px;
                `}
              />
              {post.likeCount}
            </span>
            <span>回應 {post.commentCount}</span>
          </div>
        }
        image={post.mediaMeta?.[0]?.url}
        defaultImage={
          <Image src="/dcard-icon.png" alt="" width={92} height={92} />
        }
      />
    );
  }

  const asPath = `/f/${forumAlias}/p/${postID}`;

  return (
    <Link
      href={
        modalParentLocation.asPath.startsWith(asPath)
          ? asPath
          : {
              pathname: modalParentLocation.pathname,
              query: {
                postID,
                forumAlias,
                stepsFromList: parseInt(stepsFromList, 10) + 1,
              },
            }
      }
      as={`/f/${forumAlias}/p/${postID}`}
      passHref
    >
      <LinkWrapper {...props}>{content}</LinkWrapper>
    </Link>
  );
}
