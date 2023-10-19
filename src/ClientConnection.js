const RTC_CONFIG = null;

class ClientConnection {
  constructor(socket) {
    this.serverConnection = new RTCPeerConnection(RTC_CONFIG);
    this.socket = socket;
    this.registerConnectionCallbacks();
    this.registerSocketCallbacks();
    this.mediaStream = null;
    this.media = null;
    this.requestUserMedia();

  }


  async requestUserMedia() {
    this.mediaStream = new MediaStream();
    this.media = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
    this.mediaStream.addTrack(this.media.getTracks()[0]);
  }

  addStreamingMedia() {
    const tracks = this.mediaStream.getTacks()
    if (tracks.length === 0) return;

    this.serverConnection.addTrack(tracks[0]);
  }


  registerSocketCallbacks() {
    this.socket.on('producerHandshake', this.handleProducerHandshake.bind(this));
  }
  
  async handleProducerHandshake( { description, candidate } ) {
    if (description) {
      await this.serverConnection.setRemoteDescription(description);
    } else if (candidate) {
      try {
        await this.serverConnection.addIceCandidate(candidate);
      } catch (e) {
        if (candidate.candidate.length > 1) {
          console.log('unable to add ICE candidate for peer', e);
        }
      }
    }
  }
  
  registerConnectionCallbacks() {
    this.serverConnection.onicecandidate = this.handleRtcIceCandidate.bind(this);
    this.serverConnection.onnegotiationneeded = this.handleRtcConnectionNegotiation.bind(this);
    this.serverConnection.onconnectionstatechange =
      this.handleRtcConnectionStateChange.bind(this);
  }

  handleRtcIceCandidate({ candidate }) {
    if (candidate) {
      console.log(
        'attempting to handle an ICE candidate type ',
        candidate.type
      );
      this.socket.emit('producerHandshake', { candidate });
    }
  }

  async handleRtcConnectionNegotiation() {
    console.log('Producer attempting offer ...');
    // SDP from icecandidates
    await this.serverConnection.setLocalDescription();
    this.socket.emit('producerHandshake', {description: this.serverConnection.localDescription});
  }

  handleRtcConnectionStateChange() {
    console.log(`State changed to ${this.connection.connectionState}`);
  }  
} 

export default ClientConnection;