import type { TitlebarProps } from '~/components/Titlebar';

import { FiCopy, FiMinus, FiSquare, FiX } from 'react-icons/fi';

import { ActionButton } from '../ActionButton';
import { ButtonContainer, actionButtonIconStyle } from '../ActionButton/styles';
import { Menu as MenuPlaceholder, Text, Title } from './styles';
import { Menu } from '../Menu';
import { UserProfile } from '../UserProfile';
import { SearchBar } from '../SearchBar';
import { ToolbarActions } from '../ToolbarActions';

type WindowControlsBaseProps = Pick<TitlebarProps, 'title' | 'menuItems' | 'platform' | 'user' | 'userActions' | 'onSignIn' | 'onSignOut' | 'commandPalette' | 'actions' | 'renderActions'>;

type WindowControlsWithButtons = WindowControlsBaseProps & {
  macOnly?: false;
  isWindowMaximized: boolean;
  handleMinimazeMaximaze(): Promise<void>;
  handleMinus(): void;
  handleClose(): void;
};

type WindowControlsMacOnly = WindowControlsBaseProps & {
  macOnly: true;
  isWindowMaximized?: never;
  handleMinimazeMaximaze?: never;
  handleMinus?: never;
  handleClose?: never;
};

export type WindowControlsProps = WindowControlsWithButtons | WindowControlsMacOnly;

export function WindowControls(props: WindowControlsProps) {
  const { title, menuItems, macOnly, platform, user, userActions, onSignIn, onSignOut, commandPalette, actions, renderActions } = props;

  const showSearch = commandPalette !== undefined;

  if (macOnly) {
    return (
      <>
        {menuItems?.length ? <Menu items={menuItems} platform={platform} /> : null}
        {showSearch ? (
          <SearchBar
            {...commandPalette}
            platform={platform}
            centered
          />
        ) : (
          <Title />
        )}
        <ToolbarActions actions={actions} renderActions={renderActions} />
        <UserProfile user={user} actions={userActions} onSignIn={onSignIn} onSignOut={onSignOut} />
      </>
    );
  }

  const { isWindowMaximized, handleMinimazeMaximaze, handleMinus, handleClose } = props;

  return (
    <>
      {menuItems?.length ? <Menu items={menuItems} platform={platform} /> : <MenuPlaceholder />}

      <Title>
        <Text>{title}</Text>
      </Title>

      {showSearch && (
        <SearchBar
          {...commandPalette}
          platform={platform}
        />
      )}

      <ToolbarActions actions={actions} renderActions={renderActions} />
      <UserProfile user={user} actions={userActions} onSignIn={onSignIn} onSignOut={onSignOut} />

      <ButtonContainer role="group" aria-label="Window controls">
        <ActionButton
          aria-label="Minimize"
          onClick={() => {
            handleMinus();
          }}>
          <FiMinus className={actionButtonIconStyle()} />
        </ActionButton>
        <ActionButton
          aria-label={isWindowMaximized ? 'Restore' : 'Maximize'}
          onClick={() => {
            void handleMinimazeMaximaze();
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
          aria-label="Close"
          onClick={() => {
            handleClose();
          }}>
          <FiX className={actionButtonIconStyle()} />
        </ActionButton>
      </ButtonContainer>
    </>
  );
}
