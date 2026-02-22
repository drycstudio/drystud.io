import { styled, keyframes } from '@stitches/react';

/* ── Trigger (titlebar pill) ─────────────────────────────── */

export const Container = styled('div', {
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  zIndex: 1000,
  minWidth: 0,
  padding: '0 4px',
  overflow: 'hidden',

  variants: {
    centered: {
      true: {
        flex: '1 1 0',
        minWidth: '48px',
        justifyContent: 'center',
      },
      false: {
        flexShrink: 1,
        minWidth: '48px',
      },
    },
  },
});

export const InputWrapper = styled('button', {
  '&&': {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    height: '26px',
    padding: '0 8px',
    margin: 0,
    appRegion: 'no-drag',
    minWidth: '180px',
    maxWidth: '340px',
    width: '340px',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '6px',
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: '12px',
    cursor: 'text',
    transition: 'all 150ms ease',

    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderColor: 'rgba(255, 255, 255, 0.15)',
    },

    '&:focus-visible': {
      outline: '2px solid rgba(79, 70, 229, 0.6)',
      outlineOffset: '-1px',
    },

    '@media (max-width: 640px)': {
      width: '220px',
      minWidth: '140px',
    },

    '@media (max-width: 480px)': {
      minWidth: '100px',
      width: 'auto',
      gap: '4px',
      padding: '0 6px',
    },
  },

  variants: {
    active: {
      true: {
        '&&': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(79, 70, 229, 0.5)',
          color: 'rgba(255, 255, 255, 0.9)',
        },
      },
    },
  },
});

export const SearchIcon = styled('span', {
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  opacity: 0.5,
});

export const PlaceholderText = styled('span', {
  flexGrow: 1,
  textAlign: 'left',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',

  '@media (max-width: 480px)': {
    display: 'none',
  },
});

export const ShortcutBadge = styled('kbd', {
  '&&': {
    display: 'inline-flex',
    alignItems: 'center',
    height: '18px',
    padding: '0 5px',
    margin: 0,
    fontSize: '10px',
    fontFamily: 'inherit',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.35)',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '3px',
    lineHeight: 1,
    whiteSpace: 'nowrap',
    flexShrink: 0,

    '@media (max-width: 480px)': {
      display: 'none',
    },
  },
});

/* ── Overlay + Palette shell ─────────────────────────────── */

export const Overlay = styled('div', {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1_000_000_000,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  paddingTop: '4px',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif',
  lineHeight: 1.5,
  color: 'rgba(255, 255, 255, 0.9)',

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
  },
  '& input': {
    color: 'inherit',
    fontFamily: 'inherit',
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
  },
});

export const PaletteContainer = styled('div', {
  '&&': {
    width: '100%',
    maxWidth: '680px',
    maxHeight: 'min(520px, 80vh)',
    backgroundColor: '#2D2D2D',
    borderRadius: '10px',
    boxShadow: '0 16px 64px rgba(0, 0, 0, 0.6), 0 4px 16px rgba(0, 0, 0, 0.4)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',

    '@media (max-width: 720px)': {
      maxWidth: '100%',
      borderRadius: '0 0 8px 8px',
    },
  },
});

export const PaletteInputWrapper = styled('div', {
  '&&': {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    height: '58px',
    padding: '0 16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  },
});

export const PaletteInputIcon = styled('span', {
  '&&': {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: '16px',
  },
});

export const PaletteInput = styled('input', {
  '&&': {
    flex: 1,
    height: '100%',
    padding: 0,
    margin: 0,
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: 0,
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',

    '&::placeholder': {
      color: 'rgba(255, 255, 255, 0.35)',
    },
  },
});

/* ── Filter chips ────────────────────────────────────────── */

export const FilterBar = styled('div', {
  '&&': {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    flexWrap: 'wrap',
  },
});

export const FilterChipButton = styled('button', {
  '&&': {
    display: 'inline-flex',
    alignItems: 'center',
    height: '24px',
    padding: '0 10px',
    margin: 0,
    fontSize: '11px',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.6)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 100ms ease',
    whiteSpace: 'nowrap',

    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderColor: 'rgba(255, 255, 255, 0.15)',
    },

    '&:focus-visible': {
      outline: '2px solid rgba(79, 70, 229, 0.6)',
      outlineOffset: '-1px',
    },
  },

  variants: {
    active: {
      true: {
        '&&': {
          backgroundColor: 'rgba(79, 70, 229, 0.25)',
          borderColor: 'rgba(79, 70, 229, 0.4)',
          color: 'rgba(255, 255, 255, 0.9)',
        },
      },
    },
  },
});

/* ── Results area ────────────────────────────────────────── */

export const PaletteResults = styled('div', {
  '&&': {
    overflowY: 'auto',
    padding: '4px 6px',
    flex: 1,

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
  },
});

export const SectionHeader = styled('div', {
  '&&': {
    padding: '8px 12px 4px',
    fontSize: '11px',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    userSelect: 'none',
  },
});

export const PaletteItem = styled('button', {
  '&&': {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    padding: '7px 12px',
    margin: 0,
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.85)',
    backgroundColor: 'transparent',
    textAlign: 'left',
    borderRadius: '6px',
    border: 'none',
    transition: 'background-color 80ms ease',
    cursor: 'pointer',

    '&:hover': {
      backgroundColor: 'rgba(79, 70, 229, 0.3)',
    },

    '&:disabled': {
      opacity: 0.4,
      cursor: 'default',
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
  },

  variants: {
    focused: {
      true: {
        '&&': {
          backgroundColor: 'rgba(79, 70, 229, 0.3)',
        },
      },
    },
  },
});

export const ItemIcon = styled('span', {
  '&&': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    flexShrink: 0,
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '14px',
  },
});

export const ItemContent = styled('div', {
  '&&': {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
  },
});

export const ItemLabel = styled('span', {
  '&&': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: '13px',
  },
});

export const ItemDescription = styled('span', {
  '&&': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: '11px',
  },
});

export const ItemTrailing = styled('div', {
  '&&': {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
    marginLeft: 'auto',
  },
});

export const ItemBadge = styled('span', {
  '&&': {
    display: 'inline-flex',
    alignItems: 'center',
    height: '18px',
    padding: '0 6px',
    fontSize: '10px',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.6)',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '3px',
    whiteSpace: 'nowrap',
  },
});

export const ItemMetadata = styled('span', {
  '&&': {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.3)',
    whiteSpace: 'nowrap',
  },
});

export const ItemShortcut = styled('span', {
  '&&': {
    fontSize: '11px',
    opacity: 0.4,
    flexShrink: 0,
    color: 'rgba(255, 255, 255, 0.85)',
  },
});

/* ── Footer ──────────────────────────────────────────────── */

export const Footer = styled('div', {
  '&&': {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    flexWrap: 'wrap',
  },
});

export const FooterActionButton = styled('button', {
  '&&': {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    height: '28px',
    padding: '0 10px',
    margin: 0,
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.6)',
    backgroundColor: 'transparent',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 100ms ease',
    whiteSpace: 'nowrap',

    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
      color: 'rgba(255, 255, 255, 0.9)',
    },
  },
});

/* ── Loading ─────────────────────────────────────────────── */

const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

export const LoadingContainer = styled('div', {
  '&&': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
  },
});

export const LoadingSpinner = styled('div', {
  '&&': {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    borderTopColor: 'rgba(79, 70, 229, 0.6)',
    borderRadius: '50%',
    animation: `${spin} 600ms linear infinite`,
  },
});

/* ── Empty state ─────────────────────────────────────────── */

export const EmptyState = styled('div', {
  '&&': {
    padding: '24px 16px',
    textAlign: 'center',
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.35)',
  },
});
