import { useState } from 'react';
import UIButtonMute from './UIButtonMute';
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
      {/* <UIButtonMute onToggleMuted={toggleMuted} isMuted={isMuted} /> */}
      {/* <ToggleButton onClick={toggleMuted} data-circle="true">
        <ToggledOffImage
          src="./src/assets/mic.png"
          data-is-toggled={isMuted.toString()}
        />
        <ToggledOnImage
          src="./src/assets/ui_muted.png"
          data-is-toggled={isMuted.toString()}
        />
      </ToggleButton> */}

      <UIButton
        onToggleState={toggleMuted}
        isState={isMuted}
        offImage="./src/assets/mic.png"
        onImage="./src/assets/ui_muted.png"
        dataCircle='true'
      />

      <UIButton
        onToggleState={toggleHidden}
        isState={isHidden}
        offImage="./src/assets/cam.png"
        onImage="./src/assets/ui_cam_hidden.png"
        dataCircle='true'
      />
      
      {/* <ToggleButton onClick={toggleHidden} data-circle="true">
        <ToggledOffImage
          src="./src/assets/cam.png"
          data-is-toggled={isHidden.toString()}
        />
        <ToggledOnImage
          src="./src/assets/ui_cam_hidden.png"
          data-is-toggled={isHidden.toString()}
        />
      </ToggleButton> */}

      <UIButton
        onToggleState={toggleIsChatShown}
        isState={isChatShown}
        offImage="./src/assets/chat.png"
        onImage="./src/assets/ui_chat_shown.png"
        dataCircle='true'
      />

      {/* <ToggleButton onClick={toggleIsChatShown} data-circle="true">
        <ToggledOffImage
          src="./src/assets/chat.png"
          data-is-toggled={isChatShown.toString()}
        />
        <ToggledOnImage
          src="./src/assets/ui_chat_shown.png"
          data-is-toggled={isChatShown.toString()}
        />
      </ToggleButton> */}

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
