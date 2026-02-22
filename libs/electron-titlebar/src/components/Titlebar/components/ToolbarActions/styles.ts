import { styled, keyframes } from '@stitches/react';

const pulse = keyframes({
  '0%': { boxShadow: '0 0 0 0 rgba(79, 70, 229, 0.4)' },
  '70%': { boxShadow: '0 0 0 6px rgba(79, 70, 229, 0)' },
  '100%': { boxShadow: '0 0 0 0 rgba(79, 70, 229, 0)' },
});

export const ActionsContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  gap: '2px',
  flexShrink: 0,
  appRegion: 'no-drag',
  paddingLeft: '4px',
  paddingRight: '4px',

  '@media (max-width: 540px)': {
    gap: '0px',
    paddingLeft: '2px',
    paddingRight: '2px',
  },
});

export const ActionItemWrapper = styled('div', {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  zIndex: 1000,
});

export const ActionButton = styled('button', {
  '&&': {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '28px',
    minWidth: '28px',
    padding: '0 6px',
    margin: 0,
    borderRadius: '6px',
    color: 'rgba(255, 255, 255, 0.7)',
    transition: 'background-color 100ms ease, color 100ms ease',

    '& svg': {
      width: '15px',
      height: '15px',
      flexShrink: 0,
    },

    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      color: 'rgba(255, 255, 255, 0.95)',
    },

    '&:active': {
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
    },

    '&:focus-visible': {
      outline: '2px solid rgba(79, 70, 229, 0.6)',
      outlineOffset: '-2px',
    },

    '&:disabled': {
      opacity: 0.4,
      cursor: 'default',
      '&:hover': {
        backgroundColor: 'transparent',
        color: 'rgba(255, 255, 255, 0.7)',
      },
    },
  },

  variants: {
    active: {
      true: {
        '&&': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          color: 'rgba(255, 255, 255, 0.95)',
        },
      },
    },
    highlight: {
      true: {
        '&&': {
          animation: `${pulse} 2s infinite`,
          color: 'rgba(255, 255, 255, 0.95)',
        },
      },
    },
  },
});

export const Badge = styled('span', {
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 600,
  lineHeight: 1,
  pointerEvents: 'none',

  variants: {
    variant: {
      default: { backgroundColor: '#4F46E5' },
      attention: { backgroundColor: '#EF4444' },
      success: { backgroundColor: '#22C55E' },
    },
    kind: {
      dot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        top: '4px',
        right: '3px',
        border: '1.5px solid #1C1C1C',
      },
      count: {
        minWidth: '16px',
        height: '14px',
        padding: '0 4px',
        borderRadius: '7px',
        fontSize: '9px',
        fontFamily: 'inherit',
        color: '#fff',
        top: '1px',
        right: '-2px',
        border: '1.5px solid #1C1C1C',
      },
    },
  },

  defaultVariants: {
    variant: 'default',
    kind: 'dot',
  },
});

export const Tooltip = styled('div', {
  position: 'absolute',
  top: 'calc(100% + 4px)',
  left: '50%',
  transform: 'translateX(-50%)',
  padding: '4px 8px',
  backgroundColor: '#3D3D3D',
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '11px',
  fontFamily: 'inherit',
  borderRadius: '4px',
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
  zIndex: 1002,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
});

export const ActionDropdown = styled('div', {
  position: 'absolute',
  top: '100%',
  right: 0,
  minWidth: '200px',
  maxWidth: 'calc(100vw - 16px)',
  backgroundColor: '#2D2D2D',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '8px',
  padding: '6px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3)',
  zIndex: 1001,
});

export const DropdownItem = styled('button', {
  '&&': {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    padding: '8px 12px',
    margin: 0,
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'left',
    whiteSpace: 'nowrap',
    borderRadius: '4px',
    transition: 'background-color 80ms ease',

    '& svg': {
      width: '14px',
      height: '14px',
      flexShrink: 0,
      opacity: 0.7,
    },

    '&:hover, &[data-focused]': {
      backgroundColor: 'rgba(79, 70, 229, 0.3)',
    },

    '&:disabled': {
      opacity: 0.4,
      cursor: 'default',
      '&:hover, &[data-focused]': {
        backgroundColor: 'transparent',
      },
    },
  },
});

export const DropdownSeparator = styled('div', {
  height: '1px',
  backgroundColor: 'rgba(255, 255, 255, 0.08)',
  margin: '4px 6px',
});

export const SplitButtonContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  height: '26px',
  borderRadius: '6px',
  overflow: 'hidden',
  flexShrink: 0,

  variants: {
    variant: {
      default: { backgroundColor: '#4F46E5' },
      attention: { backgroundColor: '#EF4444' },
      success: { backgroundColor: '#22C55E' },
    },
    disabled: {
      true: { opacity: 0.4 },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const SplitMainButton = styled('button', {
  '&&': {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    height: '100%',
    padding: '0 10px',
    margin: 0,
    fontSize: '11px',
    fontWeight: 600,
    fontFamily: 'inherit',
    color: '#fff',
    backgroundColor: 'transparent',
    transition: 'background-color 100ms ease',
    whiteSpace: 'nowrap',

    '& svg': {
      width: '13px',
      height: '13px',
      flexShrink: 0,
    },

    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    '&:active': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    '&:disabled': {
      cursor: 'default',
      '&:hover': { backgroundColor: 'transparent' },
    },
  },
});

export const SplitDivider = styled('div', {
  width: '1px',
  height: '16px',
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
  flexShrink: 0,
});

export const SplitChevronButton = styled('button', {
  '&&': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '24px',
    padding: 0,
    margin: 0,
    backgroundColor: 'transparent',
    color: '#fff',
    transition: 'background-color 100ms ease',

    '& svg': {
      width: '12px',
      height: '12px',
    },

    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    '&:active': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    '&:disabled': {
      cursor: 'default',
      '&:hover': { backgroundColor: 'transparent' },
    },
  },
});

export const ActionSeparator = styled('div', {
  width: '1px',
  height: '16px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  marginLeft: '4px',
  marginRight: '4px',
  flexShrink: 0,
});
