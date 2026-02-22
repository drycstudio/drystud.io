# Pretty Electron Titlebar

<img alt="GitHub Actions Workflow Status" src="https://img.shields.io/github/actions/workflow/status/euclidesdry/electron-electron-pretty-titlebar/titlebar-ci.yml?style=for-the-badge&label=CI">

[![NPM Version (scoped)](https://img.shields.io/npm/v/@drycstud.io/electron-titlebar?style=for-the-badge&logo=appveyor)](https://www.npmjs.com/package/@drycstud.io/electron-titlebar)
![npm](https://img.shields.io/npm/dm/@drycstud.io/electron-titlebar?style=for-the-badge)
![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=for-the-badge&logo=appveyor)
[![GitHub license](https://img.shields.io/github/license/euclidesdry/electron-electron-pretty-titlebar?style=for-the-badge)](https://github.com/euclidesdry/electron-electron-pretty-titlebar/blob/main/LICENSE)

A pretty, cross-platform titlebar for Electron apps built with React. Automatically adapts to **macOS** (native traffic lights), **Windows**, and **Linux** -- similar to VS Code, Figma, and Postman.

## Monorepo Structure

This is a monorepo managed with [Turborepo](https://turbo.build/) and [Yarn Workspaces](https://yarnpkg.com/features/workspaces).

```text
drystud.io/
├── libs/
│   └── electron-titlebar/     # The titlebar library (@drycstud.io/electron-titlebar)
├── examples/
│   └── with-electron-vite/    # Example app using Electron + Vite + React
└── packages/
    ├── config-eslint/         # Shared ESLint configuration
    └── config-typescript/     # Shared TypeScript configuration
```

## Quick Start

### Install the package

```bash
# npm
npm install @drycstud.io/electron-titlebar

# yarn
yarn add @drycstud.io/electron-titlebar

# pnpm
pnpm add @drycstud.io/electron-titlebar
```

### 3-step integration

**Step 1 -- Main process** (`main.ts`):

```typescript
import { app, BrowserWindow, ipcMain } from 'electron';
import { setup, getTitlebarOptions, attachToWindow } from '@drycstud.io/electron-titlebar/config';

setup();

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 840,
    ...getTitlebarOptions(),
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  });

  mainWindow.on('ready-to-show', () => {
    attachToWindow(ipcMain, mainWindow);
    mainWindow.show();
  });
}

app.whenReady().then(createWindow);
```

**Step 2 -- Preload script** (`preload.ts`):

```typescript
import { preloadConfig } from '@drycstud.io/electron-titlebar/config';

preloadConfig();
```

**Step 3 -- Renderer** (`App.tsx`):

```tsx
import Titlebar from '@drycstud.io/electron-titlebar';

export default function App() {
  return (
    <>
      <Titlebar title="My App" logo={myLogo} />
      {/* Your app content */}
    </>
  );
}
```

The titlebar automatically adapts per platform:

- **macOS** -- Native traffic light buttons + centered title
- **Windows / Linux** -- Logo + title + custom minimize/maximize/close buttons

## Detailed Documentation

For the full API reference, props documentation, platform behavior details, CSS framework compatibility notes, and custom handler examples, see the **[library README](libs/electron-titlebar/README.md)**.

## Development

### Prerequisites

- Node.js >= 18
- Yarn 4 (Corepack)

### Setup

```bash
git clone https://github.com/drycstudio/drystud.io.git
cd drystud.io
yarn install
```

### Common Commands

| Command               | Description                                      |
|-----------------------|--------------------------------------------------|
| `yarn build`          | Build all packages and libraries (via Turborepo) |
| `yarn dev`            | Start development mode for all workspaces        |
| `yarn test`           | Run tests across all workspaces                  |
| `yarn lint`           | Lint all workspaces                              |
| `yarn lint:format`    | Format code with Prettier                        |

### Running the Example App

```bash
yarn build                        # Build the library first
cd examples/with-electron-vite
yarn dev                          # Start the Electron app with hot reload
```

## License

MIT
