const hasProcess = typeof process !== 'undefined';

const isElectronRenderer =
  hasProcess &&
  process.versions?.electron !== undefined &&
  'type' in process &&
  process.type === 'renderer';

const isNavigator = typeof navigator === 'object' && !isElectronRenderer;

class MyOS {
  userAgent: string;

  constructor() {
    this.userAgent = typeof navigator === 'undefined' ? '' : navigator.userAgent;
  }

  isWindows() {
    return isNavigator ? this.userAgent.includes('Windows') : hasProcess && process.platform === 'win32';
  }

  isMacOS() {
    return isNavigator ? this.userAgent.includes('Macintosh') : hasProcess && process.platform === 'darwin';
  }

  isLinux() {
    return isNavigator ? this.userAgent.includes('Linux') : hasProcess && process.platform === 'linux';
  }
}

export const OS = new MyOS();

export type Platform = 'windows' | 'macos' | 'linux';

const MAC_MODIFIER_SYMBOLS: Record<string, string> = {
  ctrl: '⌘',
  control: '⌃',
  alt: '⌥',
  option: '⌥',
  shift: '⇧',
  meta: '⌘',
  cmd: '⌘',
  command: '⌘',
};

const MAC_MODIFIER_ORDER = ['⌃', '⌥', '⇧', '⌘'];

export function formatShortcut(shortcut: string, platform: Platform): string {
  if (platform !== 'macos') return shortcut;

  const parts = shortcut.split('+');
  const modifiers: string[] = [];
  const keys: string[] = [];

  for (const part of parts) {
    const symbol = MAC_MODIFIER_SYMBOLS[part.trim().toLowerCase()];
    if (symbol) {
      if (!modifiers.includes(symbol)) modifiers.push(symbol);
    } else {
      keys.push(part.trim());
    }
  }

  modifiers.sort(
    (a, b) => MAC_MODIFIER_ORDER.indexOf(a) - MAC_MODIFIER_ORDER.indexOf(b),
  );

  return [...modifiers, ...keys].join('');
}
