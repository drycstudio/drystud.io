import { styled } from '@stitches/react';

export const Menu = styled('div', {
  width: '58px',
  flexShrink: 0,
});

export const Title = styled('div', {
  flex: '1 1 0',
  minWidth: 0,
  textAlign: 'center',
  overflow: 'hidden',
});

export const Text = styled('h6', {
  margin: 0,
  padding: 0,
  fontSize: '13px',
  fontWeight: 400,
  opacity: 0.7,
  letterSpacing: '0.01em',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});
