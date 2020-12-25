import { css } from 'styled-components';
import Link from 'next/link';

export default function TopicTag({ children, ...props }) {
  return (
    <Link href={`/topics/${children}`}>
      <a
        css={css`
          height: 32px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          color: rgba(0, 0, 0, 0.75);
          font-size: 14px;
          border-radius: 16px;
          background: rgb(239, 239, 239);
          padding: 0px 16px;
          white-space: nowrap;
          cursor: pointer;
        `}
        {...props}
      >
        {children}
      </a>
    </Link>
  );
}
