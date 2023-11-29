import styled from 'styled-components';

const VideoGridWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start:
  align-items: center;
  height: 100%;
`;

const VideoGridContainer = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: 1fr;
  width: 90vh;
  max-height: 90vh;
  overflow: hidden;
`;

const VideoGridItem = styled.div`
  position: relative;
  width: 100%;
  height: 0px;
  padding-bottom: 56.25%;
  overflow: hidden;
  background: #ccc;
  border: 2px solid #ccc;
  border-radius: 10px;
`;

export { VideoGridWrapper, VideoGridContainer, VideoGridItem };
