import {
  ToggleButton,
  ToggledOffImage,
  ToggledOnImage,
} from './StyledUIComponents';

interface buttonProps {
  onToggleState: () => void;
  isState: boolean;
  offImage: string;
  onImage: string;
  'dataCircle'?: string;
  'data-width'?: string;
  'data-bg-color'?: string;
  'data-toggled-bg-color'?: string;
  className?: string;
}

const UIButton = ({
  onToggleState,
  isState,
  offImage,
  onImage,
  dataCircle,
  dataWidth,
  dataBgColor,
  dataToggledBgColor,
  className,
}: buttonProps) => {
  return (
    <ToggleButton
      onClick={onToggleState}
      data-circle={dataCircle}
      data-width={dataWidth}
      data-bg-color={dataBgColor}
      data-toggled-bg-color={dataToggledBgColor}
      className={className}
    >
      <ToggledOffImage src={offImage} data-is-toggled={isState.toString()} />
      <ToggledOnImage src={onImage} data-is-toggled={isState.toString()} />
    </ToggleButton>
  );
};

export default UIButton;
