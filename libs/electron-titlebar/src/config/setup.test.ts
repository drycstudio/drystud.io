import { describe, test, expect, vi, afterEach } from 'vitest';
import setup, { getTitlebarOptions } from './setup';

const originalPlatform = process.platform;

afterEach(() => {
  Object.defineProperty(process, 'platform', { value: originalPlatform, configurable: true });
  if ('type' in process) delete (process as unknown as Record<string, unknown>).type;
  vi.restoreAllMocks();
});

describe('setup()', () => {
  test('warns when process.type is not "browser"', () => {
    Object.defineProperty(process, 'type', { value: 'renderer', configurable: true });
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    setup();
    expect(spy).toHaveBeenCalledWith('!Titlebar Alert!: type is not supported');
  });

  test('does not warn when process.type is "browser"', () => {
    Object.defineProperty(process, 'type', { value: 'browser', configurable: true });
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    setup();
    expect(spy).not.toHaveBeenCalled();
  });

  test('does not warn when process.type is absent', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    setup();
    expect(spy).not.toHaveBeenCalled();
  });
});

describe('getTitlebarOptions()', () => {
  test('returns macOS options when platform is darwin', () => {
    Object.defineProperty(process, 'platform', { value: 'darwin', configurable: true });
    const options = getTitlebarOptions();
    expect(options).toEqual({
      frame: false,
      titleBarStyle: 'hiddenInset',
      trafficLightPosition: { x: 10, y: 10 },
    });
  });

  test('returns Windows/Linux options when platform is not darwin', () => {
    Object.defineProperty(process, 'platform', { value: 'win32', configurable: true });
    const options = getTitlebarOptions();
    expect(options).toEqual({
      frame: false,
      titleBarStyle: 'hidden',
    });
  });
});
