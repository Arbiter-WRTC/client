import { useState } from 'react';
import styled from 'styled-components';
import { ToggleButton, ToggledOffImage, ToggledOnImage } from './ToggleButton';

const UIWrapper = styled.div`
  position: relative; /* Set the position to relative */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 6px;
  align-items: center;
  padding: 8px;
  background-color: rgba(154, 154, 154, 0.5);
  border-radius: 30px;
  bottom: 2%;
  backdrop-filter: blur(2px);
`;

const UI = ({
  onToggleChat,
  onToggleMic,
  onToggleCam,
  onConnect,
  onDisconnect,
}) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isHidden, setIsHidden] = useState(false);
  const [isChatShown, setIsChatShown] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const toggleMuted = () => {
    setIsMuted(!isMuted);
    onToggleMic();
  };

  const toggleHidden = () => {
    setIsHidden(!isHidden);
    onToggleCam();
  };

  const toggleIsChatShown = () => {
    onToggleChat(!isChatShown);
    setIsChatShown(!isChatShown);
  };

  const toggleIsConnected = () => {
    setIsConnected(!isConnected);
    if (isConnected) {
      onDisconnect();
    } else {
      onConnect();
    }
  };

  return (
    <UIWrapper>
      <ToggleButton onClick={toggleMuted} data-circle="true">
        <ToggledOffImage
          src="./src/assets/mic.png"
          data-is-toggled={isMuted.toString()}
        />
        <ToggledOnImage
          src="./src/assets/ui_muted.png"
          data-is-toggled={isMuted.toString()}
        />
      </ToggleButton>

      <ToggleButton onClick={toggleHidden} data-circle="true">
        <ToggledOffImage
          src="./src/assets/cam.png"
          data-is-toggled={isHidden.toString()}
        />
        <ToggledOnImage
          src="./src/assets/ui_cam_hidden.png"
          data-is-toggled={isHidden.toString()}
        />
      </ToggleButton>

      <ToggleButton onClick={toggleIsChatShown} data-circle="true">
        <ToggledOffImage
          src="./src/assets/chat.png"
          data-is-toggled={isChatShown.toString()}
        />
        <ToggledOnImage
          src="./src/assets/ui_chat_shown.png"
          data-is-toggled={isChatShown.toString()}
        />
      </ToggleButton>

      <ToggleButton
        onClick={toggleIsConnected}
        data-width="70px"
        data-bg-color="#01ce4c"
        data-toggled-bg-color="red"
        className={isConnected ? 'toggled' : ''}
      >
        <ToggledOffImage
          src="./src/assets/connect.png"
          data-is-toggled={isConnected.toString()}
        />
        <ToggledOnImage
          src="./src/assets/disconnect.png"
          data-is-toggled={isConnected.toString()}
        />
      </ToggleButton>
    </UIWrapper>
  );
};

export default UI;
