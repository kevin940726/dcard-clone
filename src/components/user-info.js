import Link from 'next/link';
import styled, { css } from 'styled-components';
import Avatar from './avatar';

const SecondRow = styled.span`
  color: rgba(0, 0, 0, 0.5);
  font-weight: 500;
  font-size: 12px;
  line-height: 17px;
`;

export default function UserInfo({
  gender,
  withNickname,
  school,
  department,
  postAvatar,
  children,
  hidden,
  ...props
}) {
  const info = (
    <span
      css={css`
        display: inline-flex;
        align-items: center;
      `}
      {...props}
    >
      <span
        css={css`
          display: inline-flex;
          margin-right: 8px;
        `}
      >
        <Avatar
          gender={gender}
          nickname={withNickname && department}
          postAvatar={postAvatar}
          size={32}
          hidden={hidden}
        />
      </span>

      <span
        css={css`
          display: inline-flex;
          flex-direction: column;
        `}
      >
        <span
          css={css`
            display: flex;
            align-items: center;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            color: rgba(0, 0, 0);
            font-weight: 500;
            font-size: 14px;
            line-height: 20px;
            margin-right: 2px;
          `}
        >
          {hidden ? (
            '這則回應已被刪除'
          ) : (
            <>
              {!school && !department && '匿名'}
              {school} {!withNickname && department}
            </>
          )}
        </span>

        {children ? (
          <SecondRow>{children}</SecondRow>
        ) : (
          withNickname && <SecondRow>@{department}</SecondRow>
        )}
      </span>
    </span>
  );

  if (withNickname) {
    return (
      <Link href={`/@${department}`}>
        <a>{info}</a>
      </Link>
    );
  }

  return info;
}
