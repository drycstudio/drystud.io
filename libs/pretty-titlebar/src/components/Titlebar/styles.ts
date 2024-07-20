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
  alignContent: 'space-between',
  alignItems: 'center',
  backgroundColor: 'rgb(27, 27, 47 , 1)',
  color: 'rgb(255, 255, 255 , 1)',
  display: 'flex',
  flexWrap: 'wrap',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 999_999_999,
  variants: {
    size: {
      default: {
        height: DIMENSIONS.default,
      },
      small: {
        height: DIMENSIONS.small,
      },
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
  height: '100%',
  width: '38px',
});

export const LogoImage = styled('img', {
  flex: '1 1 0%',
  height: '38px',
  padding: '6px',
  width: '38px',
});
