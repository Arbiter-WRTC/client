/*
Refactor Todos;

remove client.producer references
Client needs a Type?
*/

import { useEffect, useState } from 'react';
import Client from '../services/Client';
import VideoGrid from './VideoGrid';
import axios from 'axios';
import { API_STACK_URL } from '../constants';

const Arbiter = () => {
  const [client, setClient] = useState(null);
  const [consumers, setConsumers] = useState(new Map());
  // const [participants, setParticipants] = useState([]);
  const [isMuted, setIsMuted] = useState(true);
  const [isCamHidden, setIsCamHidden] = useState(false);
  const [path, setPath] = useState(null);
  const [roomId, setRoomId] = useState(null);

  const handleUpdateConsumers = (clientConsumers) => {
    setConsumers(new Map(clientConsumers));
  };

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
    setClient(new Client(handleUpdateConsumers));
    // cleanup to socket server to remove entry from map
  }, []);

  useEffect(() => {
    (async () => {
      const urlPath = 'testTy';
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

  const handleAdd = () => {
    setParticipants((prevParticipants) => {
      console.log(prevParticipants);
      const newParticipants = [
        ...prevParticipants,
        `placeholder${prevParticipants.length}`,
      ];
      console.log(newParticipants);
      return newParticipants;
    });
  };

  const handleRemove = () => {
    setParticipants((prevParticipants) => {
      const newParticipants = [...prevParticipants];
      newParticipants.shift();
      return newParticipants;
    });
  };

  const handleToggleMic = () => {
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

  return (
    <>
      <div id="media-toggles">
        <button
          aria-label="Toggle microphone"
          role="switch"
          aria-checked="true"
          type="button"
          id="toggle-mic"
          onClick={handleToggleMic}
        >
          Mic
        </button>
        <button
          aria-label="Toggle camera"
          role="switch"
          aria-checked="true"
          type="button"
          id="toggle-cam"
          onClick={handleToggleCam}
        >
          Cam
        </button>
      </div>
      {client && (
        <>
          {roomId ? (
            <>
              <button onClick={client.createWebSocket.bind(client)}>
                Connect
              </button>
              <button onClick={client.sendMessage.bind(client)}>
                Send Message
              </button>
            </>
          ) : (
            <button onClick={handleClaimRoom}>Create Room</button>
          )}

          <img className="logo" src="./src/assets/Arbiter_whitebg.png"></img>
          {client.producer.mediaStream && (
            <VideoGrid
              consumers={consumers}
              clientConnection={client.getProducer()}
              isMuted={isMuted}
              isCamHidden={isCamHidden}
            />
          )}
        </>
      )}
    </>
  );
};

export default Arbiter;
