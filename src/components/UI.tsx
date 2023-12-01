import { useState } from 'react';
import UIButton from './UIButton';
import {
  UIWrapper,
  ToggleButton,
  ToggledOffImage,
  ToggledOnImage,
} from './StyledUIComponents';

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
      <UIButton
        onToggleState={toggleMuted}
        isState={isMuted}
        offImage="./src/assets/mic.png"
        onImage="./src/assets/ui_muted.png"
        dataCircle="true"
      />

      <UIButton
        onToggleState={toggleHidden}
        isState={isHidden}
        offImage="./src/assets/cam.png"
        onImage="./src/assets/ui_cam_hidden.png"
        dataCircle="true"
      />

      <UIButton
        onToggleState={toggleIsChatShown}
        isState={isChatShown}
        offImage="./src/assets/chat.png"
        onImage="./src/assets/ui_chat_shown.png"
        dataCircle="true"
      />

      <UIButton
        onToggleState={toggleIsConnected}
        isState={isConnected}
        offImage="./src/assets/connect.png"
        onImage="./src/assets/disconnect.png"
        dataWidth="70px"
        dataBgColor="#01ce4c"
        dataToggledBgColor="red"
        className={isConnected ? 'toggled' : ''}
      />
    </UIWrapper>
  );
};

export default UI;
