# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is the **DryStud.io** monorepo — a cross-platform Electron titlebar React component library (`@drycstud.io/electron-titlebar`). It uses Yarn 4 (via Corepack), Turborepo, and Vite. See the root `README.md` for the full monorepo layout and common commands.

### Node version caveat

The `.node-version` file says `18`, but Vite 7.x (used by the library build) requires **Node.js 20+**. Use Node 20 via nvm (`nvm use 20`). The update script handles this automatically.

### Key commands

Standard commands are documented in the root `README.md` and `libs/electron-titlebar/package.json`. Summary:

- **Install**: `yarn install` (from repo root)
- **Build**: `yarn build` (builds the library via Turborepo)
- **Lint**: `yarn lint`
- **Format**: `yarn lint:format`
- **Test**: `yarn test` (runs Vitest — 362 tests, jsdom environment, no display needed)
- **Storybook**: `yarn storybook` (dev UI on port 6006; best way to visually test the titlebar component in a cloud agent environment)

### Running the application

- **Storybook** (`yarn storybook`) is the recommended way to run and visually test the component library. It does not require a display server beyond what the cloud VM provides.
- The **Electron example app** (`examples/with-electron-vite`) requires a full display server (X11/Xvfb) and Electron binary. Use Storybook instead for visual testing in cloud environments.

### Pre-commit hooks

Husky runs `lint-staged` on pre-commit, which invokes `yarn lint` and `yarn lint:format` on changed files in `libs/` and `packages/`.
