/*

1. connect to ws server
2. rtp handshake

*/

import { useEffect, useState } from 'react';
import { socket } from './socket';
import ClientConnection from './ClientConnection';
import { v4 as uuidv4 } from 'uuid';

import './App.css';

function App() {
  const [clientConnection, setClientConnection] = useState(null);
  const [clientId, setClientId] = useState('');

  const onDisconnect = () => {
    console.log('Disconnected from WS');
    socket.close();
  };

  const handleConnect = () => {
    clientConnection.connect();
  };

  useEffect(() => {
    socket.on('disconnect', onDisconnect);
    const id = uuidv4();
    setClientId(id);
    setClientConnection(new ClientConnection(socket, id));

    socket.on('error', (e) => {
      console.log(e);
    });
    // cleanup to socket server to remove entry from map
  }, []);

  console.log('Client:', clientConnection);

  return (
    clientConnection && (
      <>
        <button onClick={handleConnect}>Connect</button>
        <button onClick={clientConnection.sendMessage.bind(clientConnection)}>
          Send Message
        </button>
      </>
    )
  );
}

export default App;
