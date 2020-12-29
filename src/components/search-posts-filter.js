import { forwardRef } from 'react';
import { css } from 'styled-components';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { VisuallyHidden } from 'reakit';
import useModalParentLocation from '../hooks/use-modal-parent-location';
import { useMenuState, MenuButton, Menu, MenuItem } from './menu';
import ArrowIcon from './arrow-icon';

const SORT_LABEL = {
  created: '最新發佈',
  like: '心情數',
  collection: '收藏數',
  relevance: '相關度',
};

const SINCE_LABEL = {
  0: '不限時間',
  1: '一天內',
  7: '七天內',
  30: '30 天內',
};

function CheckboxIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      focusable="false"
      width="18"
      height="18"
      role="img"
      aria-hidden="true"
      {...props}
    >
      <path d="M9 16.17L5.53 12.7a1 1 0 00-1.4 0h-.01a1 1 0 000 1.41L8.3 18.3a1 1 0 001.4 0L20.3 7.7a1 1 0 000-1.41 1 1 0 00-1.41 0z"></path>
    </svg>
  );
}

function SelectMenuButton({ menu, children, ...props }) {
  return (
    <MenuButton
      menu={menu}
      css={css`
        width: 88px;
        height: 32px;
        padding: 0 2px 0 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        line-height: normal;
        background-color: rgba(0, 16, 32, 0.06);
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.5);
        margin-right: 8px;

        svg {
          fill: rgba(0, 0, 0, 0.45);
          margin-left: -6px;
        }
      `}
      {...props}
    >
      <span>{children}</span>
      <ArrowIcon width={22} height={22} />
    </MenuButton>
  );
}

const SelectMenuItem = forwardRef(
  ({ name, value, label, menu, ...props }, ref) => {
    const router = useRouter();
    return (
      <Link
        href={{
          pathname: router.pathname,
          query: {
            ...router.query,
            [name]: value,
          },
        }}
        passHref
      >
        <MenuItem
          id={value}
          ref={ref}
          menu={menu}
          onClick={menu.hide}
          {...props}
        >
          {label}
        </MenuItem>
      </Link>
    );
  }
);

export default function SearchPostsFilter() {
  const router = useRouter();
  const isModalOpen = !!router.query.postID;
  const modalParentLocation = useModalParentLocation(isModalOpen);
  const {
    sort = 'created',
    since = '0',
    field = 'all',
  } = modalParentLocation.query;

  const sortMenu = useMenuState({ gutter: 10, placement: 'bottom' });
  const sinceMenu = useMenuState({ gutter: 10, placement: 'bottom' });

  function handleChangeField(event) {
    const field = event.target.checked ? 'all' : 'title';

    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        field,
      },
    });
  }

  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 24px 60px;
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
        `}
      >
        <SelectMenuButton menu={sortMenu} aria-controls="search-results">
          {SORT_LABEL[sort] ?? '最新發佈'}
        </SelectMenuButton>
        <Menu menu={sortMenu} aria-label="排序">
          {Object.entries(SORT_LABEL).map(([sortValue, label]) => (
            <SelectMenuItem
              key={sortValue}
              menu={sortMenu}
              name="sort"
              value={sortValue}
              label={label}
              isActive={sort === sortValue}
            />
          ))}
        </Menu>

        <SelectMenuButton menu={sinceMenu} aria-controls="search-results">
          {SINCE_LABEL[since] ?? '不限時間'}
        </SelectMenuButton>
        <Menu menu={sinceMenu} aria-label="時間">
          {Object.entries(SINCE_LABEL).map(([sinceValue, label]) => (
            <SelectMenuItem
              key={sinceValue}
              menu={sinceMenu}
              name="since"
              value={sinceValue}
              label={label}
              isActive={since === sinceValue}
            />
          ))}
        </Menu>
      </div>

      <label
        css={css`
          display: inline-flex;
          align-items: center;
          font-weight: 500;
          font-size: 16px;
          line-height: 22px;
          color: rgba(0, 0, 0, 0.5);
          cursor: pointer;

          input:checked + span {
            background-color: rgb(51, 151, 207);
            border-color: rgb(51, 151, 207);

            svg {
              opacity: 1;
            }
          }
        `}
      >
        <VisuallyHidden
          as="input"
          type="checkbox"
          defaultChecked={field === 'all'}
          onChange={handleChangeField}
          aria-controls="search-results"
        />
        <span
          css={css`
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 18px;
            width: 18px;
            background-color: #fff;
            margin-right: 8px;
            border-radius: 2px;
            border: 2px solid rgba(0, 0, 0, 0.35);
            transition: background-color 0.15s cubic-bezier(0.4, 0, 0.2, 1) 0s,
              border-color;

            svg {
              fill: rgb(255, 255, 255);
              opacity: 0;
              transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1) 0s;
            }
          `}
        >
          <CheckboxIcon />
        </span>
        含內文
      </label>
    </div>
  );
}
