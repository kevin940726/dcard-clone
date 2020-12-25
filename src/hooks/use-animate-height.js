import { useState } from 'react';
import { css } from 'styled-components';

export default function useAnimateHeight(initialHeight = 0) {
  const [scrollHeight, setScrollHeight] = useState(initialHeight);

  function refCallback(node) {
    if (node) {
      setScrollHeight(node.scrollHeight);
    }
  }

  return [
    css`
      height: ${initialHeight}px;

      &[data-enter] {
        height: ${scrollHeight}px;
      }
    `,
    refCallback,
  ];
}
