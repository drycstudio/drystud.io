---
name: electron-titlebar-integration
description: How to integrate @drycstud.io/electron-titlebar into an Electron + React app. Use when setting up the titlebar, configuring BrowserWindow, adding preload config, rendering the Titlebar component, adding menus, toolbar actions, user profile, command palette, or troubleshooting titlebar issues.
---

# Electron Titlebar Integration

## Overview

`@drycstud.io/electron-titlebar` provides a cross-platform titlebar for Electron apps built with React. It requires setup in three places: main process, preload script, and renderer.

## Step 1: Main Process

```typescript
import { setup, getTitlebarOptions, attachToWindow } from '@drycstud.io/electron-titlebar/config';
import { app, BrowserWindow, ipcMain } from 'electron';

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
```

### Config functions

- `setup()` -- Validates the Electron environment. Call at top level before creating windows.
- `getTitlebarOptions()` -- Returns platform-appropriate BrowserWindow options (macOS: hiddenInset + traffic lights; Win/Linux: hidden frame).
- `attachToWindow(ipcMain, mainWindow)` -- Registers IPC handlers for minimize, maximize/restore, close, and isMaximized queries.

### IPC Channels

| Channel | Direction | Action |
|---------|-----------|--------|
| `minimizeWindow` | Renderer -> Main | `mainWindow.minimize()` |
| `maximizeRestoreWindow` | Renderer -> Main | Toggle maximize/restore |
| `closeWindow` | Renderer -> Main | `mainWindow.close()` |
| `windowsIsMaximized` | Renderer -> Main (invoke) | Returns boolean |

## Step 2: Preload Script

```typescript
import { preloadConfig } from '@drycstud.io/electron-titlebar/config';
preloadConfig();
```

## Step 3: Renderer (React)

### Minimal

```tsx
import Titlebar from '@drycstud.io/electron-titlebar';

function App() {
  return <Titlebar title="My App" logo={myLogo} />;
}
```

### Full-featured

```tsx
import Titlebar from '@drycstud.io/electron-titlebar';
import type { MenuItem, TitlebarAction, UserInfo, CommandPaletteConfig } from '@drycstud.io/electron-titlebar';

<Titlebar
  title="My App"
  logo={myLogo}
  menuItems={menuItems}
  actions={toolbarActions}
  renderActions={customActionsJSX}
  user={currentUser}
  userActions={userDropdownItems}
  onSignIn={handleSignIn}
  onSignOut={handleSignOut}
  commandPalette={commandPaletteConfig}
  onMinus={customMinimize}
  onClose={customClose}
/>
```

## Titlebar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string \| null` | `'Pretty Titlebar'` | Title text |
| `logo` | `string` | Built-in logo | Logo image (Win/Linux only) |
| `size` | `'default' \| 'small'` | `'default'` | Height: 38px or 32px |
| `platform` | `'windows' \| 'macos' \| 'linux'` | Auto-detected | Force platform style |
| `menuItems` | `MenuItem[]` | -- | Dropdown menu bar items |
| `actions` | `TitlebarAction[]` | -- | Toolbar action buttons |
| `renderActions` | `() => ReactNode` | -- | Custom JSX in actions area |
| `user` | `UserInfo \| null` | -- | User profile data |
| `userActions` | `UserProfileAction[]` | -- | User dropdown actions |
| `onSignIn` | `() => void` | -- | Sign-in button handler |
| `onSignOut` | `() => void` | -- | Sign-out action handler |
| `commandPalette` | `CommandPaletteConfig` | -- | Command palette configuration |
| `onMinus` | `() => void` | Built-in IPC | Custom minimize handler |
| `onMinimizeMaximaze` | `() => void` | Built-in IPC | Custom maximize/restore |
| `onClose` | `() => void` | Built-in IPC | Custom close handler |

## Toolbar Actions

Two API approaches:

1. **Data-driven** (`actions` prop) -- Array of `TitlebarAction` with icon, badge, tooltip, dropdown.
2. **Escape hatch** (`renderActions` prop) -- Arbitrary JSX. Both can be combined.

### Icon variant (default)

```tsx
{ id: 'bell', icon: <FiBell />, tooltip: 'Notifications', badge: 3, badgeVariant: 'attention', dropdown: [...] }
```

### Filled / Split Button variant

```tsx
{
  id: 'update', icon: <FiZap />, label: 'Update v2.1.0',
  variant: 'filled', badgeVariant: 'success',
  onClick: () => downloadAndUpdate(),
  dropdown: [
    { label: 'Download & Update Now', icon: <FiRefreshCw />, action: () => {} },
    { label: 'Download Only', icon: <FiDownload />, action: () => {} },
  ],
}
```

Main area fires `onClick`, chevron opens the dropdown. Color controlled by `badgeVariant`.

## Troubleshooting

### "Cannot find module .../dist/config.js"

Build the library first: `npx tsc --p ./tsconfig.build.json && npx vite build` from `libs/electron-titlebar`.

### Titlebar overlaps content

The component adds `paddingTop` to `<html>` via `react-helmet-async`. Fallback: manually add 38px (default) or 32px (small) padding.

### Window controls not responding

Ensure both `attachToWindow(ipcMain, mainWindow)` (main) AND `preloadConfig()` (preload) are called.

### CSS conflicts

Titlebar styles are fully scoped via Stitches. No global resets are injected.
