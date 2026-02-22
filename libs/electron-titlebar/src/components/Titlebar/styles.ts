import { css, styled } from '@stitches/react';

const DIMENSIONS = {
  default: '38px',
  small: '32px',
};

export const htmlTagStyles = css({
  variants: {
    size: {
      default: {
        paddingTop: DIMENSIONS.default,
      },
      small: {
        paddingTop: DIMENSIONS.small,
      },
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export const TitlebarContainer = styled('div', {
  width: '100%',
  alignItems: 'center',
  backgroundColor: '#1C1C1C',
  color: 'rgba(255, 255, 255, 0.9)',
  display: 'flex',
  flexWrap: 'nowrap',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 999_999_999,
  overflow: 'visible',
  appRegion: 'drag',
  userSelect: 'none',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji',
  lineHeight: 1.5,

  '& *': {
    margin: 0,
    padding: 0,
    border: '0 solid',
    boxSizing: 'border-box',
  },
  '& button': {
    color: 'inherit',
    fontFamily: 'inherit',
    fontSize: '100%',
    lineHeight: 'inherit',
    appearance: 'button',
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    cursor: 'pointer',
    border: 'none',
    '&:disabled': {
      cursor: 'default',
    },
  },

  variants: {
    size: {
      default: {
        height: DIMENSIONS.default,
      },
      small: {
        height: DIMENSIONS.small,
      },
    },
    platform: {
      macos: {
        paddingLeft: '70px',
      },
      windows: {},
      linux: {},
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export const Logo = styled('div', {
  alignContent: 'center',
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  height: '100%',
  width: '36px',
  flexShrink: 0,
  appRegion: 'no-drag',
});

export const LogoImage = styled('img', {
  height: '20px',
  width: '20px',
  padding: 0,
  objectFit: 'contain',
});
