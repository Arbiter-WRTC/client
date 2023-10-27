import { io } from 'socket.io-client';
import { SIGNAL_SERVER_URL } from '../constants';

console.log('socket signal server url', SIGNAL_SERVER_URL);

export const socket = io(SIGNAL_SERVER_URL, { autoConnect: false });