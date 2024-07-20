# Pretty Electron Titlebar

<img alt="GitHub Actions Workflow Status" src="https://img.shields.io/github/actions/workflow/status/euclidesdry/electron-electron-pretty-titlebar/titlebar-ci.yml?style=for-the-badge&label=CI">

[![NPM Version (scoped)](https://img.shields.io/npm/v/@euclidesdry/electron-electron-pretty-titlebar?style=for-the-badge&logo=appveyor)](https://www.npmjs.com/package/@euclidesdry/electron-electron-pretty-titlebar)
![npm](https://img.shields.io/npm/dm/@euclidesdry/electron-electron-pretty-titlebar?style=for-the-badge)
![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=for-the-badge&logo=appveyor)
[![GitHub license](https://img.shields.io/github/license/euclidesdry/electron-electron-pretty-titlebar?style=for-the-badge)](https://github.com/euclidesdry/electron-electron-pretty-titlebar/blob/main/LICENSE)

A pretty way to add Titlebar in a Electron app using ReactJS

## Installation

```bash
npm install @euclidesdry/electron-electron-pretty-titlebar
```

Yarn

```bash
yarn add @euclidesdry/electron-electron-pretty-titlebar
```

PNPM

```bash
pnpm install @euclidesdry/electron-electron-pretty-titlebar
```

Set the `frame` property to `false` and `webPreferences.nodeInteraction` to `true` on the `BrowserWindow` Instance inside your `main.(js/ts)` file.

```js
mainWindow = new BrowserWindow({
  width: 1280,
  height: 840,
  frame: false, // <- Add this line
  webPreferences: {
    nodeIntegration: true, // <- Add this line too
  },
});
```

Set the `setup` and `attachToWindow` built-in `main.(js/ts)` file as the following:

```js
import { setup, attachToWindow } from '@euclidesdry/electron-electron-pretty-titlebar/config';
import { BrowserWindow, ipcMain } from 'electron';

let mainWindow: BrowserWindow | null;

setup(); // <- Add this line

async function createWindow(): Promise<void> {
 // Create the browser window.
 mainWindow = new BrowserWindow({
  width: 1280,
  height: 840,
  frame: false,
  webPreferences: {
   nodeIntegration: true, // <- Add this line also
  },
 });

 mainWindow.on('closed', function () {
  mainWindow = null;
 });

 attachToWindow(ipcMain, mainWindow);  // <- Add this line too

 ...
}
```

For window buttons actions to be enabled, you need to add the `preloadConfig` into built-in `preload.(js/ts)` project file as the following:

```js
import { preloadConfig } from '@euclidesdry/electron-electron-pretty-titlebar/config'; // <- Add this line

preloadConfig(); // <- Add this line
```

## Instructions (How to use)

App to your App.(tsx/jsx) file:

```jsx
import React from 'react';

import { Titlebar } from '@euclidesdry/electron-electron-pretty-titlebar';

export default function App() {
  return <Titlebar title='Hello World' logo={logoPathOrURL} />;
}
```

You can check the example of this configuration here: [Implementation Example](https://github.com/euclidesdry/electron-electron-pretty-titlebar/tree/main/apps/example)

If you want to add your own custom window triggers then do the following:

```jsx
import React from 'react';
import electronEnabled from 'is-electron';

import { Titlebar } from '@euclidesdry/electron-electron-pretty-titlebar';

const requiredModule = electronEnabled() ? 'electron' : 'is-electron';
const { ipcRenderer } = window.require ? window.require(requiredModule) : false;

const ipc = ipcRenderer;

export default function App() {
    const handleVerifyIfWindowIsMaximized = async (size: number[] = []) => {
        if (ipcRenderer) {
            const response_ = await ipcRenderer.invoke('windowsIsMaximized');
            setAppIsMaximized(!!response_);
            return await response_;
        }
    };

    useLayoutEffect(() => {
        if (ipcRenderer) {
            const updateSize = async () => {
                setSize([window.innerWidth, window.innerHeight]);

                const body = document.querySelector('body') as HTMLBodyElement;
                body.style.width = window.innerWidth.toString();
                handleVerifyIfWindowIsMaximized(size);
            };
            window.addEventListener('resize', updateSize);
            updateSize();
            return () => window.removeEventListener('resize', updateSize);
        }
    }, []);

    const handleMinimizeApp = () => {
        if (ipc) ipc.send('minimizeApp');
    };

    const handleMaximizeRestoreApp = async () => {
        if (ipc) ipc.send('maximizeRestoreApp');

        handleVerifyIfWindowIsMaximized();
    };

    const handleCloseApp = () => {
    if (ipc) ipc.send('closeApp');
    };

    return (
        <Titlebar
        title='Hello World'
        logo={logoPathOrURL}
        onClose={handleCloseApp}
        onMinus={handleMinimizeApp}
        onMinimazeMaximaze={handleMaximizeRestoreApp}
        />
    );
}
```
