import { css } from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';

export default function ForumItem({ forum }) {
  if (!forum) {
    return null;
  }

  return (
    <Link href={`/f/${forum.alias}`} passHref>
      <a
        css={css`
          display: flex;
          align-items: center;
          font-size: 16px;
          font-weight: 500;
          line-height: 22px;
          color: #000;
          height: 28px;
          padding: 8px 16px 8px 14px;
          box-sizing: content-box;
        `}
      >
        <span
          css={css`
            display: inline-flex;
            border-radius: 50%;
            margin-right: 10px;
            border-radius: 50%;
            overflow: hidden;
          `}
        >
          <Image
            src={forum.logo?.url ?? '/forum-logo-placeholder.svg'}
            alt=""
            width={28}
            height={28}
          />
        </span>
        <span id={`${forum.id}_title`}>{forum.name}</span>
      </a>
    </Link>
  );
}
