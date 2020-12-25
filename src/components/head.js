import NextHead from 'next/head';

export default function Head({ title, description, children }) {
  const normalizedTitle = title ? `${title} | Dcard` : 'Dcard';

  return (
    <NextHead>
      <meta name="robots" content="noindex" />
      <title>{normalizedTitle}</title>
      <meta name="og:title" content={normalizedTitle} />
      <meta name="description" content={description} />
      <meta name="og:description" content={description} />
      <meta name="twitter:description" content={description} />
      {children}
    </NextHead>
  );
}
