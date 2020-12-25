import { memo } from 'react';
import styled from 'styled-components';

const EM_REGEX = /(<em>.+?<\/em>)/;
const EM_CONTENT_REGEX = /<em>(.+?)<\/em>/;

const Em = styled.em`
  color: rgb(51, 151, 207);
  font-style: normal;
`;

function Highlight({ children: text }) {
  const splitted = text.split(EM_REGEX);
  const content = [];

  splitted.forEach((fragment, index) => {
    if (index % 2 === 1) {
      const [, highlighted] = fragment.match(EM_CONTENT_REGEX);
      content.push(<Em key={index}>{highlighted}</Em>);
    } else {
      content.push(fragment);
    }
  });

  return <>{content}</>;
}

export default memo(Highlight);
