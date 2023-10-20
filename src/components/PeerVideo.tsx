import { useRef, useEffect } from 'react';

type PeerVideoProps = {
  srcObject: MediaStream;
  id: string;
};

const PeerVideo = (props: PeerVideoProps) => {
  const { srcObject, id } = props;
  console.log(id);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current && srcObject) {
      videoRef.current.srcObject = srcObject;
    }
  }, [srcObject]);

  return <video ref={videoRef} id="self" autoPlay muted playsInline></video>;
};

export default PeerVideo;
