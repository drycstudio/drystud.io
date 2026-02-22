import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatShortcut } from './index';

const originalPlatform = process.platform;

describe('formatShortcut', () => {
  describe('on macOS', () => {
    test('converts Ctrl to ⌘', () => {
      expect(formatShortcut('Ctrl+N', 'macos')).toBe('⌘N');
    });

    test('converts Ctrl+Shift to ⇧⌘', () => {
      expect(formatShortcut('Ctrl+Shift+N', 'macos')).toBe('⇧⌘N');
    });

    test('converts Alt to ⌥', () => {
      expect(formatShortcut('Alt+F4', 'macos')).toBe('⌥F4');
    });

    test('converts Ctrl+Alt to ⌥⌘', () => {
      expect(formatShortcut('Ctrl+Alt+S', 'macos')).toBe('⌥⌘S');
    });

    test('converts Ctrl+Shift+Alt to ⌥⇧⌘', () => {
      expect(formatShortcut('Ctrl+Shift+Alt+N', 'macos')).toBe('⌥⇧⌘N');
    });

    test('keeps function keys as-is', () => {
      expect(formatShortcut('F11', 'macos')).toBe('F11');
      expect(formatShortcut('F12', 'macos')).toBe('F12');
    });

    test('handles single key with backtick', () => {
      expect(formatShortcut('Ctrl+`', 'macos')).toBe('⌘`');
    });

    test('deduplicates identical modifier symbols', () => {
      expect(formatShortcut('Ctrl+Cmd+N', 'macos')).toBe('⌘N');
    });

    test('sorts modifiers in standard Mac order (⌃⌥⇧⌘)', () => {
      expect(formatShortcut('Shift+Ctrl+N', 'macos')).toBe('⇧⌘N');
    });
  });

  describe('on Windows/Linux', () => {
    test('returns shortcut unchanged on windows', () => {
      expect(formatShortcut('Ctrl+N', 'windows')).toBe('Ctrl+N');
    });

    test('returns shortcut unchanged on linux', () => {
      expect(formatShortcut('Ctrl+Shift+N', 'linux')).toBe('Ctrl+Shift+N');
    });
  });
});

describe('OS utility', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    Object.defineProperty(process, 'platform', { value: originalPlatform, configurable: true });
    if ('type' in process) delete (process as unknown as Record<string, unknown>).type;
    if ('electron' in process.versions)
      delete (process.versions as unknown as Record<string, unknown>).electron;
    vi.restoreAllMocks();
  });

  describe('navigator-based detection (browser context)', () => {
    test('detects Windows via userAgent', async () => {
      Object.defineProperty(globalThis.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        configurable: true,
      });
      const { OS } = await import('./index');
      expect(OS.isWindows()).toBe(true);
      expect(OS.isMacOS()).toBe(false);
      expect(OS.isLinux()).toBe(false);
    });

    test('detects macOS via userAgent', async () => {
      Object.defineProperty(globalThis.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        configurable: true,
      });
      const { OS } = await import('./index');
      expect(OS.isMacOS()).toBe(true);
      expect(OS.isWindows()).toBe(false);
      expect(OS.isLinux()).toBe(false);
    });

    test('detects Linux via userAgent', async () => {
      Object.defineProperty(globalThis.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (X11; Linux x86_64)',
        configurable: true,
      });
      const { OS } = await import('./index');
      expect(OS.isLinux()).toBe(true);
      expect(OS.isWindows()).toBe(false);
      expect(OS.isMacOS()).toBe(false);
    });
  });

  describe('process-based detection (electron renderer context)', () => {
    function simulateElectronRenderer() {
      Object.defineProperty(process, 'type', { value: 'renderer', configurable: true });
      Object.defineProperty(process.versions, 'electron', { value: '31.0.0', configurable: true });
    }

    test('detects darwin as macOS', async () => {
      simulateElectronRenderer();
      Object.defineProperty(process, 'platform', { value: 'darwin', configurable: true });
      const { OS } = await import('./index');
      expect(OS.isMacOS()).toBe(true);
      expect(OS.isWindows()).toBe(false);
      expect(OS.isLinux()).toBe(false);
    });

    test('detects win32 as Windows', async () => {
      simulateElectronRenderer();
      Object.defineProperty(process, 'platform', { value: 'win32', configurable: true });
      const { OS } = await import('./index');
      expect(OS.isWindows()).toBe(true);
      expect(OS.isMacOS()).toBe(false);
      expect(OS.isLinux()).toBe(false);
    });

    test('detects linux as Linux', async () => {
      simulateElectronRenderer();
      Object.defineProperty(process, 'platform', { value: 'linux', configurable: true });
      const { OS } = await import('./index');
      expect(OS.isLinux()).toBe(true);
      expect(OS.isWindows()).toBe(false);
      expect(OS.isMacOS()).toBe(false);
    });
  });

  describe('fallback when navigator is undefined', () => {
    test('falls back to process.platform when navigator is missing', async () => {
      const orig = globalThis.navigator;
      // @ts-expect-error -- intentionally remove navigator for this test
      delete globalThis.navigator;
      Object.defineProperty(process, 'platform', { value: 'freebsd', configurable: true });

      const { OS } = await import('./index');
      expect(OS.isWindows()).toBe(false);
      expect(OS.isMacOS()).toBe(false);
      expect(OS.isLinux()).toBe(false);

      Object.defineProperty(globalThis, 'navigator', { value: orig, configurable: true });
    });
  });
});
