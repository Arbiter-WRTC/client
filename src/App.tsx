/*

1. connect to ws server
2. rtp handshake

*/


import { useEffect, useState } from 'react';
import { socket } from './socket';
import ClientConnection from './ClientConnection';

import './App.css';

function App() {

  const [clientConnection, setClientConnection] = useState(null);

  const onConnect = () =>{
    console.log('Client connected');
    socket.emit('clientConnect', {type: 'client'});   
  }

  useEffect(() => {
    socket.on('connect', onConnect);
    setClientConnection(new ClientConnection(socket));

    socket.on('error', (e) => {
      console.log(e);
    })
    
    return () => {
      socket.off('connect', onConnect)
    }
  }, []);
  return <div></div>;
}

export default App;
