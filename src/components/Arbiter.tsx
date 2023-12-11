import { useEffect, useState } from 'react';
import Client from '../services/Client';
import VideoGrid from './VideoGrid';
import axios from 'axios';
import { API_STACK_URL } from '../constants';
import bgWhite from './assets/Arbiter_whitebg.png';

const Arbiter = () => {
  const [client, setClient] = useState(null);
  const [consumers, setConsumers] = useState(new Map());
  const [isMuted, setIsMuted] = useState(true);
  const [isCamHidden, setIsCamHidden] = useState(false);
  const [path, setPath] = useState(null);
  const [roomId, setRoomId] = useState(null);

  const [chatLog, setChatLog] = useState([]);

  const handleUpdateConsumers = (clientConsumers) => {
    setConsumers(new Map(clientConsumers));
  };

  const handleNewChatMessage = async (message) => {
    console.log(
      'In Arbiter, updating Chat Messages with a new message:',
      message
    );
    console.log('Setting Chat Messages');
    await setChatLog((prevLog) => [...prevLog, message]);
  };

  useEffect(() => {
    console.log('Chat Messages Updated:', chatLog);
  }, [chatLog]);

  const getRoomId = async () => {
    try {
      console.log('Trying to get room ID:', path);
      const requestURL = `${API_STACK_URL}/getRoomId?urlPath=${path}`;
      const { data } = await axios.get(requestURL);
      console.log(data);
      if (data.id) {
        setRoomId(data.id);
        client.updateRoomId(data.id);
      }
    } catch (e) {
      console.log('here');
      console.log(e);
      const status = e.response.status;

      switch (status) {
        case 400:
          // TODO: Handle 400
          console.log('"?urlPath=" was not supplied');
          break;
        case 404:
          console.log('Room not found');
          break;
        case 500:
          // TODO: Handle 500
          console.log('Something broke on the server');
          break;
      }
      // console.log(e.response.status);
    }
  };

  useEffect(() => {
    setClient(new Client(handleUpdateConsumers, handleNewChatMessage));
    // cleanup to socket server to remove entry from map
  }, []);

  useEffect(() => {
    (async () => {
      const urlPath = window.location.pathname;
      if (!path) {
        await setPath(urlPath);
      }

      if (path && client) {
        getRoomId();
      }
    })();
  }, [client, path]);

  const handleClaimRoom = async () => {
    const body = {
      urlPath: path,
    };

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const url = `${API_STACK_URL}/claimRoom`;
      const response = await axios.patch(url, body, config);
      const { status } = response;
      console.log(response);
      if (status === 200) {
        getRoomId();
      }
    } catch (e) {
      // Handle any errors here
      console.error(e);
      const status = e.response.status;
      switch (status) {
        case 400:
          // TODO: Handle 400
          console.log('"?urlPath=" was not supplied');
          break;
        case 404:
          console.log('Room not found');
          break;
        case 500:
          // TODO: Handle 500
          console.log('Something broke on the server');
          break;
      }
    }
  };

  const handleToggleMic = () => {
    console.log('toggling mic');
    setIsMuted(!isMuted);
    if (client) {
      client.toggleMic();
    }
  };

  const handleToggleCam = () => {
    setIsCamHidden(!isCamHidden);
    if (client) {
      client.toggleCam();
    }
  };

  const handleSendChatMessage = (message) => {
    console.log('In artbier, sending message:', message);
    if (client) {
      client.sendChatMessage(message);
    }
  };

  const handleConnect = () => {
    if (client) {
      client.createWebSocket.call(client);
    }
  };

  return (
    <>
      <img className='logo' src={bgWhite}></img>
      {client && (
        <>
          {roomId ? (
            <>
              {client.producer.mediaStream && (
                <VideoGrid
                  consumers={consumers}
                  clientConnection={client.getProducer()}
                  isMuted={isMuted}
                  isCamHidden={isCamHidden}
                  chatLog={chatLog}
                  onSendChatMessage={handleSendChatMessage}
                  onToggleMic={handleToggleMic}
                  onToggleCam={handleToggleCam}
                  onConnect={handleConnect}
                  onDisconnect={handleDisconnect}
                />
              )}
            </>
          ) : (
            <button onClick={handleClaimRoom}>Create Room</button>
          )}
        </>
      )}
    </>
  );
};

export default Arbiter;
