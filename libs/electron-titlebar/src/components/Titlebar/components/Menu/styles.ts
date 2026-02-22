import { styled } from '@stitches/react';

export const MenuContainer = styled('nav', {
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  appRegion: 'no-drag',
  position: 'relative',
  zIndex: 1000,
  padding: '0 4px',
  gap: '2px',
  flexShrink: 1,
  minWidth: 0,
});

export const MenuItemButton = styled('button', {
  '&&': {
    display: 'flex',
    alignItems: 'center',
    height: '26px',
    padding: '0 10px',
    margin: 0,
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.85)',
    whiteSpace: 'nowrap',
    borderRadius: '4px',
    transition: 'background-color 100ms ease',
    flexShrink: 0,

    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },

    '&:focus-visible': {
      outline: '2px solid rgba(79, 70, 229, 0.6)',
      outlineOffset: '-2px',
    },

    '@media (max-width: 640px)': {
      padding: '0 6px',
      fontSize: '12px',
    },
  },

  variants: {
    active: {
      true: {
        '&&': {
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
        },
      },
    },
    disabled: {
      true: {
        '&&': {
          opacity: 0.4,
          pointerEvents: 'none',
        },
      },
    },
  },
});

export const OverflowButton = styled('button', {
  '&&': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '26px',
    width: '28px',
    margin: 0,
    padding: 0,
    fontSize: '18px',
    color: 'rgba(255, 255, 255, 0.65)',
    borderRadius: '4px',
    transition: 'background-color 100ms ease',
    flexShrink: 0,
    lineHeight: 1,

    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      color: 'rgba(255, 255, 255, 0.9)',
    },

    '&:focus-visible': {
      outline: '2px solid rgba(79, 70, 229, 0.6)',
      outlineOffset: '-2px',
    },
  },

  variants: {
    active: {
      true: {
        '&&': {
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
          color: 'rgba(255, 255, 255, 0.9)',
        },
      },
    },
  },
});

export const OverflowGroupLabel = styled('div', {
  '&&': {
    padding: '6px 12px 2px',
    fontSize: '11px',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    userSelect: 'none',
  },
});

export const Dropdown = styled('div', {
  position: 'absolute',
  top: '100%',
  left: 0,
  minWidth: '220px',
  maxWidth: 'calc(100vw - 16px)',
  maxHeight: 'calc(100vh - 48px)',
  overflowY: 'auto',
  backgroundColor: '#2D2D2D',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '8px',
  padding: '6px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3)',
  zIndex: 1001,

  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
});

export const DropdownItem = styled('button', {
  '&&': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '24px',
    width: '100%',
    padding: '8px 12px',
    margin: 0,
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'left',
    whiteSpace: 'nowrap',
    borderRadius: '4px',
    transition: 'background-color 80ms ease',

    '&:hover': {
      backgroundColor: 'rgba(79, 70, 229, 0.3)',
    },

    '&:focus-visible': {
      outline: '2px solid rgba(79, 70, 229, 0.6)',
      outlineOffset: '-2px',
    },
  },

  variants: {
    disabled: {
      true: {
        '&&': {
          opacity: 0.4,
          pointerEvents: 'none',
        },
      },
    },
    focused: {
      true: {
        '&&': {
          backgroundColor: 'rgba(79, 70, 229, 0.3)',
        },
      },
    },
  },
});

export const Separator = styled('div', {
  height: '1px',
  backgroundColor: 'rgba(255, 255, 255, 0.08)',
  margin: '4px 6px',
});

export const Shortcut = styled('span', {
  marginLeft: 'auto',
  fontSize: '11px',
  opacity: 0.4,
  fontFamily: 'inherit',
  letterSpacing: '0.02em',
});

export const SubMenuWrapper = styled('div', {
  position: 'relative',
});

export const SubMenuDropdown = styled('div', {
  position: 'fixed',
  minWidth: '220px',
  maxWidth: 'calc(100vw - 16px)',
  maxHeight: 'calc(100vh - 48px)',
  overflowY: 'auto',
  backgroundColor: '#2D2D2D',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '8px',
  padding: '6px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3)',
  zIndex: 1002,

  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
});

export const ChevronIndicator = styled('span', {
  marginLeft: 'auto',
  fontSize: '10px',
  opacity: 0.5,
  lineHeight: 1,
  paddingLeft: '8px',
});
