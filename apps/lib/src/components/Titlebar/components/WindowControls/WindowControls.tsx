import { TitlebarProps } from '~/components/Titlebar';

import { FiCopy, FiMinus, FiSquare, FiX } from 'react-icons/fi';

import { ActionButton } from '../ActionButton';
import { ButtonContainer, actionButtonIconStyle } from '../ActionButton/styles';
import { Menu, Text, Title } from './styles';

export type WindowControlsProps = Pick<TitlebarProps, 'title'> & {
  isWindowMaximized: boolean;
  handleMinimazeMaximaze(): Promise<void>;
  handleMinus(): void;
  handleClose(): void;
};

export function WindowControls({
  title,
  isWindowMaximized,
  handleMinimazeMaximaze,
  handleMinus,
  handleClose,
}: WindowControlsProps) {
  return (
    <>
      <Menu key={0} />

      <Title key={1}>
        <Text>{title}</Text>
      </Title>

      <ButtonContainer key={2}>
        <ActionButton
          onClick={() => {
            handleMinus();
          }}>
          <FiMinus className={actionButtonIconStyle()} />
        </ActionButton>
        <ActionButton
          onClick={() => {
            handleMinimazeMaximaze();
          }}>
          {isWindowMaximized ? (
            <FiCopy
              className={actionButtonIconStyle()}
              style={{ transform: 'scaleX(-1)' }}
              data-testid='action-button-minimize'
            />
          ) : (
            <FiSquare className={actionButtonIconStyle()} data-testid='action-button-maximize' />
          )}
        </ActionButton>
        <ActionButton
          type='close'
          onClick={() => {
            handleClose();
          }}>
          <FiX className={actionButtonIconStyle()} />
        </ActionButton>
      </ButtonContainer>
    </>
  );
}
