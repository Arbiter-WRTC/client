import { useEffect, useRef, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import styled from 'styled-components';

const StyledChat = styled(animated.aside)`
  width: ${(props) =>
    props['data-visible'] ? '400px' : '0'}; /* Adjust the width */
  border: ${(props) =>
    props['data-visible'] ? '2px solid #888' : 'none'}; /* Adjust the width */
  max-width: 80vw;
  height: 60vh;
  background-color: white;
  position: relative;
  display: flex;
  flex-direction: column;
  top: 0;
  right: 0;
  overflow-x: hidden;
  margin-left: 30px;
  border-radius: 10px;
  padding-bottom: 5px;
`;

const ChatMessage = styled.li``;

const Chat = ({ chatLog, isChatShown, onSendChatMessage }) => {
  const chatLogRef = useRef(null);
  const [chatInput, setChatInput] = useState('');

  const [style, set] = useSpring(() => ({
    width: isChatShown ? '400px' : '0',
  }));

  useEffect(() => {
    set({ width: isChatShown ? '400px' : '0' });
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [isChatShown, set, chatLog]);

  const handleSendChatMessage = (event) => {
    event.preventDefault();
    console.log('Sending chat message', chatInput);
    onSendChatMessage(chatInput);
    setChatInput('');
  };

  const handleInputChange = (event) => {
    setChatInput(event.target.value);
  };

  return (
    <>
      <StyledChat style={style} data-visible={isChatShown}>
        <ol id="chat-log" ref={chatLogRef}>
          {chatLog.map((message, idx) => (
            <ChatMessage className={message.sender} key={idx}>
              {message.content}
            </ChatMessage>
          ))}
        </ol>
        <form id="chat-form" action="#null" onSubmit={handleSendChatMessage}>
          <input
            type="text"
            id="chat-msg"
            name="chat-msg"
            autoComplete="off"
            value={chatInput}
            onChange={handleInputChange}
          />
          <button type="submit" id="chat-btn">
            <img src="./src/assets/send.png"></img>
          </button>
        </form>
      </StyledChat>
    </>
  );
};

export default Chat;
