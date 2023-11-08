import styled, { keyframes } from 'styled-components';

const breatheAnimation = keyframes`
  0% { transform: scale(1) }
  30% { transform: scale(1.2) }
  40% { transform: scale(1.23) }
  100% { transform: scale(1) }
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => props['data-width'] || '40px'};
  height: ${(props) => props['data-height'] || '40px'};
  background-color: ${(props) => props['data-bg-color'] || '#1a1a1a'};
  position: relative;
  outline: none;
  border: 0;
  border-radius: ${(props) =>
    props['data-circle'] === 'true' ? '50%' : '20px'};
  &.toggled {
    background-color: ${(props) => props['data-toggled-bg-color'] || 'red'};
  }
  &:focus {
    outline: none;
  }
  &:hover {
    cursor: pointer;
    outline: none;
    border: 0;
    animation: ${breatheAnimation} 0.5s;
  }
`;

const ToggleImage = styled.img`
  width: ${(props) => props['data-width'] || '22px'};
  height: ${(props) => props['data-height'] || '22px'};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s; /* Add a transition for smoother effects */
`;

const ToggledOffImage = styled(ToggleImage)`
  opacity: ${(props) => (props['data-is-toggled'] === 'true' ? '0' : '1')};

  ${ToggleButton}:active & {
    opacity: ${(props) => (props['data-is-toggled'] === 'true' ? '1' : '0')};
  }
`;

const ToggledOnImage = styled(ToggleImage)`
  opacity: ${(props) => (props['data-is-toggled'] === 'true' ? '1' : '0')};

  ${ToggleButton}:active & {
    opacity: ${(props) => (props['data-is-toggled'] === 'true' ? '0' : '1')};
  }
`;

export { ToggleButton, ToggleImage, ToggledOffImage, ToggledOnImage };
