import { io } from 'socket.io-client';

// const URL = 'https://signal.noop.live';
const URL = 'http://localhost:3000';

export const socket = io(URL, { autoConnect: false });