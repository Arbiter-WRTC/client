const RTC_CONFIG = null;

class ClientConnection {
  constructor(socket, id) {
    this.id = id;
    this.serverConnection = new RTCPeerConnection(RTC_CONFIG);
    this.socket = socket;
    this.registerSocketCallbacks();
    this.requestUserMedia();
    this.mediaStream = new MediaStream();
    this.mediaTracks = {};
  }

  connect() {
    this.socket.open();
  }

  establishCallFeatures() {
    this.registerConnectionCallbacks.call(this);
    this.addChatChannel.call(this);
    this.addStreamingMedia.call(this);
  }

  async requestUserMedia() {
    this.mediaStream = new MediaStream();
    this.media = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    this.mediaTracks.video = this.media.getVideoTracks()[0];
    this.mediaStream.addTrack(this.mediaTracks.video);
    this.addStreamingMedia.bind(this);
  }

  addStreamingMedia() {
    console.log('in add media', this.serverConnection);
    console.log('adding streaming media');
    const tracks = this.mediaStream.getTracks();
    if (tracks.length === 0) return;
    this.serverConnection.addTrack(tracks[0]);
  }

  registerSocketCallbacks() {
    this.socket.on(
      'producerHandshake',
      this.handleProducerHandshake.bind(this)
    );
    this.socket.on('connect', this.handleClientConnect.bind(this));
  }

  handleClientConnect() {
    console.log('connecting to signlaing server');
    this.socket.emit('clientConnect', { type: 'client', id: this.id });
    this.establishCallFeatures.call(this);
  }

  async handleProducerHandshake({ description, candidate }) {
    // console.log(data);
    console.log('Got a description or candidate');
    console.log(description, candidate);
    if (description) {
      console.log('Got a description, setting');
      await this.serverConnection.setRemoteDescription(description);
    } else if (candidate) {
      try {
        console.log('Adding ice candidate from SFU');
        await this.serverConnection.addIceCandidate(candidate);
      } catch (e) {
        if (candidate.candidate.length > 1) {
          console.log('unable to add ICE candidate for peer', e);
        }
      }
    }
  }

  registerConnectionCallbacks() {
    this.serverConnection.onicecandidate =
      this.handleRtcIceCandidate.bind(this);
    this.serverConnection.onnegotiationneeded =
      this.handleRtcConnectionNegotiation.bind(this);
    this.serverConnection.onconnectionstatechange =
      this.handleRtcConnectionStateChange.bind(this);
  }

  handleRtcIceCandidate({ candidate }) {
    if (candidate) {
      console.log(
        'attempting to handle an ICE candidate type ',
        candidate.type
      );
      this.socket.emit('producerHandshake', { candidate, clientId: this.id });
    }
  }

  async handleRtcConnectionNegotiation() {
    console.log('Producer attempting offer ...');
    // SDP from icecandidates
    await this.serverConnection.setLocalDescription();
    this.socket.emit('producerHandshake', {
      description: this.serverConnection.localDescription,
      clientId: this.id,
    });
  }

  handleRtcConnectionStateChange() {
    console.log(`State changed to ${this.serverConnection.connectionState}`);
  }

  addChatChannel() {
    console.log('trying to add a chat channel');
    this.serverConnection.chatChannel = this.serverConnection.createDataChannel(
      'chat',
      {
        negotiated: true,
        id: 100,
      }
    );
    const callback = (event) => console.log('got a message', event.data);
    this.serverConnection.chatChannel.onmessage = callback.bind(this);
  }

  sendMessage() {
    console.log(this.serverConnection.chatChannel.readyState);
    if (this.serverConnection.chatChannel.readyState === 'open') {
      this.serverConnection.chatChannel.send(
        `Hello from the Client: ${this.id}`
      );
    }
  }
}

export default ClientConnection;
