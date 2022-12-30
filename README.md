# Pretty Electron Titlebar

![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=for-the-badge&logo=appveyor)
[![NPM Version (scoped)](https://img.shields.io/npm/v/@euclidesdry/electron-pretty-titlebar?style=for-the-badge&logo=appveyor)](https://www.npmjs.com/package/@euclidesdry/electron-pretty-titlebar)
![npm](https://img.shields.io/npm/dm/@euclidesdry/electron-pretty-titlebar?style=for-the-badge)
[![GitHub license](https://img.shields.io/github/license/euclidesdry/electron-pretty-titlebar?style=for-the-badge)](https://github.com/euclidesdry/electron-pretty-titlebar/blob/main/LICENSE)

A pretty way to add Titlebar in a Electron app using ReactJS

## How to use

```bash
npm install @euclidesdry/electron-pretty-titlebar
```

Or

```bash
yarn add @euclidesdry/electron-pretty-titlebar
```

## Instructions

App to your App.(tsx/jsx) file:

```jsx
import React from 'react';
import electronEnabled from 'is-electron';

import { Titlebar } from '@euclidesdry/electron-pretty-titlebar';
// TitleBar Styles
import '@euclidesdry/electron-pretty-titlebar/dist/cjs/titlebar.css';

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
