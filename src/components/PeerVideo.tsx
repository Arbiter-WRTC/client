import { useRef, useEffect, useState } from 'react';
import {
  Video,
  VideoWrapper,
  Poster,
  MuteImage,
} from './StyledVideoComponents';

type PeerVideoProps = {
  id: string;
  srcObject: MediaStream;
  audioEnabled: boolean;
  videoEnabled: boolean;
};

const PeerVideo = (props: PeerVideoProps) => {
  const { srcObject, id, audioEnabled, videoEnabled } = props;
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (videoEnabled && srcObject) {
        videoRef.current.srcObject = srcObject;
        videoRef.current.style.display = 'block';
      } else {
        videoRef.current.style.display = 'none';
      }
    }
  }, [srcObject, videoEnabled]);

  return (
    <>
      <VideoWrapper>
        <MuteImage
          className={audioEnabled ? 'hidden' : ''}
          src="./src/assets/ui_muted.png"
          alt="Mute"
        />
        {videoEnabled ? (
          <Video
            ref={videoRef}
            id={id}
            className="video"
            autoPlay
            playsInline
          ></Video>
        ) : (
          <Poster src="./src/assets/ArbiterSymbol.png"></Poster>
        )}
      </VideoWrapper>
    </>
  );
};

export default PeerVideo;
