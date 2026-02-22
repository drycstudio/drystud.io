export default function setup() {
  if ('type' in process && process.type !== 'browser') {
    console.warn('!Titlebar Alert!: type is not supported');
  }
}

export function getTitlebarOptions() {
  const isMac = process.platform === 'darwin';

  return {
    frame: false,
    titleBarStyle: isMac ? ('hiddenInset' as const) : ('hidden' as const),
    ...(isMac && { trafficLightPosition: { x: 10, y: 10 } }),
  };
}
