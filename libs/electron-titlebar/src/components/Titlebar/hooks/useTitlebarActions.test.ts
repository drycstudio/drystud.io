import { renderHook, act } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('is-electron', () => ({ default: () => false }));

async function importHook() {
  const mod = await import('./useTitlebarActions');
  return mod.useTitlebarActions;
}

describe('useTitlebarActions', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.spyOn(console, 'warn').mockImplementation(() => { });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('returns all handler functions', async () => {
    const useTitlebarActions = await importHook();
    const { result } = renderHook(() =>
      useTitlebarActions(null, { toggleWindowMaximized: vi.fn() }),
    );
    expect(result.current.handleMinus).toBeInstanceOf(Function);
    expect(result.current.handleMinimazeMaximaze).toBeInstanceOf(Function);
    expect(result.current.handleClose).toBeInstanceOf(Function);
  });

  test('uses custom onMinus handler when provided', async () => {
    const useTitlebarActions = await importHook();
    const onMinus = vi.fn();
    const { result } = renderHook(() =>
      useTitlebarActions(null, { toggleWindowMaximized: vi.fn(), onMinus }),
    );
    act(() => result.current.handleMinus());
    expect(onMinus).toHaveBeenCalled();
  });

  test('uses custom onMinimizeMaximaze handler when provided', async () => {
    const useTitlebarActions = await importHook();
    const onMinimizeMaximaze = vi.fn();
    const { result } = renderHook(() =>
      useTitlebarActions(null, { toggleWindowMaximized: vi.fn(), onMinimizeMaximaze }),
    );
    await act(async () => {
      await result.current.handleMinimazeMaximaze();
    });
    expect(onMinimizeMaximaze).toHaveBeenCalled();
  });

  test('uses custom onClose handler when provided', async () => {
    const useTitlebarActions = await importHook();
    const onClose = vi.fn();
    const { result } = renderHook(() =>
      useTitlebarActions(null, { toggleWindowMaximized: vi.fn(), onClose }),
    );
    act(() => result.current.handleClose());
    expect(onClose).toHaveBeenCalled();
  });

  test('sends IPC messages when no custom handlers with ipcHandle', async () => {
    const useTitlebarActions = await importHook();
    const mockIpc = {
      send: vi.fn(),
      invoke: vi.fn().mockResolvedValue(false),
      on: vi.fn(),
      removeAllListeners: vi.fn(),
    };
    const toggleMaximized = vi.fn();

    const { result } = renderHook(() =>
      useTitlebarActions(mockIpc as never, { toggleWindowMaximized: toggleMaximized }),
    );

    act(() => result.current.handleMinus());
    expect(mockIpc.send).toHaveBeenCalledWith('minimizeWindow');

    await act(async () => {
      await result.current.handleMinimazeMaximaze();
    });
    expect(mockIpc.send).toHaveBeenCalledWith('maximizeRestoreWindow');

    act(() => result.current.handleClose());
    expect(mockIpc.send).toHaveBeenCalledWith('closeWindow');
  });

  test('checks window maximized state on resize with ipcHandle', async () => {
    const useTitlebarActions = await importHook();
    const mockIpc = {
      send: vi.fn(),
      invoke: vi.fn().mockResolvedValue(true),
      on: vi.fn(),
      removeAllListeners: vi.fn(),
    };
    const toggleMaximized = vi.fn();

    renderHook(() =>
      useTitlebarActions(mockIpc as never, { toggleWindowMaximized: toggleMaximized }),
    );

    await vi.waitFor(() => {
      expect(mockIpc.invoke).toHaveBeenCalledWith('windowsIsMaximized');
    });

    await vi.waitFor(() => {
      expect(toggleMaximized).toHaveBeenCalledWith(true);
    });
  });

  test('handles resize events with ipcHandle', async () => {
    const useTitlebarActions = await importHook();
    const mockIpc = {
      send: vi.fn(),
      invoke: vi.fn().mockResolvedValue(false),
      on: vi.fn(),
      removeAllListeners: vi.fn(),
    };
    const toggleMaximized = vi.fn();

    const { unmount } = renderHook(() =>
      useTitlebarActions(mockIpc as never, { toggleWindowMaximized: toggleMaximized }),
    );

    await vi.waitFor(() => {
      expect(mockIpc.invoke).toHaveBeenCalled();
    });

    mockIpc.invoke.mockClear();
    act(() => {
      globalThis.dispatchEvent(new Event('resize'));
    });

    await vi.waitFor(() => {
      expect(mockIpc.invoke).toHaveBeenCalledWith('windowsIsMaximized');
    });

    unmount();
  });

  test('warns when not in Electron environment', async () => {
    const useTitlebarActions = await importHook();
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

    renderHook(() => useTitlebarActions(null, { toggleWindowMaximized: vi.fn() }));

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('not an ElectronJS Application'),
    );
  });

  test('warns about preload config when ipcHandle is null', async () => {
    const useTitlebarActions = await importHook();
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

    renderHook(() =>
      useTitlebarActions(null, { toggleWindowMaximized: vi.fn() }),
    );

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('preload configuration'),
    );
  });

  test('does not warn about preload config when ipcHandle exists', async () => {
    const useTitlebarActions = await importHook();
    const mockIpc = {
      send: vi.fn(),
      invoke: vi.fn().mockResolvedValue(false),
      on: vi.fn(),
      removeAllListeners: vi.fn(),
    };
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

    renderHook(() =>
      useTitlebarActions(mockIpc as never, { toggleWindowMaximized: vi.fn() }),
    );

    const preloadWarns = warnSpy.mock.calls.filter(
      ([msg]) => typeof msg === 'string' && msg.includes('preload configuration'),
    );
    expect(preloadWarns).toHaveLength(0);
  });

  test('does not add resize listener when ipcHandle is null', async () => {
    const useTitlebarActions = await importHook();
    const addSpy = vi.spyOn(globalThis, 'addEventListener');

    renderHook(() => useTitlebarActions(null, { toggleWindowMaximized: vi.fn() }));

    const resizeCalls = addSpy.mock.calls.filter(([event]) => event === 'resize');
    expect(resizeCalls).toHaveLength(0);
  });

  test('skips non-electron warning when isElectron is true', async () => {
    vi.doMock('is-electron', () => ({ default: () => true }));
    const mod = await import('./useTitlebarActions');
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

    renderHook(() => mod.useTitlebarActions(null, { toggleWindowMaximized: vi.fn() }));

    const nonElectronWarns = warnSpy.mock.calls.filter(
      ([msg]) => typeof msg === 'string' && msg.includes('not an ElectronJS Application'),
    );
    expect(nonElectronWarns).toHaveLength(0);
  });

  test('cleans up resize listener on unmount', async () => {
    const useTitlebarActions = await importHook();
    const removeSpy = vi.spyOn(globalThis, 'removeEventListener');
    const mockIpc = {
      send: vi.fn(),
      invoke: vi.fn().mockResolvedValue(false),
      on: vi.fn(),
      removeAllListeners: vi.fn(),
    };

    const { unmount } = renderHook(() =>
      useTitlebarActions(mockIpc as never, { toggleWindowMaximized: vi.fn() }),
    );

    unmount();
    const resizeCalls = removeSpy.mock.calls.filter(([event]) => event === 'resize');
    expect(resizeCalls).toHaveLength(1);
  });
});
