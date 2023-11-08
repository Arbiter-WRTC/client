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

type HandshakeData = {
  sender: string;
  receiver: string;
  remotePeerId: string;
  description: RTCSessionDescription;
  candidate: RTCIceCandidate;
};

class Consumer {
  socket: Socket;
  remotePeerId: String;
  clientId: String;
  connection: RTCPeerConnection;
  isNegotiating: boolean;
  mediaTracks: MediaTracks;
  mediaStream: MediaStream;
  features: Features;
  queuedCandidates: Array<RTCIceCandidate>;

  constructor(
    clientId: string,
    remotePeerId: string,
    socket: Socket,
    RTC_CONFIG: RTCConfiguration | undefined
  ) {
    this.clientId = clientId;
    this.remotePeerId = remotePeerId;
    this.socket = socket;
    this.connection = new RTCPeerConnection(RTC_CONFIG);
    this.registerConnectionCallbacks();
    this.isNegotiating = false;
    this.mediaTracks = { audio: undefined, video: undefined };
    this.mediaStream = new MediaStream();
    this.features = { audio: false, video: false };
    this.queuedCandidates = [];
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

  handleRtcIceCandidate({ candidate }: RTCIceCandidate) {
    // note: confirm
    console.log("Received a CANDIDATE IN CONSUMER")
    if (candidate) {
      console.log("PROCESING CONSUMER CANDIDATE TO SEND TO SFU")
      // this.socket.emit('consumerHandshake', {
      //   candidate,
      //   clientId: this.clientId,
      //   remotePeerId: this.remotePeerId,
      // });
      console.log('attempting to handle an ice candidate');
      const payload = {
        action: 'handshake',
        data: {
          type: 'consumer',
          sender: this.clientId,
          remotePeerId: this.remotePeerId,
          candidate: candidate,
        },
      };
      this.socket.send(JSON.stringify(payload));
    }
  }

  handleRtcPeerTrack({ track }: MediaStreamTrackEventWithTrack) {
    // note: confirm
    console.log(`handle incoming ${track.kind} track...`);
    this.mediaTracks[track.kind] = track;
    this.mediaStream.addTrack(track);
  }

  handleRtcConnectionStateChange() {
    console.log(`State changed to ${this.connection.connectionState}`);
  }

  modifyIceAttributes(sdp) {
    const iceAttributesRegex = /a=(ice-pwd:|ice-ufrag:)(.*)/gi;
    const modifiedSdp = sdp.replace(
      iceAttributesRegex,
      (_, attribute, value) => {
        // Replace spaces with '+'
        const modifiedValue = value.replace(/ /g, '+');
        return `a=${attribute}${modifiedValue}`;
      }
    );
    return modifiedSdp;
  }


  async handshake(data: HandshakeData) {
    const { description, candidate } = data;
    if (description) {
      console.log('trying to negotiate', description.type);

      if (this.isNegotiating) {
        console.log('Skipping nested negotiations');
        return;
      }

      this.isNegotiating = true;
      // description.sdp = this.modifyIceAttributes(description.sdp);
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

        // this.socket.emit('consumerHandshake', {
        //   description: this.connection.localDescription,
        //   clientId: this.clientId,
        //   remotePeerId: this.remotePeerId,
        // });
        const payload = {
          action: 'handshake',
          data: {
            type: 'consumer',
            sender: this.clientId,
            remotePeerId: this.remotePeerId,
            description: this.connection.localDescription,
          },
        };
        this.socket.send(JSON.stringify(payload));
        this.processQueuedCandidates();
      }
    } else if (candidate) {
      try {
        this.handleReceivedIceCandidate(candidate);
      } catch (e) {
        if (candidate.candidate.length > 1) {
          console.log('unable to add ICE candidate for peer', e);
        }
      }
    }
  }

  async handleReceivedIceCandidate(candidate) {
    if (this.connection.remoteDescription === null) {
      console.log('Caching candidate');
      this.queuedCandidates.push(candidate);
    } else {
      console.log('Adding an ice candidate');
      await this.connection.addIceCandidate(candidate);
    }
  }

  async processQueuedCandidates() {
    console.log('Processing cached candidates IN PRODUCER');
    while (this.queuedCandidates.length > 0) {
      const candidate = this.queuedCandidates.shift();
      try {
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
