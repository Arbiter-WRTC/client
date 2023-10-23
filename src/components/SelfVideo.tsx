import { useRef, useEffect } from 'react';

type SelfVideoProps = {
  srcObject: MediaStream;
};

const SelfVideo = (props: SelfVideoProps) => {
  const { srcObject } = props;
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current && srcObject) {
      videoRef.current.srcObject = srcObject;
    }
  }, [srcObject]);

  return <video ref={videoRef} id="self" className='video' autoPlay muted playsInline></video>;
};

export default SelfVideo;
