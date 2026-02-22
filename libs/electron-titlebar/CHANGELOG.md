# @drycstud.io/electron-titlebar

## 2.1.1

### Patch Changes

- 9f277a4: Fix CI pipeline: correct turbo filter package name, rename ESLint config to .mjs for Node compatibility, remove invalid eslint-disable comments, and upgrade Node.js from 18 to 22 LTS in all workflows.

## 2.1.0

### Minor Changes

- 2a8a687: Add cascading (nested) submenus to the Menu component. MenuItem type is now recursive — any item can contain a submenu with children, enabling multi-level flyout menus. Includes hover delay, viewport edge detection, keyboard navigation (ArrowRight/Left to open/close), chevron indicators, and full backward compatibility (SubMenuItem kept as deprecated alias).

## 2.0.0

### Major Changes

- Complete titlebar overhaul with new features, components, and architecture:

  **New Components**
  - **Menu bar** — Full dropdown menus with submenus, keyboard navigation (Arrow keys, Enter, Escape), hover switching, separators, disabled items, and automatic keyboard shortcut formatting (Ctrl+S → ⌘S on macOS)
  - **Responsive overflow** — Menu items collapse one-by-one into an overflow button (`⋯`) when the window is resized, and restore individually when space is available again
  - **Command palette** — Searchable command palette with sections, filter chips, keyboard navigation, custom item rendering, loading/empty states, and footer actions
  - **User profile** — Avatar with initials fallback, status indicator (online/away/busy/offline), dropdown with custom actions, sign-in/sign-out flow
  - **Notification panel** — Pre-styled building blocks (`NotificationPanelRoot`, `NotificationItem`, `NotificationBadge`, etc.) for rich notification dropdowns
  - **Custom dropdown content** — `renderDropdown` prop on toolbar actions for fully custom dropdown content (e.g., notification panels)
  - **Filled split button** — Colored split buttons with main action + chevron dropdown for toolbar actions

  **Improvements**
  - Dropdown menus now scroll with a styled scrollbar when exceeding viewport height
  - SearchBar container clips cleanly instead of overlapping menu items on narrow windows
  - `void` handling for async promise in window maximize/restore
  - Action guard in menu overflow flattening prevents undefined actions
  - Render-phase ref mutation replaced with `useMemo` for React concurrent mode safety

  **Infrastructure**
  - Upgraded to React 19, Electron 40, Vite 7, TypeScript 5.9
  - 341 tests with 100% coverage (statements, branches, functions, lines)
  - Comprehensive Storybook documentation for all components
  - Cursor rules and skills for development guidance
  - Rewritten README with architecture diagrams, full API reference, and demo GIF

  **Breaking Changes**
  - Peer dependency: `react` now requires `^18.3.1 || ^19.0.0`
  - Peer dependency: `electron` now requires `>=31.0.0`

## 1.0.4

### Patch Changes

- b14ef2c: Fixes:
  - Not loading preload file: https://github.com/drycstudio/drystud.io/issues/30
  - Changing example folder

## 1.0.3

### Patch Changes

- Fixes:
  - Adding config type to the `electron-titlebar` library

## 1.0.2

### Patch Changes

- 12a0a0d: adding new lib (@drycstud.io/electron-titlebar) documentation

## 1.0.1

### Patch Changes

- f7c18d9: changing package name to "electron-titlebar"

## 1.0.0

### Major Changes

- e8ac5f2: # Adding changeset

  Project Structure
  Moving library to it's own directory
