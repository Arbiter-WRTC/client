import { io } from 'socket.io-client';
import { SIGNAL_SERVER_URL } from '../constants';

// console.log('socket: VITE_URL_SIGNAL_SERVER', import.meta.env.VITE_URL_SIGNAL_SERVER) 
console.log('socket signal server url', SIGNAL_SERVER_URL);

// const URL = 'https://signal.noop.live';
// const URL = 'http://localhost:3000';

const URL = SIGNAL_SERVER_URL;

export const socket = io(URL, { autoConnect: false });