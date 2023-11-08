import styled from 'styled-components';

const VideoGridWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  border: 1px solid green;
`;

const VideoGridContainer = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: 1fr;
  max-width: 90vh;
  max-height: 90vh;
  border: 1px solid red;
  overflow: hidden;
`;

const VideoGridItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: #ccc;
  border: 2px solid blue;
  border-radius: 10px;
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
`;

export { VideoGridWrapper, VideoGridContainer, VideoGridItem };
