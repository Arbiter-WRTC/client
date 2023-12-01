import styled from 'styled-components';

const UIWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const UITogglesWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -20px;
`;

const VideoGridWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start:
  align-items: center;
  height: 100%;
`;

const RTCComponentsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 30px 10px 30px 10px;
  max-height: 100vh;
  position: relative; /* Change this to relative */
  width: 70%;
  border: 2px solid #888;
  border-radius: 10px;
  background-color: #1a1a1a;
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

export {
  UIWrapper,
  UITogglesWrapper,
  RTCComponentsWrapper,
  VideoGridWrapper,
  VideoGridContainer,
  VideoGridItem,
};
