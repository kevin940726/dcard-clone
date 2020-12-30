import { Fragment } from 'react';
import NextHead from 'next/head';

const DEFAULT_DESCRIPTION =
  '廣受年輕人喜愛的 Dcard 是台灣最大的匿名交流平台，舉凡時事話題、感情心情、吃喝玩樂、學習工作等，都有卡友陪你聊！';
const DEFAULT_IMAGES = ['/landing.png'];

export default function Head({
  title,
  description = DEFAULT_DESCRIPTION,
  images = DEFAULT_IMAGES,
  children,
}) {
  const normalizedTitle = title ? `${title} | Dcard clone` : 'Dcard clone';

  return (
    <NextHead>
      <meta key="robots" name="robots" content="noindex" />
      <title key="title">{normalizedTitle}</title>
      <meta key="og:title" name="og:title" content={normalizedTitle} />
      <meta
        key="twitter:title"
        name="twitter:title"
        content={normalizedTitle}
      />
      <meta key="description" name="description" content={description} />
      <meta key="og:description" name="og:description" content={description} />
      <meta
        key="twitter:description"
        name="twitter:description"
        content={description}
      />
      {images.map((image) => (
        <Fragment key={image}>
          <meta key="og:image" property="og:image" content={image} />
          <meta
            key="og:image:secure_url"
            property="og:image:secure_url"
            content={image}
          />
          <meta key="twitter:image" property="twitter:image" content={image} />
        </Fragment>
      ))}
      {children}
    </NextHead>
  );
}
