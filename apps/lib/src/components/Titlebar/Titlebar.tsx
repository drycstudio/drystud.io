import React from 'react';
import { FiMinus, FiSquare, FiX, FiCopy } from 'react-icons/fi';
import isElectronProject from 'is-electron';

import { globalStyles } from '~/styles/global';
import titlebarLogo from '~/assets/icon/logo/electron-pretty-titlebar-logo.svg';

import { ActionButton } from '../ActionButton';
import { ButtonContainer, actionButtonIconStyle } from '../ActionButton/styles';

import { Logo, LogoImage, Menu, Text, Title, TitlebarContainer } from './styles';

const ipcRenderer = window.electron.ipcRenderer;

const isElectron = isElectronProject();

export type TitlebarProps = {
  title?: string | null;
  logo?: string;
  size?: 'default' | 'small';
  onMinus?: () => void;
  onMinimizeMaximaze?: () => void;
  onClose?: () => void;
};

export type TitlebarComponentsProps = Pick<TitlebarProps, 'title'> & {
  isWindowMaximized: boolean;
  handleMinimazeMaximaze(): Promise<void>;
  handleMinus(): void;
  handleClose(): void;
};

function TitlebarComponents({
  title,
  isWindowMaximized,
  handleMinimazeMaximaze,
  handleMinus,
  handleClose,
}: TitlebarComponentsProps) {
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

export default function Titlebar({
  title = 'Pretty Titlebar',
  logo,
  size = 'default',
  onClose,
  onMinus,
  onMinimizeMaximaze,
}: TitlebarProps) {
  globalStyles();

  console.log('SUPALOG: --isElectron: ', isElectron, ' --ipcRenderer: ', ipcRenderer);

  const [isWindowMaximized, setIsWindowMaximized] = React.useState<boolean>(false);

  const LOGO = logo || titlebarLogo;

  const handleVerifyIfWindowIsMaximized = async () => {
    if (!ipcRenderer) return;

    const response_ = await ipcRenderer.invoke('windowsIsMaximized');
    setIsWindowMaximized(!!response_);
    return response_;
  };

  React.useLayoutEffect(() => {
    if (!ipcRenderer) return;

    const updateSize = async () => {
      const body = document.querySelector('body') as HTMLBodyElement;
      body.style.width = window.innerWidth.toString();
      await handleVerifyIfWindowIsMaximized();
    };

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleMinimizeApp = () => {
    if (ipcRenderer) ipcRenderer.send('minimizeWindow');
  };

  const handleMaximizeRestoreApp = React.useCallback(async () => {
    if (ipcRenderer) ipcRenderer.send('maximizeRestoreWindow');
    await handleVerifyIfWindowIsMaximized();
  }, []);

  const handleCloseApp = () => {
    if (ipcRenderer) ipcRenderer.send('closeWindow');
  };

  const handleMinus = React.useCallback(() => {
    if (onMinus) onMinus();
    else handleMinimizeApp();

    console.log('onMinus:TitlebarEvent::');
  }, [onMinus]);

  const handleMinimazeMaximaze = React.useCallback(async () => {
    if (onMinimizeMaximaze) onMinimizeMaximaze();
    else await handleMaximizeRestoreApp();

    console.log('onMinimizeMaximaze:TitlebarEvent::');
  }, [handleMaximizeRestoreApp, onMinimizeMaximaze]);

  const handleClose = React.useCallback(() => {
    if (onClose) onClose();
    else handleCloseApp();

    console.log('onClose:TitlebarEvent::');
  }, [onClose]);

  React.useEffect(() => {
    if (!isElectron) {
      console.warn(
        '!Titlebar Alert!: Please Add Electron Button Handler functions manually because this is not an ElectronJS Application!'
      );
    }

    if (ipcRenderer) {
      console.warn('!Titlebar Alert!: Please Add the preload configuration on your app preload.(js/ts) file.');
    }
  }, []);

  return (
    <TitlebarContainer size={size}>
      <Logo>
        <LogoImage src={LOGO as unknown as string} alt='Electron Pretty Titlebar Logo' />
      </Logo>

      <TitlebarComponents
        title={title}
        isWindowMaximized={isWindowMaximized}
        handleMinimazeMaximaze={handleMinimazeMaximaze}
        handleMinus={handleMinus}
        handleClose={handleClose}
      />
    </TitlebarContainer>
  );
}
