import { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

type SelfVideoProps = {
  srcObject: MediaStream;
  isMuted: boolean;
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
  const { srcObject, isMuted } = props;
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current && srcObject) {
      videoRef.current.srcObject = srcObject;
    }
  }, [srcObject]);

  return (
    <VideoWrapper>
      <MuteImage
        className={isMuted ? '' : 'hidden'}
        src="./src/assets/muted.png"
        alt="Mute"
      />
      <Video
        ref={videoRef}
        id={props.id}
        className="video"
        autoPlay
        playsInline
      ></Video>
    </VideoWrapper>
  );
};

export default SelfVideo;
