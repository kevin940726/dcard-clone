import { useState } from 'react';
import styled, { css } from 'styled-components';
import Image from 'next/image';

function YouTubePlayIcon(props) {
  return (
    <svg
      viewBox="0 0 68 48"
      focusable="false"
      width="68"
      height="68"
      role="img"
      {...props}
    >
      <title>Play</title>
      <path
        fill="#212121"
        fillOpacity="0.8"
        d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"
      ></path>
      <path fill="#fff" d="M45 24L27 14v20"></path>
    </svg>
  );
}

const PlayerContainer = styled.div`
  padding-top: 56.25%;
  position: relative;
  background: #000;
`;

const IFrame = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

function YouTubePlayer({ src, thumbnail, ...props }) {
  const [played, setPlayed] = useState(false);
  const match = src.match(/\?v=([\w-_]+)/);

  if (!match) {
    return null;
  }

  const [, id] = match;

  return (
    <PlayerContainer {...props}>
      {played ? (
        <IFrame
          width="560"
          height="315"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          title="YouTube"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          css={css`
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            height: 100%;
            width: 100%;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          `}
          aria-label="播放"
          onClick={() => setPlayed(true)}
        >
          <Image src={thumbnail} alt="" layout="fill" objectFit="cover" />

          <YouTubePlayIcon
            css={css`
              z-index: 1;
            `}
          />
        </button>
      )}
    </PlayerContainer>
  );
}

function VimeoPlayer({ src, ...props }) {
  const match = src.match(/vimeo.com\/(\d+)/);

  if (!match) {
    return null;
  }

  const [, id] = match;

  return (
    <>
      <PlayerContainer {...props}>
        <IFrame
          title="Vimeo"
          src={`https://player.vimeo.com/video/${id}`}
          frameBorder="0"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      </PlayerContainer>
      <script src="https://player.vimeo.com/api/player.js" />
    </>
  );
}

function HTML5Video({ src, thumbnail, ...props }) {
  let normalizedUrl = src;
  if (normalizedUrl.startsWith('https://www.dcard.tw/v2/vivid/videos/')) {
    const urlObject = new URL(normalizedUrl);
    const videoID = urlObject.pathname.slice('/v2/vivid/videos/'.length);
    normalizedUrl = `https://vivid.dcard.tw/Public/${videoID}/source`;
  }

  return (
    <video
      src={normalizedUrl}
      playsInline
      autoPlay
      controls
      muted
      poster={thumbnail}
      css={css`
        position: relative;
        width: 100%;
        height: 100%;
      `}
    />
  );
}

export default function VideoPlayer({ type, ...props }) {
  switch (type) {
    case 'video/youtube': {
      return <YouTubePlayer {...props} />;
    }
    case 'video/vimeo': {
      return <VimeoPlayer {...props} />;
    }
    case 'video/vivid':
    default:
      return <HTML5Video {...props} />;
  }
}
