import React from 'react';
import isElectronProject from 'is-electron';
import { ElectronAPI } from '@electron-toolkit/preload';

interface UseTitlebarActionOptions {
  onMinus?: () => void;
  onMinimizeMaximaze?: () => void;
  onClose?: () => void;
  toggleWindowMaximized: React.Dispatch<React.SetStateAction<boolean>>;
}

const isElectron = isElectronProject();

export function useTitlebarActions(
  ipcHandle: ElectronAPI['ipcRenderer'] | null,
  { toggleWindowMaximized, onMinus, onMinimizeMaximaze, onClose }: UseTitlebarActionOptions
) {
  async function handleVerifyIfWindowIsMaximized() {
    if (!ipcHandle) return;

    const response_ = await ipcHandle.invoke('windowsIsMaximized');
    toggleWindowMaximized(!!response_);
    return response_;
  }

  React.useLayoutEffect(() => {
    if (!ipcHandle) return;

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
    if (ipcHandle) ipcHandle.send('minimizeWindow');
  };

  const handleMaximizeRestoreApp = React.useCallback(async () => {
    if (ipcHandle) ipcHandle.send('maximizeRestoreWindow');
    await handleVerifyIfWindowIsMaximized();
  }, []);

  const handleCloseApp = () => {
    if (ipcHandle) ipcHandle.send('closeWindow');
  };

  const handleMinus = React.useCallback(() => {
    if (onMinus) onMinus();
    else handleMinimizeApp();
  }, [onMinus]);

  const handleMinimazeMaximaze = React.useCallback(async () => {
    if (onMinimizeMaximaze) onMinimizeMaximaze();
    else await handleMaximizeRestoreApp();
  }, [handleMaximizeRestoreApp, onMinimizeMaximaze]);

  const handleClose = React.useCallback(() => {
    if (onClose) onClose();
    else handleCloseApp();
  }, [onClose]);

  React.useEffect(() => {
    if (!isElectron) {
      console.warn(
        '!Titlebar Alert!: Please Add Electron Button Handler functions manually because this is not an ElectronJS Application!'
      );
    }

    if (ipcHandle) {
      console.warn('!Titlebar Alert!: Please Add the preload configuration on your app preload.(js/ts) file.');
    }
  }, []);

  return {
    handleMinus,
    handleMinimazeMaximaze,
    handleClose,
  };
}
