import { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

type SelfVideoProps = {
  id: string;
  srcObject: MediaStream;
  isMuted: boolean;
  isCamHidden: true;
};

const Video = styled.video`
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
  object-fit: cover;
  margin: 0; /* Remove any margin */
  padding: 0; /* Remove any padding */
  display: block; /* Ensure block display to avoid inline spacing */
`;

const Poster = styled.img`
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
  object-fit: cover;
  margin: 0; /* Remove any margin */
  padding: 0; /* Remove any padding */
  display: block; /* Ensure block display to avoid inline spacing */
`;

const VideoWrapper = styled.div`
  position: relative;
`;

const MuteImage = styled.img`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 999;
`;

const SelfVideo = (props: SelfVideoProps) => {
  const { id, srcObject, isMuted, isCamHidden } = props;
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (srcObject) {
        videoRef.current.srcObject = srcObject;
        videoRef.current.style.display = 'block';
      } else {
        videoRef.current.style.display = 'none';
      }
    }
  }, [srcObject, isCamHidden]);

  return (
    <VideoWrapper>
      <MuteImage
        className={isMuted ? '' : 'hidden'}
        src="./src/assets/muted.png"
        alt="Mute"
      />
      {!isCamHidden ? (
        <Video
          ref={videoRef}
          id={id}
          className="video"
          autoPlay
          playsInline
          muted
        ></Video>
      ) : (
        <Poster src="./src/assets/poster.svg"></Poster>
      )}
    </VideoWrapper>
  );
};

export default SelfVideo;
