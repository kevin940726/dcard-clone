import { useState } from 'react';
import { css } from 'styled-components';
import { VisuallyHidden } from 'reakit';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useForumByAlias } from '../hooks/use-forums-query';
import useModalParentLocation from '../hooks/use-modal-parent-location';

export default function SearchBar() {
  const router = useRouter();
  const [value, setValue] = useState(router.query.query ?? '');
  const modalParentLocation = useModalParentLocation(!!router.query.postID);
  const { forumAlias, forum } = modalParentLocation.query;
  const searchForumAlias = forumAlias ?? forum;
  const forumData = useForumByAlias(searchForumAlias);

  return (
    <form
      role="search"
      css={css`
        display: flex;
        position: relative;
        justify-content: space-between;
        margin: 0 32px;
        flex-shrink: 1;
        width: 666px;
        min-width: 200px;
        height: 30px;
        border-radius: 4px;
        overflow: hidden;
      `}
      onSubmit={(event) => {
        event.preventDefault();

        if (value) {
          router.push({
            pathname: '/search',
            query: {
              query: value,
              ...(searchForumAlias
                ? {
                    forum: searchForumAlias,
                  }
                : {}),
            },
          });
        }
      }}
    >
      <label htmlFor="header-search">
        <VisuallyHidden>搜尋</VisuallyHidden>
      </label>

      <input
        type="search"
        id="header-search"
        css={css`
          height: 100%;
          padding: 0px 8px;
          font-size: 14px;
          color: rgb(255, 255, 255);
          flex-grow: 1;
          flex-shrink: 1;
          border: none;
          min-width: 130px;
          max-width: 640px;
          background: rgb(0, 88, 138);
          outline: none;

          &::placeholder {
            color: rgba(255, 255, 255, 0.75);
          }
        `}
        value={value}
        placeholder={
          searchForumAlias && forumData
            ? `在${forumData.name}板搜尋`
            : undefined
        }
        onChange={(event) => setValue(event.target.value)}
      />

      {!!value && (
        <button
          type="reset"
          title="清除"
          css={css`
            display: inline-flex;
            align-items: center;
            position: absolute;
            top: 0;
            bottom: 0;
            margin: 0 auto;
            right: 47px;
          `}
          onClick={() => setValue('')}
        >
          <Image src="/reset.svg" alt="清除" width={14} height={14} />
        </button>
      )}

      <button
        type="submit"
        title="搜尋"
        disabled={!value}
        css={css`
          flex-shrink: 0;
          background: rgb(0, 106, 166);
          border: 1px solid rgb(0, 88, 138);
          display: flex;
          align-items: center;
          padding: 0 9px;
          cursor: pointer;

          &:disabled {
            cursor: default;
          }
        `}
      >
        <Image src="/search.svg" alt="搜尋" width={20} height={20} />
      </button>
    </form>
  );
}
