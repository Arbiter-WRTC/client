/*
Refactor Todos;

remove client.producer references
Client needs a Type?
*/

import { useEffect, useState } from 'react';
import Client from './services/Client';
import VideoGrid from './components/VideoGrid';
import './App.css';

function App() {
  const [client, setClient] = useState(null);
  const [consumers, setConsumers] = useState(new Map());
  // const [participants, setParticipants] = useState([]);
  const [isMuted, setIsMuted] = useState(true);
  const [isCamHidden, setIsCamHidden] = useState(false);

  const handleUpdateConsumers = (clientConsumers) => {
    setConsumers(new Map(clientConsumers));
  };

  const handleUpdateFeatures = (id, features) => {
    console.log('Back in APP');
    console.log('Got a features update for:', id);
    console.log('Features:', features);
  };

  useEffect(() => {
    setClient(new Client(handleUpdateConsumers, handleUpdateFeatures));
    // cleanup to socket server to remove entry from map
  }, []);

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
          <button onClick={client.createWebSocket.bind(client)}>Connect</button>
          <button onClick={client.sendMessage.bind(client)}>
            Send Message
          </button>

          <button onClick={handleAdd}>Add</button>
          <button onClick={handleRemove}>Remove</button>
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
}

export default App;

// client && (
//   <>
//     <button onClick={client.connect.bind(client)}>Connect</button>
//     <button onClick={client.sendMessage.bind(client)}>Send Message</button>
//     {console.log(client.producer.mediaStream)}
//     {client.producer.mediaStream && (
//       <SelfVideo srcObject={client.producer.getMediaStream()} />
//     )}

//     {Array.from(consumers).map(([consumerId, consumer]) => (
//       <PeerVideo
//         srcObject={consumer.mediaStream}
//         id={consumerId}
//         key={consumerId}
//       />
//     ))}

//   </>
// )
