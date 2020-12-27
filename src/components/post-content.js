import { useMemo, cloneElement } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import styled, { css } from 'styled-components';
import ZoomableImage from './zoomable-image';

const VideoPlayer = dynamic(() => import('./video-player'));
const LinkAttachment = dynamic(() => import('./link-attachment'));
const PostPreview = dynamic(() => import('./post-preview'));

const FLOOR_REGEX = /\b(b\d+)\b/gim;

function FloorLink({ floor, children }) {
  const router = useRouter();
  const { forumAlias, postID, stepsFromPost } = router.query;

  return (
    <Link
      href={{
        pathname: router.pathname,
        query: {
          ...router.query,
          forumAlias,
          postID,
          floor,
          stepsFromPost: parseInt(stepsFromPost ?? 0, 10) + 1,
        },
      }}
      as={`/f/${forumAlias}/p/${postID}/b/${floor}`}
      shallow
      scroll={false}
    >
      <a>{children}</a>
    </Link>
  );
}

const ImageBlock = (props) => (
  <div
    css={css`
      margin: 10px 0;
      display: flex;
      max-height: 60vh;
    `}
  >
    <ZoomableImage objectFit="contain" objectPosition="left top" {...props}>
      {(!props.height || !props.width) && (
        <img
          src={props.src}
          alt={props.alt}
          loading="lazy"
          css={css`
            display: block;
            object-fit: contain;
            object-position: left top;
            max-width: 100%;
            max-height: 100%;
          `}
        />
      )}
    </ZoomableImage>
  </div>
);

const Paragraph = styled.p`
  margin: 0;
`;

function PostContent({ skipParsing, mediaMeta, children = '', ...props }) {
  const contentBlocks = useMemo(() => {
    const mediaMetaByURL = {};
    if (mediaMeta && mediaMeta.length) {
      for (const media of mediaMeta) {
        mediaMetaByURL[media.url] = media;
      }
    }

    const content = [];
    const lines = children.split(/(\n|https:\/\/.*)/g);

    lines.forEach((line) => {
      if (line in mediaMetaByURL) {
        const media = mediaMetaByURL[line];

        let type = media.type;

        if (!type) {
          if (line.startsWith('https://i.imgur.com/')) {
            type = 'image/imgur';
          }
        }

        switch (type) {
          case 'image/imgur':
          case 'image/megapx': {
            content.push(
              <ImageBlock
                src={media.url}
                height={media.height}
                width={media.width}
              />
            );
            break;
          }
          case 'video/youtube':
          case 'video/vivid': {
            content.push(
              <VideoPlayer
                src={media.normalizedUrl || media.url}
                thumbnail={media.thumbnail}
                type={media.type}
              />
            );
            break;
          }
          default: {
            // TODO: what else?
            content.push({
              type: Paragraph,
              children: line,
            });
            break;
          }
        }
      } else if (line.match(/^https?:\/\//)) {
        if (line.match(/vimeo.com\/\d+/)) {
          content.push(<VideoPlayer type="video/vimeo" src={line} />);
        } else if (line.match(/dcard.tw\/f\/\w+\/p\/\d+/)) {
          const [, forumAlias, postID] = line.match(
            /dcard\.tw\/f\/(\w+)\/p\/(\d+)/
          );
          content.push(
            <PostPreview
              forumAlias={forumAlias}
              postID={postID}
              css={css`
                margin: 4px 0;
              `}
            />
          );
        } else {
          content.push(
            <LinkAttachment
              src={line}
              css={css`
                margin: 4px 0;
              `}
            />
          );
        }
      } else {
        let lastBlock = content[content.length - 1];

        if (!lastBlock || lastBlock.type !== Paragraph) {
          lastBlock = { type: Paragraph, children: '' };
          content.push(lastBlock);
        }

        lastBlock.children += line;
      }
    });

    content
      .filter((block) => block.type === Paragraph)
      .forEach((paragraph) => {
        paragraph.children = paragraph.children.split(FLOOR_REGEX);

        for (let index = 1; index < paragraph.children.length; index += 2) {
          const floorText = paragraph.children[index];
          const floor = parseInt(floorText.slice(1), 10);

          if (floor === 0) {
            paragraph.children[index] = <a key={index}>{floorText}</a>;
          } else {
            paragraph.children[index] = (
              <FloorLink key={index} floor={floor}>
                {floorText}
              </FloorLink>
            );
          }
        }
      });

    return content;
  }, [children, mediaMeta]);

  return (
    <div
      css={css`
        white-space: pre-wrap;
        word-break: break-word;
        font-weight: 400;
        font-size: 16px;
        overflow-wrap: break-word;
        color: rgba(0, 0, 0, 0.75);
        line-height: 28px;
      `}
      {...props}
    >
      {skipParsing
        ? children
        : contentBlocks.map((block, index) =>
            block.type === Paragraph ? (
              <Paragraph key={index}>{block.children}</Paragraph>
            ) : (
              cloneElement(block, { key: index })
            )
          )}
    </div>
  );
}

export default PostContent;
