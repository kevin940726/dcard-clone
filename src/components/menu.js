import { forwardRef } from 'react';
import { css } from 'styled-components';
import {
  useMenuState as useBaseMenuState,
  Menu as BaseMenu,
  MenuButton as BaseMenuButton,
  MenuItem as BaseMenuItem,
  MenuArrow,
} from 'reakit';
import CheckIcon from './check-icon';

function MenuButton({ menu, children, ...props }) {
  return (
    <BaseMenuButton
      {...menu}
      css={css`
        cursor: pointer;
        display: inline-flex;
        align-items: center;
      `}
      {...props}
    >
      {children}
    </BaseMenuButton>
  );
}

const MenuItem = forwardRef(({ menu, isActive, children, ...props }, ref) => {
  return (
    <BaseMenuItem
      {...menu}
      // Both reakit and styled-components use "as" prop, this is a SC API to forward "as" to reakit.
      forwardedAs="a"
      ref={ref}
      css={css`
        display: inline-flex;
        padding: 8px 12px;
        justify-content: space-between;
        align-items: center;
        width: 160px;
        height: 40px;
        cursor: pointer;
        font-weight: 400;
        text-align: left;
        color: ${isActive ? 'rgb(51, 151, 207)' : 'rgba(0, 0, 0, 0.75)'};

        svg {
          fill: ${isActive ? 'rgb(51, 151, 207)' : 'rgba(0, 0, 0, 0.35)'};
        }

        &:focus:not(:focus-visible) {
          outline: none;
        }

        &:hover,
        &:focus {
          background: rgb(242, 243, 244);
        }
      `}
      {...props}
    >
      {children}

      {isActive && (
        <CheckIcon
          width={18}
          height={18}
          css={css`
            flex-shrink: 0;
          `}
        />
      )}
    </BaseMenuItem>
  );
});

function Menu({ menu, children, ...props }) {
  return (
    <BaseMenu
      {...menu}
      css={css`
        filter: drop-shadow(rgba(0, 0, 0, 0.1) 0px 3px 12px);
        background: #fff;
        border-radius: 12px;
        z-index: 8;

        &:focus:not(:focus-visible) {
          outline: none;
        }
      `}
      {...props}
    >
      <div
        css={css`
          transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;

          [data-enter] & {
            opacity: 1;
          }
        `}
      >
        <MenuArrow
          {...menu}
          size={19.8}
          css={css`
            svg {
              fill: #fff;
            }
          `}
        />

        <div
          css={css`
            display: flex;
            flex-direction: column;
            padding: 6px 0;
          `}
        >
          {children}
        </div>
      </div>
    </BaseMenu>
  );
}

function useMenuState(options = {}) {
  return useBaseMenuState({
    animated: 150,
    // orientation: 'vertical',
    ...options,
  });
}

export { useMenuState, MenuButton, MenuItem, Menu };
