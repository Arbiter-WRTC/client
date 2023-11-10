import React, { useState } from 'react';
import SelfVideo from './SelfVideo';
import PeerVideo from './PeerVideo';
import {
  VideoGridWrapper,
  VideoGridContainer,
  VideoGridItem,
} from './StyledGridComponents';
import UI from './UI';
import Chat from './Chat';

import styled from 'styled-components';

const UIWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RTCComponentsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 1px solid blue;
  max-height: 100vh;
  position: relative; /* Change this to relative */
  width: 70%;
`;

const VideoGrid = ({
  consumers,
  clientConnection,
  isMuted,
  isCamHidden,
  chatLog,
  onSendChatMessage,
}) => {
  const [isChatShown, setIsChatShown] = useState(false);
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

  const handleToggleChat = (value) => {
    setIsChatShown(value);
    console.log('toggling chat');
  };

  return (
    <UIWrapper>
      <RTCComponentsWrapper>
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
          <UI onToggleChat={handleToggleChat} />
        </VideoGridWrapper>
        <Chat
          chatLog={chatLog}
          isChatShown={isChatShown}
          onSendChatMessage={onSendChatMessage}
        />
      </RTCComponentsWrapper>
    </UIWrapper>
  );
};

export default VideoGrid;
