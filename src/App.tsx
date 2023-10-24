/*
Refactor Todos;

remove client.producer references
Client needs a Type?
*/

import { useEffect, useState } from 'react';
import Client from './Client';
import SelfVideo from './components/SelfVideo';
import PeerVideo from './components/PeerVideo';
import './App.css';

function App() {
  const [client, setClient] = useState(null);

  const [consumers, setConsumers] = useState(new Map());

  const handleNewConsumer = (clientConsumers) => {
    setConsumers(new Map(clientConsumers));
  };

  useEffect(() => {
    setClient(new Client(handleNewConsumer));
    // cleanup to socket server to remove entry from map
  }, []);

  return (
    client &&  ( 
      <>
        <button onClick={client.connect.bind(client)}>Connect</button>
        <button onClick={client.sendMessage.bind(client)}>
          Send Message
        </button>
        {console.log(client.producer.mediaStream)}
        {client.producer.mediaStream && (
          <SelfVideo srcObject={client.producer.getMediaStream()} />
        )}
        {Array.from(consumers).map(([consumerId, consumer]) => (
          <PeerVideo
            srcObject={consumer.mediaStream}
            id={consumerId}
            key={consumerId}
          />
        ))}
      </>
    )
  );
}

export default App;
