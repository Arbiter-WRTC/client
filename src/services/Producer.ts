import { Socket } from 'socket.io-client';
import Consumer from './Consumer';

type MediaTracks = {
  audio: MediaStreamTrack | undefined;
  video: MediaStreamTrack | undefined;
};

type Features = {
  audio: boolean;
  video: boolean;
};

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

class Producer {
  id: string;

  roomId: string;

  connection: RTCPeerConnection;

  socket: Socket;

  media: null | Promise<MediaStream>;

  mediaTracks: MediaTracks;

  mediaStream: MediaStream;

  features: Features;

  featuresChannel: null | RTCDataChannel;

  connected: boolean;

  queuedCandidates: Array<RTCIceCandidate>;

  updateFeatures: (consumers: Map<string, Consumer>) => void;

  onNewChatMessage: (messages: Array<Object>) => void;

  constructor(
    socket: Socket,
    id: string,
    RTC_CONFIG: RTCConfiguration,
    updateFeatures: (consumers: Map<string, Consumer>) => void,
    onNewChatMessage: (messages: Array<Object>) => void
  ) {
    this.id = id;
    this.connection = new RTCPeerConnection(RTC_CONFIG);
    this.socket = socket;
    // this.registerSocketCallbacks();
    this.requestUserMedia();
    this.media = null;
    this.mediaStream = new MediaStream();
    this.mediaTracks = { audio: undefined, video: undefined };
    console.log('Producer constructed');
    this.features = {
      audio: false,
      video: true,
    };
    this.featuresChannel = null;
    this.updateFeatures = updateFeatures;
    this.onNewChatMessage = onNewChatMessage;
    this.connected = false;
    this.roomId = '';

    this.queuedCandidates = [];
    this.roomId = null;
  }

  registerSocket(socket: Socket) {
    this.socket = socket;
    this.registerSocketCallbacks();
  }

  getMediaStream() {
    return this.mediaStream;
  }

  connect() {
    console.log('producer.connect');
    this.socket.open();
  }

  establishCallFeatures() {
    this.registerConnectionCallbacks.call(this);
    this.addChatChannel.call(this);
    this.addStreamingMedia.call(this);
    this.addCallFeatures.call(this);
  }

  async requestUserMedia() {
    console.log('requesting user media');
    this.mediaStream = new MediaStream();
    this.media = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    this.mediaTracks.video = this.media?.getVideoTracks()[0];
    this.mediaTracks.audio = this.media?.getAudioTracks()[0];
    console.log(this.media.getAudioTracks());

    this.mediaTracks.audio.enabled = this.features.audio;
    this.mediaTracks.video.enabled = this.features.video;

    this.mediaStream.addTrack(this.mediaTracks.video);
    this.mediaStream.addTrack(this.mediaTracks.audio);
  }

  addStreamingMedia() {
    console.log('adding streaming media');
    const tracks = this.mediaStream.getTracks();
    if (tracks.length === 0) return;
    console.log(tracks);
    this.connection.addTrack(tracks[0]);
    this.connection.addTrack(tracks[1]);
  }

  registerSocketCallbacks() {
    // this.socket.on(
    //   'producerHandshake',
    //   this.handleProducerHandshake.bind(this)
    // );
    // this.socket.on('connect', this.handleClientConnect.bind(this));
    this.socket.addEventListener('open', this.handleClientConnect.bind(this));
  }

  handleClientConnect() {
    console.log('connecting to signaling server');
    // this.socket.emit('clientConnect', { type: 'client', id: this.id });
    const payload = {
      action: 'identify',
      data: {
        id: this.id,
        roomId: this.roomId,
        type: 'client',
      },
    };
    console.log('Identify payload:', payload);
    this.socket.send(JSON.stringify(payload));

    this.establishCallFeatures.call(this);
    this.connected = true;
  }

  updateRoomId(roomId: string) {
    console.log('Producer updating roomId');
    this.roomId = roomId;
  }

  modifyIceAttributes(sdp) {
    const iceAttributesRegex = /a=(ice-pwd:|ice-ufrag:)(.*)/gi;
    const modifiedSdp = sdp.replace(
      iceAttributesRegex,
      (match, attribute, value) => {
        // Replace spaces with '+'
        const modifiedValue = value.replace(/ /g, '+');
        return `a=${attribute}${modifiedValue}`;
      }
    );
    return modifiedSdp;
  }

  async handleProducerHandshake(data: HandshakeData) {
    const { description, candidate } = data;
    console.log('Got a description or candidate');
    if (description) {
      console.log('description:', description);
    } else if (candidate) {
      console.log('candidate:', candidate);
    }

    if (description) {
      console.log('Got a description, setting');
      // description.sdp = this.modifyIceAttributes(description.sdp);
      await this.connection.setRemoteDescription(description);
      this.processQueuedCandidates();
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

  async handleReceivedIceCandidate(candidate: RTCIceCandidate) {
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
        if (candidate && candidate.candidate.length > 1) {
          console.log('unable to add ICE candidate for peer', e);
        }
      }
    }
  }

  registerConnectionCallbacks() {
    this.connection.onicecandidate = this.handleRtcIceCandidate.bind(this);
    this.connection.onnegotiationneeded =
      this.handleRtcConnectionNegotiation.bind(this);
    this.connection.onconnectionstatechange =
      this.handleRtcConnectionStateChange.bind(this);
  }

  handleRtcIceCandidate({ candidate }: RTCIceCandidate) {
    if (candidate) {
      console.log(
        'attempting to handle an ICE candidate type ',
        candidate.type
      );

      console.log('SENDING AS:', this.id);
      const payload = {
        action: 'handshake',
        data: {
          type: 'producer',
          sender: this.id,
          candidate: candidate,
          roomId: this.roomId,
        },
      };

      console.log('Sending an ICE candidate', payload);
      // console.log('NOT Sending an ICE candidate', payload);
      this.socket.send(JSON.stringify(payload));
      // this.socket.emit('producerHandshake', { candidate, clientId: this.id });
    }
  }

  async handleRtcConnectionNegotiation() {
    console.log('Producer attempting offer ...');
    // SDP from icecandidates
    await this.connection.setLocalDescription();
    // this.socket.emit('producerHandshake', {
    //   description: this.connection.localDescription,
    //   clientId: this.id,
    // });

    const payload = {
      action: 'handshake',
      data: {
        type: 'producer',
        sender: this.id,
        description: this.connection.localDescription,
        roomId: this.roomId,
      },
    };

    this.socket.send(JSON.stringify(payload));
  }

  handleRtcConnectionStateChange() {
    console.log(`State changed to ${this.connection.connectionState}`);
  }

  addChatChannel() {
    console.log('trying to add a chat channel');
    this.connection.chatChannel = this.connection.createDataChannel('chat', {
      negotiated: true,
      id: 100,
    });
    const callback = (event) => console.log('got a message', event.data);
    this.connection.chatChannel.onmessage = this.handlePeerChatMessage.bind(this);
  }

  sendChatMessage(message) {
    const payload = {
      id: this.id,
      sender: 'self',
      content: message,
    };
    this.onNewChatMessage(payload);
    if (this.connection.chatChannel.readyState === 'open') {
      this.connection.chatChannel.send(JSON.stringify(payload));
    }
  }

  handlePeerChatMessage(event) {
    const data = JSON.parse(event.data);
    data.sender = 'peer';
    this.onNewChatMessage(data);
  }

  addCallFeatures() {
    this.featuresChannel = this.connection.createDataChannel('features', {
      negotiated: true,
      id: 110,
    });

    this.featuresChannel.onopen = (event) => {
      console.log('Features channel opened.');
      // this.featuresChannel?.send(
      //   JSON.stringify({
      //     id: this.id,
      //     features: this.features,
      //     initialConnect: true,
      //   })
      // );
    };

    this.featuresChannel.onmessage = ({ data }) => {
      console.log('Got a message:', JSON.parse(data));
      const { id, features } = JSON.parse(data);
      this.updateFeatures(id, features);
    };
  }

  toggleMic() {
    const audio = this.mediaTracks.audio;
    this.features.audio = audio.enabled = !audio.enabled;
    console.log('Features in ToggleMic:', this.features);
    // Share features
    if (this.connected) {
      console.log('Sending features:', this.features)
      // this.featuresChannel.send(
      //   JSON.stringify({ id: this.id, features: this.features })
      // );
    }
  }

  toggleCam() {
    const video = this.mediaTracks.video;
    this.features.video = video.enabled = !video.enabled;
    if (this.features.video) {
      this.mediaStream.addTrack(this.mediaTracks.video);
    } else {
      this.mediaStream.removeTrack(this.mediaTracks.video);
    }
    if (this.connected) {
      console.log('Sending features:', this.features);
      // this.featuresChannel.send(
      //   JSON.stringify({ id: this.id, features: this.features })
      // );
    }
    console.log('Features in ToggleCam:', this.features);
    console.log(this.mediaStream);
    console.log(this.mediaTracks);
  }
}

export default Producer;
