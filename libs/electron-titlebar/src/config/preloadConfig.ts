/* eslint-disable @typescript-eslint/no-var-requires */
/**
 *  @description adds preload configurations on preload.(js,ts) electron built-in file
 *  @requires you to set `nodeIntegration: true` in main BrowserWindow
 */
export default function preloadConfig() {
  if ('electron' in window) return;

  const { contextBridge } = require('electron');
  const { electronAPI } = require('@electron-toolkit/preload');

  // Custom APIs for renderer
  const api = {};

  if (process.contextIsolated) {
    try {
      contextBridge.exposeInMainWorld('electron', electronAPI);
      contextBridge.exposeInMainWorld('versions', {
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
