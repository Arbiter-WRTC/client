import { Socket } from 'socket.io-client';

type MediaTracks = {
  audio: MediaStreamTrack | undefined;
  video: MediaStreamTrack | undefined;
};

type Features = {
  audio: boolean; 
  video: boolean;
};

interface MediaStreamTrackEventWithTrack extends MediaStreamTrackEvent {
  track: MediaStreamTrackWithKind;
}

interface MediaStreamTrackWithKind extends MediaStreamTrack {
  kind: 'audio' | 'video';
}


class Consumer {
  socket: Socket;

  remotePeerId: String;

  clientId: String;

  connection: RTCPeerConnection;

  isNegotiating: boolean;

  mediaTracks: MediaTracks;

  mediaStream: MediaStream;

  features: Features;

  constructor(socket: Socket, remotePeerId: string, clientId: string, RTC_CONFIG: RTCConfiguration | undefined) {
    this.socket = socket;
    this.remotePeerId = remotePeerId;
    this.clientId = clientId;
    this.connection = new RTCPeerConnection(RTC_CONFIG);
    this.registerConnectionCallbacks();
    this.isNegotiating = false;
    this.mediaTracks = { audio: undefined, video: undefined };
    this.mediaStream = new MediaStream();
    this.features = { audio: false, video: false };
  }

  setFeatures(features: Features) {
    this.features = features;
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

  handleRtcIceCandidate({ candidate }: RTCIceCandidate) { // note: confirm
    if (candidate) {
      this.socket.emit('consumerHandshake', {
        candidate,
        clientId: this.clientId,
        remotePeerId: this.remotePeerId,
      });
    }
  }

  handleRtcPeerTrack({ track }: MediaStreamTrackEventWithTrack) { // note: confirm
    console.log(`handle incoming ${track.kind} track...`);
    this.mediaTracks[track.kind] = track;
    this.mediaStream.addTrack(track);
  }

  handleRtcConnectionStateChange() {
    console.log(`State changed to ${this.connection.connectionState}`);
  }

  async handshake(description: RTCSessionDescription, candidate: RTCIceCandidate) {
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
          `Sending ${this.connection?.localDescription?.type} to ${this.remotePeerId}`
        );
        console.log(
          'attempting to handshake',
          this.clientId,
          this.remotePeerId
        );

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
