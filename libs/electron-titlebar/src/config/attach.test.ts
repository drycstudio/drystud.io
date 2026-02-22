import { describe, test, expect, vi, beforeEach } from 'vitest';
import attachToWindow from './attach';

function createMockMainWindow() {
  return {
    minimize: vi.fn(),
    maximize: vi.fn(),
    restore: vi.fn(),
    close: vi.fn(),
    isMaximized: vi.fn(),
    webContents: { send: vi.fn() },
  };
}

function createMockIpcMain() {
  const handlers: Record<string, (...args: unknown[]) => unknown> = {};
  return {
    on: vi.fn((channel: string, handler: (...args: unknown[]) => unknown) => {
      handlers[channel] = handler;
    }),
    handle: vi.fn((channel: string, handler: (...args: unknown[]) => unknown) => {
      handlers[channel] = handler;
    }),
    _handlers: handlers,
  };
}

describe('attachToWindow', () => {
  let ipcMain: ReturnType<typeof createMockIpcMain>;
  let mainWindow: ReturnType<typeof createMockMainWindow>;

  beforeEach(() => {
    ipcMain = createMockIpcMain();
    mainWindow = createMockMainWindow();
    attachToWindow(ipcMain as never, mainWindow as never);
  });

  test('registers all expected IPC channels', () => {
    expect(ipcMain.on).toHaveBeenCalledWith('minimizeWindow', expect.any(Function));
    expect(ipcMain.on).toHaveBeenCalledWith('maximizeRestoreWindow', expect.any(Function));
    expect(ipcMain.on).toHaveBeenCalledWith('closeWindow', expect.any(Function));
    expect(ipcMain.handle).toHaveBeenCalledWith('windowsIsMaximized', expect.any(Function));
  });

  test('minimizeWindow handler calls mainWindow.minimize', () => {
    ipcMain._handlers.minimizeWindow();
    expect(mainWindow.minimize).toHaveBeenCalled();
  });

  test('maximizeRestoreWindow restores when maximized', () => {
    mainWindow.isMaximized.mockReturnValue(true);
    ipcMain._handlers.maximizeRestoreWindow();
    expect(mainWindow.restore).toHaveBeenCalled();
    expect(mainWindow.maximize).not.toHaveBeenCalled();
  });

  test('maximizeRestoreWindow maximizes when not maximized', () => {
    mainWindow.isMaximized.mockReturnValue(false);
    ipcMain._handlers.maximizeRestoreWindow();
    expect(mainWindow.maximize).toHaveBeenCalled();
    expect(mainWindow.restore).not.toHaveBeenCalled();
  });

  test('closeWindow handler calls mainWindow.close', () => {
    ipcMain._handlers.closeWindow();
    expect(mainWindow.close).toHaveBeenCalled();
  });

  test('windowsIsMaximized returns the maximized state and notifies renderer', () => {
    mainWindow.isMaximized.mockReturnValue(true);
    const result = ipcMain._handlers.windowsIsMaximized();
    expect(result).toBe(true);
    expect(mainWindow.webContents.send).toHaveBeenCalledWith('isMaximized', true);
  });

  test('windowsIsMaximized returns false when not maximized', () => {
    mainWindow.isMaximized.mockReturnValue(false);
    const result = ipcMain._handlers.windowsIsMaximized();
    expect(result).toBe(false);
    expect(mainWindow.webContents.send).toHaveBeenCalledWith('isMaximized', false);
  });
});
