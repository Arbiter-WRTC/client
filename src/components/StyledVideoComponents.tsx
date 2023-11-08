import styled from 'styled-components';

const Video = styled.video`
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
  object-fit: cover;
  margin: 0; /* Remove any margin */
  padding: 0; /* Remove any padding */
  display: block; /* Ensure block display to avoid inline spacing */
`;

const Poster = styled.img`
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
  object-fit: cover;
  margin: 0; /* Remove any margin */
  padding: 0; /* Remove any padding */
  display: block; /* Ensure block display to avoid inline spacing */
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
