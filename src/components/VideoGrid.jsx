import React from 'react';
import styled from 'styled-components';
import SelfVideo from './SelfVideo';
import PeerVideo from './PeerVideo';

const VideoGridWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const VideoGridContainer = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: 1fr;
  max-width: 90vh;
  max-height: 90vh;
  border: 1px solid red;
  overflow: hidden;
`;

const VideoGridItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: #ccc;
  border: 2px solid blue;
  border-radius: 10px;
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
`;

const VideoGrid = ({ consumers, clientConnection, isMuted }) => {
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
          />
        </VideoGridItem>
        {console.log('Consumers:')}
        {Array.from(consumers).map(([consumerId, consumer]) => (
          <VideoGridItem key={consumerId}>
            <PeerVideo
              srcObject={consumer.mediaStream}
              id={consumerId}
              key={consumerId}
              audioEnabled={consumer.features.audio}
            />
          </VideoGridItem>
        ))}
        {/* {consumers.map((consumer, index) => (
          <VideoGridItem key={index}>
            <SelfVideo srcObject={clientConnection.getMediaStream()} />
          </VideoGridItem>
        ))} */}
      </VideoGridContainer>
    </VideoGridWrapper>
  );
};

export default VideoGrid;
