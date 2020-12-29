import { useQuery } from 'react-query';
import { css } from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

function Item({
  postID,
  forumAlias,
  title,
  likeCount,
  commentCount,
  image,
  isInModal,
}) {
  const router = useRouter();

  return (
    <li
      css={css`
        display: inline-flex;
        flex-grow: 0;
        flex-shrink: 0;
        min-width: 0;
        flex-basis: calc(50% - 37.5px);
        height: 40px;
        padding: 8px 0 8px 15px;
        position: relative;
        box-sizing: content-box;

        &:nth-child(2n + 1) {
          margin-right: 43px;
        }

        &:before {
          content: '';
          position: absolute;
          width: 7px;
          height: 7px;
          top: 15px;
          left: 0;
          border-radius: 50%;
          background: rgb(51, 151, 207);
        }
      `}
    >
      <Link
        href={
          isInModal
            ? {
                pathname: router.pathname,
                query: {
                  postID,
                  forumAlias,
                  stepsFromList: (router.query.stepsFromList ?? 1) + 1,
                },
              }
            : `/f/${forumAlias}/p/${postID}`
        }
        as={`/f/${forumAlias}/p/${postID}`}
        passHref
      >
        <a
          css={css`
            display: flex;
            align-items: center;
            width: 100%;
            color: rgba(0, 0, 0, 0.35);
          `}
        >
          <span
            css={css`
              display: inline-flex;
              flex-direction: column;
              margin-right: 16px;
              width: calc(100% - 56px);
              flex-shrink: 0;
              min-width: 0;
            `}
          >
            <h4
              css={css`
                font-size: 16px;
                font-weight: bold;
                color: rgb(0, 0, 0);
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                margin: 0 0 3px;
              `}
            >
              {title}
            </h4>
            <footer>
              心情 {likeCount}
              <span aria-hidden="true">・</span>
              回應 {commentCount}
            </footer>
          </span>
          {image && (
            <span
              css={css`
                width: 40px;
                flex-shrink: 0;
                height: 40x;
                display: inline-flex;
                overflow: hidden;
                border-radius: 4px;
                border: 1px solid rgba(0, 0, 0, 0.1);
              `}
            >
              <Image src={image.url} width={40} height={40} objectFit="cover" />
            </span>
          )}
        </a>
      </Link>
    </li>
  );
}

export default function Darsys({ Wrapper, postID, isInModal }) {
  const { data } = useQuery(['posts/darsys', { postID }], {
    staleTime: Infinity,
  });

  if (!data) {
    return null;
  }

  const darsys = data.posts;

  return (
    <Wrapper>
      <ul
        css={css`
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          padding: 0;
          margin: 10px 0 0;
          list-style: none;
        `}
      >
        {darsys.map((post) => (
          <Item
            key={post.id}
            forumAlias={post.forumAlias}
            postID={post.id}
            title={post.title}
            likeCount={post.likeCount}
            commentCount={post.commentCount}
            image={[...(post.mediaMeta ?? []), ...post.media].find((media) =>
              media.type?.startsWith?.('image/')
            )}
            isInModal={isInModal}
          />
        ))}
      </ul>
    </Wrapper>
  );
}
