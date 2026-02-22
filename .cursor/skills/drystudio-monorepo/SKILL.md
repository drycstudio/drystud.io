---
name: drystudio-monorepo
description: DryStud.io monorepo structure (Yarn 4, Turbo, workspaces). Use when adding packages, running scripts, understanding project layout, building the library, or setting up the project from scratch.
---

# DryStud.io Monorepo

## Tooling

- **Package manager**: Yarn 4 (Berry) with `nodeLinker: node-modules` (see `.yarnrc.yml`). Version pinned via `packageManager` field in root `package.json`.
- **Tasks**: Turborepo for orchestration (`turbo.json`). Root scripts delegate to turbo.
- **Linter/formatter**: ESLint + Prettier. Shared configs in `packages/config-eslint`.
- **TypeScript**: Shared base configs in `packages/config-typescript`.
- **Testing**: Vitest with jsdom environment for React component tests.
- **Changesets**: `@changesets/cli` for versioning and publishing.

## Layout

### Library

| Directory | Package | Description |
|-----------|---------|-------------|
| `libs/electron-titlebar` | `@drycstud.io/electron-titlebar` | Cross-platform Electron titlebar React component |

### Examples

| Directory | Package | Description |
|-----------|---------|-------------|
| `examples/with-electron-vite` | `with-electron-vite` | Full Electron + Vite + React example app |

### Shared Packages

| Directory | Package | Description |
|-----------|---------|-------------|
| `packages/config-eslint` | `@drycstud.io/config-eslint` | Shared ESLint configuration |
| `packages/config-typescript` | `@drycstud.io/config-typescript` | Shared TypeScript base configs |

## Entry Points

The `electron-titlebar` library has two entry points defined in `package.json` exports:

- `@drycstud.io/electron-titlebar` -- Main entry (Titlebar React component)
- `@drycstud.io/electron-titlebar/config` -- Config entry (setup, attachToWindow, preloadConfig, getTitlebarOptions)

## Build

The library build is: `tsc --p ./tsconfig.build.json && vite build`

This outputs to `libs/electron-titlebar/dist/`:
- `main.mjs` / `main.js` -- Titlebar component (ESM/CJS)
- `config.mjs` / `config.js` -- Config functions (ESM/CJS)
- Type declarations (`.d.ts`)

**Important**: Always build the library before running the example app:

```bash
cd libs/electron-titlebar
npx tsc --p ./tsconfig.build.json && npx vite build
```

## Common Commands (from repo root)

- `yarn dev` -- Run all workspaces in dev mode (turbo dev)
- `yarn build` -- Build all workspaces
- `yarn test` -- Run tests across all workspaces
- `yarn lint` -- Lint all workspaces
- `yarn lint:format` -- Format code with Prettier

## Adding a Workspace

1. Create directory under `libs/`, `examples/`, or `packages/` with its own `package.json`.
2. Workspaces are defined in root `package.json` as `"workspaces": ["examples/*", "libs/*", "packages/*"]`.
3. Reference other workspaces with `"@drycstud.io/foo": "workspace:*"` and run `yarn install`.

## Vite Library Config

The library uses Vite in library mode (`vite.config.ts`):
- Two entry points: `src/main.ts` and `src/config/index.ts`
- Formats: ESM (`mjs`) and CJS (`js`)
- External: React, ReactDOM, Electron, and all dependencies/peerDependencies
- Uses `vite-plugin-dts` for type declarations
- Uses `vite-plugin-lib-inject-css` for CSS injection
- Path alias: `~` maps to `./src`
