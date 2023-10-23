const RTC_CONFIG =  null;

class Consumer {
  constructor(socket, remotePeerId, clientId) {
    this.clientId = clientId;
    this.remotePeerId = remotePeerId;
    this.connection = new RTCPeerConnection(null);
    this.registerConnectionCallbacks();
    this.socket = socket;
    this.isNegotiating = false;
    // this.addChatChannel();
    this.mediaTracks = {};
    this.mediaStream = new MediaStream();
  }

  getMediaStream() {
    return this.mediaStream;
  }

  registerConnectionCallbacks() {
    this.connection.onicecandidate = this.handleRtcIceCandidate.bind(this);
    this.connection.ontrack = this.handleRtcPeerTrack.bind(this);
    this.connection.onconnectionstatechange =
      this.handleRtcConnectionStateChange.bind(this);
  }

  handleRtcIceCandidate({ candidate }) {
    // console.log('handling ice candidate');
    if (candidate) {
      // console.log(
      //   'attempting to handle an ICE candidate type ',
      //   candidate.type
      // );
      this.socket.emit('consumerHandshake', {
        candidate,
        clientId: this.clientId,
        remotePeerId: this.remotePeerId,
      });
    }
  }

  handleRtcPeerTrack({ track }) {
    // TODO
    console.log(`handle incoming ${track.kind} track...`);
    this.mediaTracks[track.kind] = track;
    this.mediaStream.addTrack(track);
  }

  handleRtcConnectionStateChange() {
    console.log(`State changed to ${this.connection.connectionState}`);
  }

  async handshake(description, candidate) {
    if (description) {
      console.log('trying to negotiate', description.type);

      if (this.isNegotiating) {
        console.log('Skipping nested negotiations');
        return;
      }

      this.isNegotiating = true;
      await this.connection.setRemoteDescription(description);
      this.isNegotiating = false;

      if (description.type === 'offer') {
        await this.connection.setLocalDescription();

        console.log(
          `Sending ${this.connection.localDescription.type} to ${this.remotePeerId}`
        );
        console.log('attempting to handshake', this.id, this.remotePeerId)

        this.socket.emit('consumerHandshake', {
          description: this.connection.localDescription,
          clientId: this.clientId,
          remotePeerId: this.remotePeerId,
        });
      }
    } else if (candidate) {
      try {
        console.log('Adding an ice candidate');
        await this.connection.addIceCandidate(candidate);
      } catch (e) {
        if (candidate.candidate.length > 1) {
          console.log('unable to add ICE candidate for peer', e);
        }
      }
    }
  }
}

class Client {
  constructor(socket, onNewConsumer) {
    console.log('initializing client');
    this.socket = socket;
    this.consumers = new Map();
    this.onNewConsumer = onNewConsumer;
    this.bindSocketEvents();
  }

  bindSocketEvents() {
    this.socket.on(
      'consumerHandshake',
      this.handleConsumerHandshake.bind(this)
    );
  }

  handleConsumerHandshake({ clientId, remotePeerId, description, candidate }) {
    let consumer = this.consumers.get(remotePeerId);
    if (!consumer) {
      console.log('new consumer with id', clientId);
      consumer = new Consumer(this.socket, remotePeerId, clientId);
      this.consumers.set(remotePeerId, consumer);
    }

    consumer.handshake(description, candidate);
    this.onNewConsumer(this.consumers);
  }
}

export default Client;
