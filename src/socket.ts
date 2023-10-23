import { io } from 'socket.io-client';

const URL = 'https://signal.noop.live';

export const socket = io(URL, { autoConnect: false });