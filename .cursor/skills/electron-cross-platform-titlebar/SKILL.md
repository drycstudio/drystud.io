---
name: electron-cross-platform-titlebar
description: Cross-platform patterns for Electron titlebar (macOS traffic lights, Windows/Linux custom controls). Use when adding platform-specific behavior, debugging OS detection, modifying titlebar layout per platform, or extending platform support.
---

# Cross-Platform Titlebar Patterns

## Platform Detection

### Main Process (Node.js)

```typescript
const isMac = process.platform === 'darwin';
const isWindows = process.platform === 'win32';
const isLinux = process.platform === 'linux';
```

Used in `getTitlebarOptions()` (`libs/electron-titlebar/src/config/setup.ts`).

### Renderer Process (Browser)

```typescript
import { OS } from '~/utils';

OS.isMacOS();   // true on macOS
OS.isWindows(); // true on Windows
OS.isLinux();   // true on Linux
```

The `detectPlatform()` function in `Titlebar.tsx`:

```typescript
type Platform = 'windows' | 'macos' | 'linux';

function detectPlatform(): Platform {
  if (OS.isMacOS()) return 'macos';
  if (OS.isLinux()) return 'linux';
  return 'windows';
}
```

## Platform-Specific BrowserWindow Config

### macOS -- `titleBarStyle: 'hiddenInset'`

- Keeps native traffic light buttons (close, minimize, maximize)
- Traffic lights positioned at `{ x: 10, y: 10 }`
- Custom titlebar renders title (centered), no custom buttons
- `paddingLeft: 70px` on container to avoid overlapping traffic lights

### Windows / Linux -- `titleBarStyle: 'hidden'`

- Fully hides native titlebar and frame
- Custom titlebar renders: **logo** (left) + **title** (center) + **minimize/maximize/close** (right)

## Component Architecture

```
Titlebar
├── [!isMac] Logo + LogoImage
└── WindowControls
    ├── [macOnly=true]  -> Menu + Title + SearchBar + ToolbarActions + UserProfile
    └── [macOnly=false] -> Menu + Title + SearchBar + ToolbarActions + UserProfile + ButtonContainer
                                                                                     ├── Minimize
                                                                                     ├── Maximize/Restore
                                                                                     └── Close
```

**Both branches render the same sub-components** (Menu, SearchBar, ToolbarActions, UserProfile). The only difference is macOS omits window control buttons since native traffic lights handle it.

### WindowControls Discriminated Union

```typescript
// macOS mode
<WindowControls title={title} macOnly menuItems={...} actions={...} />

// Windows/Linux mode -- button handlers required
<WindowControls
  title={title}
  isWindowMaximized={isWindowMaximized}
  handleMinimazeMaximaze={handleMinimazeMaximaze}
  handleMinus={handleMinus}
  handleClose={handleClose}
  menuItems={...}
  actions={...}
/>
```

### Stitches Platform Variant

```typescript
variants: {
  platform: {
    macos: { paddingLeft: '70px' },
    windows: {},
    linux: {},
  },
}
```

## Adding New Platform-Specific Behavior

1. Add detection logic in `utils/index.ts` if needed.
2. Add a new variant value to the `platform` variant in `styles.ts`.
3. Handle the new case in `Titlebar.tsx` conditional rendering.
4. If main process changes needed, update `getTitlebarOptions()` in `config/setup.ts`.

## Testing Platform Behavior

Use the `platform` prop to force a specific platform in tests or Storybook:

```tsx
<Titlebar title="Test" platform="macos" />
<Titlebar title="Test" platform="windows" />
<Titlebar title="Test" platform="linux" />
```

In vitest with jsdom, auto-detection defaults to `'windows'` since jsdom's userAgent doesn't match macOS or Linux patterns.
