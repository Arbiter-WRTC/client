import { useRef, useEffect, useState } from 'react';
import muted from './src/assets/ui_muted.png';
import arbiterSymbol from './src/assets/ArbiterSymbol.png';
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
          src={muted}
          alt='Mute'
        />
        {videoEnabled ? (
          <Video
            ref={videoRef}
            id={id}
            className='video'
            autoPlay
            playsInline
          ></Video>
        ) : (
          <Poster src={arbiterSymbol}></Poster>
        )}
      </VideoWrapper>
    </>
  );
};

export default PeerVideo;
