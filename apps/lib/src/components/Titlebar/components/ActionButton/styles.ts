import { css } from '@stitches/core';
import { styled } from '@stitches/react';

export const actionButtonIconStyle = css({
  flex: '1 1 0%',
  height: '100%',
  width: '100%',
  padding: '8px',
});

export const ButtonContainer = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  height: '100%',
});

export const Button = styled('button', {
  alignContent: 'center',
  alignItems: 'center',
  display: 'flex',
  height: '100%',
  margin: 0,
  overflow: 'hidden',
  textAlign: 'center',
  width: '48px',
  transition: 'all 0.3s ease',

  variants: {
    type: {
      default: {
        '&:hover': {
          backgroundColor: 'rgb(95 95 163)',
        },
      },
      close: {
        '&:hover': {
          backgroundColor: '#cd0000',
        },
      },
    },
  },

  defaultVariants: {
    type: 'default',
  },

  [`& .${actionButtonIconStyle}`]: {
    transitionDuration: '0.2s',
    transitionProperty: 'all',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',

    '&:hover': {
      scale: 1.25,
      transitionDuration: '0.3s',
    },
    '&:active': {
      scale: 0.95,
    },
  },
});
