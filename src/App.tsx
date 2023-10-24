/*
Refactor Todos;

remove client.producer references
Client needs a Type?
*/

import { useEffect, useState } from 'react';
import Client from './services/Client';
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

//  console.log('MODE', import.meta.env.MODE);
//  console.log('BASE_URL', import.meta.env.BASE_URL);
//  console.log('PROD', import.meta.env.PROD);
//  console.log('DEV', import.meta.env.DEV);
//  console.log('SSR', import.meta.env.SSR);
//  let localSignalServer = import.meta.env.VITE_URL_SIGNAL_SERVER
//  if (localSignalServer) {
//    console.log('localSignalServer', localSignalServer) 
//  } else {
//   console.log('localSignaserver not foundmv')
//  }
//  console.log('VITE_URL_SIGNAL_SERVER', import.meta.env.VITE_URL_SIGNAL_SERVER) 
// console.log('TEST_URL', import.meta.env.TEST_URL) // undefined

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
