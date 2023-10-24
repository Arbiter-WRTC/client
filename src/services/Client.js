import { socket } from './socket';
import { v4 as uuidv4 } from 'uuid';
import Consumer from './Consumer';
import Producer from './Producer';
import { RTC_CONFIG } from '../constants';

// const RTC_CONFIG = import.meta.env.VITE_RTC_CONFIG; 
class Client {
  constructor(onNewConsumer) {
    this.id = uuidv4();
    this.socket = socket;
    this.producer = new Producer(this.socket, this.id, RTC_CONFIG);
    this.consumers = new Map();
    this.onNewConsumer = onNewConsumer;
    this.bindSocketEvents();
  }


  // dev only
  connect() {
    this.socket.connect();
  };

  // dev only?
  disconnect() {
    console.log('client.diconnect() invoked')
    this.socket.close();
  };

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
  }

  handleConsumerHandshake({ clientId, remotePeerId, description, candidate }) {
    let consumer = this.consumers.get(remotePeerId);
    if (!consumer) {
      consumer = new Consumer(this.socket, remotePeerId, clientId, RTC_CONFIG);
      this.consumers.set(remotePeerId, consumer);
    }

    consumer.handshake(description, candidate);
    this.onNewConsumer(this.consumers);
  }
}

export default Client;
