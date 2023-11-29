import styled from 'styled-components';

const Video = styled.video`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%; /* Adjust as needed */
  height: auto; /* Adjust for maintaining aspect ratio */
  object-fit: cover;
  transform: translate(-50%, -20%); /* Centering the content */
`;

const Poster = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%; /* Adjust as needed */
  height: auto; /* Adjust for maintaining aspect ratio */
  object-fit: cover;
  background-color: #eee;
  transform: translate(-50%, -20%); /* Centering the content */
`;

const VideoWrapper = styled.div`
  position: relative;
`;

const MuteImage = styled.img`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 999;
`;

export { Video, VideoWrapper, Poster, MuteImage };
