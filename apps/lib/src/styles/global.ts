import { globalCss } from '@stitches/react';

export const globalStyles = globalCss({
  '*': { margin: 0, padding: 0, border: '0 solid', boxSizing: 'border-box' },
  html: {
    textSizeAdjust: '100%',
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji',
    lineHeight: 1.5,
    tabSize: 4,
  },
  body: {
    lineHeight: 'inherit',
    margin: 0,
  },
  button: {
    color: 'inherit',
    fontFamily: 'inherit',
    fontSize: '100%',
    lineHeight: 'inherit',
    margin: 0,
    padding: 0,
    appearance: 'button',
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    cursor: 'pointer',
    '&:disabled': {
      cursor: 'default',
    },
  },
});
