import { socket } from './socket';
import { v4 as uuidv4 } from 'uuid';
import Consumer from './Consumer';
import Producer from './Producer';
import { RTC_CONFIG } from '../constants';

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
  socket: typeof socket;
  producer: Producer;
  consumers: Map<string, Consumer>;

  onUpdateConsumers: (consumers: Map<string, Consumer>) => void;

  constructor(onUpdateConsumers: (consumers: Map<string, Consumer>) => void) {
    this.id = uuidv4();
    console.log(`%cI AM CLIENT ${this.id}`, 'color: green');
    this.socket = null;
    this.producer = new Producer(
      this.socket,
      this.id,
      RTC_CONFIG,
      this.updateFeatures.bind(this)
    );
    this.consumers = new Map();
    this.onUpdateConsumers = onUpdateConsumers;
  }

  createWebSocket() {
    this.socket = new WebSocket('wss://rufdlv7k6k.execute-api.us-east-2.amazonaws.com/production');
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
        console.log("invalid handshake type");
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

  // dev only
  connect() {
    this.socket.connect();
  }

  // dev only?
  disconnect() {
    console.log('client.diconnect() invoked');
    this.socket.close();
  }

  // dev only
  sendMessage() {
    this.producer.sendMessage();
  }

  bindSocketEvents() {
    // this.socket.on(
    //   'consumerHandshake',
    //   this.handleConsumerHandshake.bind(this)
    // );

    // socket.on('error', (e) => {
    //   console.log(e);
    // });

    // socket.on('disconnect', this.disconnect);

    // socket.on('clientDisconnect', (data) => {
    //   const { clientId } = data;
    //   console.log('Client disconnected:');
    //   console.log(this.consumers);
    //   console.log(data);
    //   this.consumers.delete(clientId);
    //   this.onUpdateConsumers(this.consumers);
    // });
  }

  createNewConsumer(clientId: string, remotePeerId: string) {
    console.log('%c!!!!!!!!CREATING NEW CONSUMER!!!!!!!!!!!!', 'color:red');
    const consumer = new Consumer(
      clientId,
      remotePeerId,
      this.socket,
      RTC_CONFIG
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
