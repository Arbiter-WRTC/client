/*

1. connect to ws server
2. rtp handshake

*/

import { useEffect, useState } from 'react';
import { socket } from './socket';
import ClientConnection from './ClientConnection';
import Client from './Client';
import { v4 as uuidv4 } from 'uuid';
import SelfVideo from './components/SelfVideo';
import PeerVideo from './components/PeerVideo';

import './App.css';

function App() {
  const [clientConnection, setClientConnection] = useState(null);
  const [client, setClient] = useState(null);
  const [clientId, setClientId] = useState('');

  const [consumers, setConsumers] = useState(new Map());

  const onDisconnect = () => {
    console.log('Disconnected from WS');
    socket.close();
  };

  const handleConnect = () => {
    if (clientConnection) {
      clientConnection.connect();
    }
  };

  const handleNewConsumer = (clientConsumers) => {
    setConsumers(new Map(clientConsumers));
  };

  useEffect(() => {
    socket.on('disconnect', onDisconnect);
    const id = uuidv4();
    setClientId(id);
    setClientConnection(new ClientConnection(socket, id));
    setClient(new Client(socket, handleNewConsumer));

    socket.on('error', (e) => {
      console.log(e);
    });
    // cleanup to socket server to remove entry from map
  }, []);

  console.log('Client:', clientConnection);
  console.log(consumers);
  return (
    clientConnection && (
      <>
        <button onClick={handleConnect}>Connect</button>
        <button onClick={clientConnection.sendMessage.bind(clientConnection)}>
          Send Message
        </button>
        {console.log(clientConnection.mediaStream)}
        {clientConnection.mediaStream && (
          <SelfVideo srcObject={clientConnection.getMediaStream()} />
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
