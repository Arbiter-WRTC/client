const RTC_CONFIG =  null;

class Consumer {
  constructor(socket, remotePeerId, clientId) {
    this.socket = socket;
    this.remotePeerId = remotePeerId;
    this.clientId = clientId;
    this.connection = new RTCPeerConnection(null);
    this.registerConnectionCallbacks();
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

export default Consumer;