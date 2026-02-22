import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('electron', () => ({
  default: {
    contextBridge: {
      exposeInMainWorld: vi.fn(),
    },
  },
}));

vi.mock('@electron-toolkit/preload', () => ({
  default: {
    electronAPI: { ipcRenderer: { send: vi.fn() } },
  },
}));

const win = globalThis as unknown as Record<string, unknown>;
const proc = process as unknown as Record<string, unknown>;
const g = globalThis as unknown as Record<string, unknown>;

describe('preloadConfig', () => {
  beforeEach(() => {
    vi.resetModules();
    delete win.electron;
    delete win.api;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete win.electron;
    delete win.api;
    delete g.electronAPI;
  });

  test('returns early when window.electron already exists', async () => {
    win.electron = {};
    const electron = await import('electron');
    const spy = vi.spyOn(electron.default.contextBridge, 'exposeInMainWorld');

    const { default: preloadConfig } = await import('./preloadConfig');
    preloadConfig();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  test('uses contextBridge when process.contextIsolated is true', async () => {
    Object.defineProperty(process, 'contextIsolated', { value: true, configurable: true });
    const electron = await import('electron');
    const spy = vi.spyOn(electron.default.contextBridge, 'exposeInMainWorld');

    const { default: preloadConfig } = await import('./preloadConfig');
    preloadConfig();

    expect(spy).toHaveBeenCalledWith('electron', expect.any(Object));
    expect(spy).toHaveBeenCalledWith('versions', expect.objectContaining({}));

    delete proc.contextIsolated;
  });

  test('handles contextBridge errors gracefully', async () => {
    Object.defineProperty(process, 'contextIsolated', { value: true, configurable: true });
    const electron = await import('electron');
    vi.spyOn(electron.default.contextBridge, 'exposeInMainWorld').mockImplementation(() => {
      throw new Error('Context bridge failed');
    });
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

    const { default: preloadConfig } = await import('./preloadConfig');
    preloadConfig();

    expect(errorSpy).toHaveBeenCalledWith(
      '-- Prettier Titlebar :: Preload Config - Error: ',
      expect.any(Error),
    );

    delete proc.contextIsolated;
  });

  test('sets window globals when contextIsolated is false', async () => {
    Object.defineProperty(process, 'contextIsolated', { value: false, configurable: true });

    const { default: preloadConfig } = await import('./preloadConfig');
    preloadConfig();

    expect(win.electron).toBeDefined();
    expect(win.api).toBeDefined();

    delete proc.contextIsolated;
  });
});
