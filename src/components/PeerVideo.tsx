import { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

type PeerVideoProps = {
  srcObject: MediaStream;
  id: string;
  audioEnabled: boolean;
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

const PeerVideo = (props: PeerVideoProps) => {
  const { srcObject, id, audioEnabled } = props;
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current && srcObject) {
      videoRef.current.srcObject = srcObject;
    }
  }, [srcObject]);

  return (
    <>
      <VideoWrapper>
        <MuteImage
          className={audioEnabled ? 'hidden' : ''}
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
    </>
  );
};

export default PeerVideo;
