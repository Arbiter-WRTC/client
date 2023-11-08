import React from 'react';
import SelfVideo from './SelfVideo';
import PeerVideo from './PeerVideo';
import {
  VideoGridWrapper,
  VideoGridContainer,
  VideoGridItem,
} from './StyledGridComponents';
import UI from './UI';

const VideoGrid = ({ consumers, clientConnection, isMuted, isCamHidden }) => {
  const consumerCount = consumers.size;
  // const consumerCount = consumers.length;
  let columns = 1;
  let rows = 1;

  const offset = 1;

  if (consumerCount + offset == 1) {
    columns = 1;
    rows = 1;
  } else if (consumerCount + offset == 2) {
    columns = 2;
    rows = 1;
  } else if (consumerCount + offset <= 4) {
    columns = 2;
    rows = 2;
  } else {
    while (columns * rows < consumerCount + offset) {
      if (columns <= rows) {
        columns += 1;
      } else {
        rows += 1;
      }
    }
  }

  return (
    <>
      <VideoGridWrapper>
        <VideoGridContainer
          style={{
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
          }}
        >
          <VideoGridItem key={'self'}>
            <SelfVideo
              srcObject={clientConnection.getMediaStream()}
              isMuted={isMuted}
              isCamHidden={isCamHidden}
            />
          </VideoGridItem>

          {Array.from(consumers).map(([consumerId, consumer]) => (
            <VideoGridItem key={consumerId}>
              <PeerVideo
                srcObject={consumer.mediaStream}
                id={consumerId}
                key={consumerId}
                audioEnabled={consumer.features.audio}
                videoEnabled={consumer.features.video}
              />
            </VideoGridItem>
          ))}
        </VideoGridContainer>
        <UI />
      </VideoGridWrapper>
    </>
  );
};

export default VideoGrid;
