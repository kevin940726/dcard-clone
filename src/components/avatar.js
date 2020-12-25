import Image from 'next/image';
import styled, { css } from 'styled-components';
import { GirlIcon, BoyIcon, GenderDIcon } from './gender-icons';

const GENDER_MAP = {
  M: BoyIcon,
  F: GirlIcon,
  D: GenderDIcon,
};

const StyledImage = styled(Image).attrs((props) => ({
  width: props.size,
  height: props.size,
}))`
  border-radius: 50%;
`;

function AnonymousIcon(props) {
  return (
    <svg
      viewBox="0 0 80 80"
      width="32"
      height="32"
      focusable="false"
      {...props}
    >
      <title>匿名</title>
      <path fill="#cfd8dc" d="M0 0h80v80H0z"></path>
      <path
        fill="#37474f"
        d="M74.7 79.8c-5.6-7.2-13.5-6.4-19-10-.7-.4-4.2-5.6-4.5-6-.4-.7-.1-6.6 0-7.4 0 0 5.5-3.1 6.7-13 0 0 2.9.2 3.6-4.2.7-4-.4-5.5-1.9-5.7 0 0 0-4.3.2-6.8 1.3-14.4-20.3-27.4-33-12.8-9 4-7.2 15.1-6 19.5-.7 0-2 .7-1.5 4.9.6 5.3 3.1 5 3.6 5 0 0 .7 9.5 7.2 13 0 0 .5 6.8.3 7.6a71.7 71.7 0 01-4.8 6c-4.8 3.6-13.3 2-19.2 8.8l-1 1.4H75z"
      ></path>
    </svg>
  );
}

export default function Avatar({
  gender,
  nickname,
  postAvatar,
  size,
  hidden,
  ...props
}) {
  if (hidden) {
    return (
      <AnonymousIcon
        width={size}
        height={size}
        css={css`
          border-radius: 50%;
        `}
        {...props}
      />
    );
  } else if (postAvatar) {
    return (
      <StyledImage
        src={postAvatar}
        size={size}
        alt={nickname || ''}
        {...props}
      />
    );
  } else if (nickname && gender !== 'D') {
    return (
      <span
        css={css`
          background: ${gender === 'M'
            ? 'rgb(0, 110, 165)'
            : 'rgb(203, 58, 107)'};
          color: rgb(255, 255, 255);
          font-size: ${size * 0.64}px;
          line-height: ${size}px;
          text-align: center;
          border-radius: 50%;
          width: ${size}px;
          height: ${size}px;
        `}
        role="img"
        aria-label={nickname}
        {...props}
      >
        {nickname[0].toUpperCase()}
      </span>
    );
  }

  const SVG = GENDER_MAP[gender] ?? GENDER_MAP.D;

  return <SVG width={size} height={size} {...props} />;
}
