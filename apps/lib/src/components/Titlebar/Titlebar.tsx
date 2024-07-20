import React from 'react';

import { globalStyles } from '~/styles/global';
import titlebarLogo from '~/assets/icon/logo/electron-pretty-titlebar-logo.svg';

import { useTitlebarActions } from './hooks/useTitlebarActions';

import { WindowControls } from './components/WindowControls';

import { Logo, LogoImage, TitlebarContainer } from './styles';

const ipcHandle = 'electron' in window ? window.electron.ipcRenderer : null;

export type TitlebarProps = {
  title?: string | null;
  logo?: string;
  size?: 'default' | 'small';
  onMinus?: () => void;
  onMinimizeMaximaze?: () => void;
  onClose?: () => void;
};

export default function Titlebar({
  title = 'Pretty Titlebar',
  logo,
  size = 'default',
  onClose,
  onMinus,
  onMinimizeMaximaze,
}: TitlebarProps) {
  globalStyles();
  const [isWindowMaximized, setIsWindowMaximized] = React.useState<boolean>(false);
  const { handleMinimazeMaximaze, handleMinus, handleClose } = useTitlebarActions(ipcHandle, {
    toggleWindowMaximized: setIsWindowMaximized,
    onMinus,
    onMinimizeMaximaze,
    onClose
  });

  const LOGO = logo || titlebarLogo;

  return (
    <TitlebarContainer size={size}>
      <Logo>
        <LogoImage src={LOGO} alt='Electron Pretty Titlebar Logo' />
      </Logo>

      <WindowControls
        title={title}
        isWindowMaximized={isWindowMaximized}
        handleMinimazeMaximaze={handleMinimazeMaximaze}
        handleMinus={handleMinus}
        handleClose={handleClose}
      />
    </TitlebarContainer>
  );
}
