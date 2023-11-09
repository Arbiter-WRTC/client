import { socket } from './socket';
import { v4 as uuidv4 } from 'uuid';
import Consumer from './Consumer';
import Producer from './Producer';
import { RTC_CONFIG, SIGNAL_SERVER_URL } from '../constants';

// type HandshakeProps = {
//   receiver: string;
//   remotePeerId: string;
//   description: RTCSessionDescription;
//   candidate: RTCIceCandidate;
// };

type HandshakeData = {
  sender: string;
  receiver: string;
  remotePeerId: string;
  description: RTCSessionDescription;
  candidate: RTCIceCandidate;
};

class Client {
  id: string;
  roomId: string;
  socket: typeof socket;
  producer: Producer;
  consumers: Map<string, Consumer>;

  onUpdateConsumers: (consumers: Map<string, Consumer>) => void;

  constructor(
    onUpdateConsumers: (consumers: Map<string, Consumer>) => void,
    onNewChatMessage: (messages: Array<Object>) => void,
  ) {
    this.id = uuidv4();
    console.log(`%cI AM CLIENT ${this.id}`, 'color: green');
    this.socket = null;
    this.producer = new Producer(
      this.socket,
      this.id,
      RTC_CONFIG,
      this.updateFeatures.bind(this),
      onNewChatMessage.bind(this),
    );
    this.consumers = new Map();
    this.onUpdateConsumers = onUpdateConsumers;
    this.roomId = '';
  }

  createWebSocket() {
    this.socket = new WebSocket(SIGNAL_SERVER_URL);
    this.registerSocketCallbacks();
    this.producer.registerSocket(this.socket);
  }

  registerSocketCallbacks() {
    this.socket.addEventListener('message', this.handleMessage.bind(this));
  }

  handleMessage(e) {
    const data = JSON.parse(e.data);
    console.log('Got a message:', data);

    switch (data.type) {
      case 'producer':
        this.producer.handleProducerHandshake(data);
        break;
      case 'consumer':
        this.handleConsumerHandshake(data);
        break;
      default:
        console.log('invalid handshake type');
        break;
    }
  }

  updateFeatures(
    remotePeerId: string,
    features: { audio: boolean; video: boolean }
  ) {
    let consumer = this.consumers.get(remotePeerId);

    // The features are sometimes shared before a consumer exists for this id
    // because consumer handshake hasn't made it here yet
    if (!consumer) {
      consumer = this.createNewConsumer(this.id, remotePeerId);
    }
    consumer.setFeatures(features);

    this.onUpdateConsumers(this.consumers);
  }

  getProducer() {
    return this.producer;
  }

  updateRoomId(roomId: string) {
    console.log('Gonna update roomID on Producer', roomId);
    this.roomId = roomId;
    this.producer.updateRoomId(roomId);
  }

  // dev only
  connect() {
    this.socket.connect();
  }

  // dev only?
  disconnect() {
    console.log('client.diconnect() invoked');
    this.socket.close();
  }

  sendChatMessage(message) {
    this.producer.sendChatMessage(message);
  }

  createNewConsumer(clientId: string, remotePeerId: string) {
    console.log('%c!!!!!!!!CREATING NEW CONSUMER!!!!!!!!!!!!', 'color:red');
    const consumer = new Consumer(
      clientId,
      remotePeerId,
      this.socket,
      RTC_CONFIG,
      this.roomId,
    );
    this.consumers.set(remotePeerId, consumer);
    return consumer;
  }

  handleConsumerHandshake(data: HandshakeData) {
    const { receiver, remotePeerId } = data;
    let consumer = this.consumers.get(remotePeerId);
    if (!consumer) {
      consumer = this.createNewConsumer(receiver, remotePeerId);
    }

    consumer.handshake(data);
    this.onUpdateConsumers(this.consumers);
  }

  toggleMic() {
    this.producer.toggleMic();
  }

  toggleCam() {
    this.producer.toggleCam();
  }
}

export default Client;
