import Image from 'next/image';
import { css } from 'styled-components';

const REACTIONS_MAP = {
  '286f599c-f86a-4932-82f0-f5a06f1eca03': {
    name: '愛心',
    image: '/reactions/heart.png',
  },
  '4b018f48-e184-445f-adf1-fc8e04ba09b9': {
    name: '驚訝',
    image: '/reactions/surprise.png',
  },
  'e8e6bc5d-41b0-4129-b134-97507523d7ff': {
    name: '哈哈',
    image: '/reactions/laugh.png',
  },
  '514c2569-fd53-4d9d-a415-bf0f88e7329f': {
    name: '嗚嗚',
    image: '/reactions/cry.png',
  },
  'aa0d425f-d530-4478-9a77-fe3aedc79eea': {
    name: '森77',
    image: '/reactions/angry.png',
  },
  '011ead16-9b83-4729-9fde-c588920c6c2d': {
    name: '跪',
    image: '/reactions/bow.png',
  },
};

export default function Reaction({ id, ...props }) {
  const reaction = REACTIONS_MAP[id];

  if (!reaction) {
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
  }

  return (
    <Image
      src={reaction.image}
      alt={reaction.name}
      title={reaction.name}
      css={css`
        border-radius: 50%;
      `}
      {...props}
    />
  );
}
