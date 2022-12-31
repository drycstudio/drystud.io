// import { contextBridge } from 'electron';
/**
 *  should set `nodeIntegration: true` in BrowserWindow
 */
export default async function preloadConfig() {
	const { contextBridge, ipcRenderer } = await import('electron');

	contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer);

	contextBridge.exposeInMainWorld('versions', {
		chrome: process.versions.chrome,
		node: process.versions.node,
		electron: process.versions.electron,
	});
}
