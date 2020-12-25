import { useMemo } from 'react';
import Image from 'next/image';
import { css } from 'styled-components';
import { useQuery } from 'react-query';

export default function Reaction({ id, ...props }) {
  const { data: reactions } = useQuery('posts/reactions', {
    staleTime: Infinity,
  });

  const reaction = useMemo(() => reactions?.find((item) => item.id === id), [
    reactions,
    id,
  ]);

  if (!id) {
    return (
      <Image
        src="/reactions/heart-gray.png"
        alt="心情"
        title="心情"
        css={css`
          border-radius: 50%;
        `}
        {...props}
      />
    );
  } else if (!reaction) {
    const { width, height, ...rest } = props;
    return (
      <span
        css={css`
          display: inline-block;
          width: ${width}px;
          height: ${height}px;
        `}
        {...rest}
      />
    );
  }

  return (
    <Image
      src={reaction.url}
      alt={reaction.name}
      title={reaction.name}
      css={css`
        border-radius: 50%;
      `}
      {...props}
    />
  );
}
