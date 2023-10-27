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

class Producer {
  id: string;

  serverConnection: RTCPeerConnection;

  socket: Socket;

  media: null | Promise<MediaStream>; 

  mediaTracks: MediaTracks;

  mediaStream: MediaStream;

  features: Features;

  featuresChannel: null | RTCDataChannel;

  updateFeatures: (consumers: Map<string, Consumer>) => void;

  connected: boolean;

  constructor(socket: Socket, id: string, RTC_CONFIG: RTCConfiguration, updateFeatures: (consumers: Map<string, Consumer>) => void) {
    this.id = id;
    this.serverConnection = new RTCPeerConnection(RTC_CONFIG);
    this.socket = socket;
    this.registerSocketCallbacks();
    this.requestUserMedia();
    this.media = null;
    this.mediaStream = new MediaStream();
    this.mediaTracks = { audio: undefined, video: undefined };;
    console.log('Producer constructed');
    this.features = {
      audio: false,
      video: true,
    };
    this.featuresChannel = null;
    this.updateFeatures = updateFeatures;
    this.connected = false;
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
    this.serverConnection.addTrack(tracks[0]);
    this.serverConnection.addTrack(tracks[1]);
  }

  registerSocketCallbacks() {
    this.socket.on(
      'producerHandshake',
      this.handleProducerHandshake.bind(this)
    );
    this.socket.on('connect', this.handleClientConnect.bind(this));
  }

  handleClientConnect() {
    console.log('connecting to signaling server');
    this.socket.emit('clientConnect', { type: 'client', id: this.id });
    this.establishCallFeatures.call(this);
    this.connected = true;
  }

  async handleProducerHandshake({ description, candidate } : { description: RTCSessionDescription; candidate: RTCIceCandidate }) {
    console.log('Got a description or candidate');
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

  handleRtcIceCandidate({ candidate } : RTCIceCandidate) {
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
      },
    );
    const callback = (event) => console.log('got a message', event.data);
    this.serverConnection.chatChannel.onmessage = callback.bind(this);
  }

  addCallFeatures() {
    this.featuresChannel = this.serverConnection.createDataChannel('features', {
      negotiated: true,
      id: 110,
    });

    this.featuresChannel.onopen = (event) => {
      console.log('Features channel opened.');
      this.featuresChannel?.send(
        JSON.stringify({
          id: this.id,
          features: this.features,
          initialConnect: true,
        })
      );
    };

    this.featuresChannel.onmessage = ({ data }) => {
      console.log('Got a message:', JSON.parse(data));
      const { id, features } = JSON.parse(data);
      this.updateFeatures(id, features);
    };
  }

  // for dev only; remove later
  sendMessage() {
    console.log(this.serverConnection.chatChannel.readyState);
    if (this.serverConnection.chatChannel.readyState === 'open') {
      this.serverConnection.chatChannel.send(
        `Hello from the Client: ${this.id}`
      );
    }
  }

  toggleMic() {
    const audio = this.mediaTracks.audio;
    this.features.audio = audio.enabled = !audio.enabled;
    console.log('Features in ToggleMic:', this.features);
    // Share features
    if (this.connected) {
      this.featuresChannel.send(
        JSON.stringify({ id: this.id, features: this.features })
      );
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
      this.featuresChannel.send(
        JSON.stringify({ id: this.id, features: this.features })
      );
    }
    console.log('Features in ToggleCam:', this.features);
    console.log(this.mediaStream);
    console.log(this.mediaTracks);
  }
}

export default Producer;