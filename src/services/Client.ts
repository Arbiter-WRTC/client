import { socket } from './socket';
import { v4 as uuidv4 } from 'uuid';
import Consumer from './Consumer';
import Producer from './Producer';
import { RTC_CONFIG } from '../constants';

type HandshakeProps = {
  clientId: string;
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
    this.socket = socket;
    this.producer = new Producer(
      this.socket,
      this.id,
      RTC_CONFIG,
      this.updateFeatures.bind(this),
    );
    this.consumers = new Map();
    this.onUpdateConsumers = onUpdateConsumers;
    this.bindSocketEvents();
  }

  updateFeatures(
    remotePeerId: string,
    features: { audio: boolean; video: boolean },
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
    this.socket.on(
      'consumerHandshake',
      this.handleConsumerHandshake.bind(this)
    );

    socket.on('error', (e) => {
      console.log(e);
    });

    socket.on('disconnect', this.disconnect);

    socket.on('clientDisconnect', (data) => {
      const { clientId } = data;
      console.log('Client disconnected:');
      console.log(this.consumers);
      console.log(data);
      this.consumers.delete(clientId);
      this.onUpdateConsumers(this.consumers);
    });
  }

  createNewConsumer(clientId: string, remotePeerId: string) {
    const consumer = new Consumer(
      this.socket,
      remotePeerId,
      clientId,
      RTC_CONFIG,
    );
    this.consumers.set(remotePeerId, consumer);
    return consumer;
  }

  handleConsumerHandshake({
    clientId,
    remotePeerId,
    description,
    candidate,
  }: HandshakeProps) {
    let consumer = this.consumers.get(remotePeerId);
    if (!consumer) {
      consumer = this.createNewConsumer(clientId, remotePeerId);
    }

    consumer.handshake(description, candidate);
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