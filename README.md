# Pretty Electron Titlebar

![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=for-the-badge&logo=appveyor)
[![NPM Version (scoped)](https://img.shields.io/npm/v/@euclidesdry/electron-pretty-titlebar?style=for-the-badge&logo=appveyor)](https://www.npmjs.com/package/@euclidesdry/electron-pretty-titlebar)
![npm](https://img.shields.io/npm/dm/@euclidesdry/electron-pretty-titlebar?style=for-the-badge)
[![install size](https://packagephobia.com/badge?p=@euclidesdry/electron-pretty-titlebar)](https://packagephobia.com/result?p=@euclidesdry/electron-pretty-titlebar)
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

export default function App() {
	return (
		<Titlebar
			title='Hello World'
			logo={logoPathOrURL}
			onClose={handleClose}
			onMinus={handleMinimize}
			onMinimazeMaximaze={handleToggleWindowsExpansion}
		/>
	);
}
```
