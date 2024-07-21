import electron from 'electron';
import toolkit from '@electron-toolkit/preload';

/**
 *  @description adds preload configurations on preload.(js,ts) electron built-in file
 *  @requires you to set `nodeIntegration: true` in main BrowserWindow
 */
export default function preloadConfig() {
  if ('electron' in window) return;

  // Custom APIs for renderer
  const api = {};

  if (process.contextIsolated) {
    try {
      electron.contextBridge.exposeInMainWorld('electron', toolkit.electronAPI);
      electron.contextBridge.exposeInMainWorld('versions', {
        chrome: process.versions.chrome,
        node: process.versions.node,
        electron: process.versions.electron,
      });
    } catch (error) {
      console.error('-- Prettier Titlebar :: Preload Config - Error: ', error);
    }
  } else {
    // @ts-expect-error (define in dts)
    window.electron = electronAPI;
    // @ts-expect-error (define in dts)
    window.api = api;
  }
}
