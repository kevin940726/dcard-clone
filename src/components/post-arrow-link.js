import { useState, useLayoutEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled, { css } from 'styled-components';
import PostItem from './post-item';
import getScrollbarWidth from '../utils/get-scrollbar-width';

const Text = styled.span`
  display: inline-flex;
  color: rgb(255, 255, 255);
  font-size: 14px;
  visibility: hidden;
  margin-top: 10px;
`;

const ArrowWrapper = styled.span`
  width: 82px;
  height: 160px;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Article = styled.article`
  display: none;
  padding: 20px;
  width: 640px;
  background-color: #fff;
  pointer-events: none;
  order: ${(props) => (props.direction === 'left' ? 1 : 0)};
`;

export const PostArrowBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.3s linear 0s;
  pointer-events: none;
  z-index: 10;
`;

export default function PostArrowLink({
  post,
  postIndex,
  activePostItemRef,
  direction = 'right',
}) {
  const router = useRouter();
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const stepsFromList = parseInt(router.query.stepsFromList ?? 1, 10);

  useLayoutEffect(() => {
    setScrollbarWidth(getScrollbarWidth());
  }, []);

  return (
    <Link
      href={{
        pathname: router.pathname,
        query: {
          ...router.query,
          postID: post.id,
          forumAlias: post.forumAlias,
          postIndex,
          stepsFromList: stepsFromList + 1,
        },
      }}
      as={`/f/${post.forumAlias}/p/${post.id}`}
      scroll={false}
      passHref
    >
      <a
        css={css`
          position: fixed;
          display: flex;
          height: 160px;
          top: 50%;
          ${direction}: calc((100% - 728px) / 2 - 82px + ${direction === 'right'
            ? scrollbarWidth
            : -scrollbarWidth}px / 2);
          transform: translate(0%, -50%);
          border-radius: 4px;
          overflow: hidden;
          z-index: 20;

          &:hover {
            box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px;

            ${Text} {
              visibility: visible;
            }
            ${ArrowWrapper} {
              background-color: rgba(255, 255, 255, 0.3);
            }
            ${Article} {
              opacity: 1;
              display: inline-flex;
            }
            & ~ ${PostArrowBackground} {
              opacity: 1;
            }
          }
        `}
        onClick={() => {
          if (activePostItemRef.current) {
            // Not idiomatic React code but it works
            activePostItemRef.current = activePostItemRef.current
              .closest('[role="feed"]')
              ?.querySelector?.(`[aria-posinset="${postIndex + 1}"] a`);
          }
        }}
      >
        <Article direction={direction}>
          <PostItem {...post} layout="classic" />
        </Article>

        <ArrowWrapper>
          <svg
            viewBox="0 0 30 60"
            direction={direction}
            focusable="false"
            width="60"
            height="60"
            role="img"
            aria-hidden="true"
            css={css`
              ${(props) =>
                props.direction === 'left' &&
                css`
                  transform: rotate(180deg);
                `}
            `}
          >
            <path
              d="M4.6 59.3L28 34.9c2.6-2.7 2.6-7.1 0-9.7L4.6.8C3.5-.3 1.8-.3.8.8s-1.1 2.9 0 4l23.4 24.4c.4.4.4 1.3 0 2L.8 55.5c-.9 1.1-.9 2.9.4 4 1.1.7 2.6.7 3.4-.2"
              opacity="0.75"
              fill="#fff"
            ></path>
          </svg>
          <Text>{direction === 'right' ? '下一篇' : '上一篇'}</Text>
        </ArrowWrapper>
      </a>
    </Link>
  );
}
