export default function preloadConfig() {
	// should set `nodeIntegration: true` in mainWindow
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const { contextBridge, ipcRenderer } = require('electron');

	window.addEventListener('DOMContentLoaded', () => {
		contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer);

		contextBridge.exposeInMainWorld('versions', {
			chrome: process.versions.chrome,
			node: process.versions.node,
			electron: process.versions.electron,
		});
	});
}
