import { BrowserWindow, IpcMain } from 'electron';

export default function attachToWindow(ipcMain: IpcMain, mainWindow: BrowserWindow) {
  ipcMain.on('minimizeWindow', () => {
    mainWindow?.minimize();
  });

  ipcMain.on('maximizeRestoreWindow', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow?.restore();
    } else {
      mainWindow?.maximize();
    }
  });

  ipcMain.on('closeWindow', () => {
    mainWindow?.close();
  });

  ipcMain.handle('windowsIsMaximized', () => {
    const response = mainWindow?.isMaximized();
    mainWindow?.webContents.send('isMaximized', response);
    return response;
  });
}
