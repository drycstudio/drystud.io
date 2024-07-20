/* eslint-disable no-constant-binary-expression */
// OS detection
const isElectronRenderer =
  typeof process &&
  typeof process.versions !== 'undefined' &&
  typeof process.versions.electron !== 'undefined' &&
  'type' in process &&
  process.type === 'renderer';

const isNavigator = typeof navigator === 'object' && !isElectronRenderer;

class MyOS {
  userAgent: string;

  constructor() {
    this.userAgent = navigator.userAgent;
  }

  isWindows() {
    return isNavigator ? this.userAgent.indexOf('Windows') >= 0 : process.platform === 'win32';
  }

  isMacOS() {
    return isNavigator ? this.userAgent.indexOf('Macintosh') >= 0 : process.platform === 'darwin';
  }

  isLinux() {
    return isNavigator ? this.userAgent.indexOf('Linux') >= 0 : process.platform === 'linux';
  }
}

export const OS = new MyOS();
