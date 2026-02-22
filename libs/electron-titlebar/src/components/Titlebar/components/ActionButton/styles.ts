import { css } from '@stitches/core';
import { styled } from '@stitches/react';

export const actionButtonIconStyle = css({
  flex: '1 1 0%',
  height: '100%',
  width: '100%',
  padding: '10px',
});

export const ButtonContainer = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  height: '100%',
  flexShrink: 0,
});

export const Button = styled('button', {
  alignContent: 'center',
  alignItems: 'center',
  display: 'flex',
  height: '100%',
  margin: 0,
  overflow: 'hidden',
  textAlign: 'center',
  width: '46px',

  '&:focus-visible': {
    outline: '2px solid rgba(79, 70, 229, 0.6)',
    outlineOffset: '-2px',
  },

  '@media (max-width: 540px)': {
    width: '36px',
  },
  transition: 'background-color 150ms ease',

  variants: {
    type: {
      default: {
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
        },
      },
      close: {
        '&:hover': {
          backgroundColor: '#e81123',
        },
      },
    },
  },

  defaultVariants: {
    type: 'default',
  },

  [`& .${actionButtonIconStyle}`]: {
    transitionDuration: '0.15s',
    transitionProperty: 'transform',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',

    '&:hover': {
      scale: 1.1,
    },
    '&:active': {
      scale: 0.95,
    },
  },
});
