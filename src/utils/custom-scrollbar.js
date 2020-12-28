import { css } from 'styled-components';

const customScrollbar = css`
  /* Turn on custom 8x wide scrollbar */
  ::-webkit-scrollbar {
    position: fixed;
    width: 8px;
    background-color: rgba(0, 0, 0, 0);
    border-radius: 100px;
  }
  /* hover effect for both scrollbar area, and scrollbar 'thumb' */
  ::-webkit-scrollbar:hover {
    background-color: rgba(0, 0, 0, 0.09);
  }
  /* The scrollbar 'thumb' ...that marque oval shape in a scrollbar */
  ::-webkit-scrollbar-thumb:vertical {
    background: rgba(0, 0, 0, 0.45);
    border-radius: 100px;
  }
  ::-webkit-scrollbar-thumb:vertical:hover {
    width: 8px;
    background: rgba(0, 0, 0, 0.5);
  }
  ::-webkit-scrollbar-thumb:vertical:active {
    background: rgba(0, 0, 0, 0.61);
  }
`;

export default customScrollbar;
