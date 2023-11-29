import { useRef, useEffect, useState } from 'react';
import {
  Video,
  VideoWrapper,
  Poster,
  MuteImage,
} from './StyledVideoComponents';

type SelfVideoProps = {
  id: string;
  srcObject: MediaStream;
  isMuted: boolean;
  isCamHidden: true;
};

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
        src="./src/assets/ui_muted.png"
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
        <Poster src="./src/assets/ArbiterSymbol.png"></Poster>
      )}
    </VideoWrapper>
  );
};

export default SelfVideo;
