import { useState } from 'react';
import { useQuery } from 'react-query';
import styled, { css } from 'styled-components';
import Image from 'next/image';

export const LinkWrapper = styled.a`
  display: flex;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  background: rgb(255, 255, 255);
  height: 92px;
  overflow: hidden;
  color: rgba(0, 0, 0, 0.35);
`;

const Description = styled.p`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.75);
  line-height: 20px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin: 0 16px 0 0;
`;

export function LinkPreview({
  title,
  description,
  hasBlockQuote,
  footer,
  image,
  defaultImage,
  ...props
}) {
  const [shouldShowDescription, setShouldShowDescription] = useState(true);

  function titleRefCallback(node) {
    if (node && node.offsetHeight > 22) {
      setShouldShowDescription(false);
    }
  }

  return (
    <>
      <span
        css={css`
          padding: 12px;
          display: inline-flex;
          flex-direction: column;
          min-width: 0;
          flex-grow: 1;
        `}
      >
        <h3
          css={css`
            overflow: hidden;
            display: -webkit-box;
            text-overflow: ellipsis;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            font-weight: 500;
            font-size: 16px;
            line-height: 22px;
            color: rgba(0, 0, 0, 0.85);
            word-break: break-word;
            margin: 0 0 4px 0;
          `}
          ref={titleRefCallback}
        >
          {title}
        </h3>
        {shouldShowDescription &&
          (hasBlockQuote ? (
            <Description
              as="blockquote"
              css={css`
                padding: 0 0 0 4px;
                margin: 0;
                border-left: 4px solid rgba(0, 0, 0, 0.15);
              `}
            >
              {description}
            </Description>
          ) : (
            <Description>{description}</Description>
          ))}
        <footer
          css={css`
            display: flex;
            align-items: center;
            font-weight: 500;
            font-size: 12px;
            line-height: 17px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            margin-top: auto;
          `}
        >
          {footer}
        </footer>
      </span>

      <span
        css={css`
          flex-shrink: 0;
          width: 92px;
          height: 92px;
          background-color: rgb(242, 243, 244);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        `}
      >
        {image ? (
          <img
            src={image}
            alt=""
            width={92}
            height={92}
            css={css`
              object-fit: cover;
            `}
          />
        ) : (
          defaultImage
        )}
      </span>
    </>
  );
}

export default function LinkAttachment({ src, ...props }) {
  const { data: linkAttachment, isLoading } = useQuery(
    ['posts/link-attachment', { url: src }],
    {
      staleTime: Infinity,
    }
  );

  let content = null;
  if (!isLoading) {
    const { description, domain, favicon, image, title } = linkAttachment ?? {
      title: '無法取得網頁資訊',
      domain: new URL(src).hostname,
    };

    content = (
      <LinkPreview
        title={title}
        description={description}
        footer={
          <>
            {favicon && (
              <img
                src={favicon}
                width={14}
                height={14}
                alt=""
                css={css`
                  display: inline-block;
                  margin: 1px 5px 1px 1px;
                `}
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
            )}
            {domain}
          </>
        }
        image={image?.url}
        defaultImage={<Image src="/link.svg" alt="" width={24} height={24} />}
      />
    );
  }

  return (
    <LinkWrapper
      href={src}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {content}
    </LinkWrapper>
  );
}
