import { styled } from '@stitches/react';

export const Container = styled('div', {
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  position: 'relative',
  appRegion: 'no-drag',
  zIndex: 1000,
  marginRight: '8px',
  flexShrink: 0,

  '@media (max-width: 540px)': {
    marginRight: '4px',
  },
});

export const AvatarButton = styled('button', {
  '&&': {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    height: '28px',
    padding: '0 8px',
    margin: 0,
    borderRadius: '4px',
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.85)',
    transition: 'background-color 100ms ease',
    whiteSpace: 'nowrap',

    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },

    '&:focus-visible': {
      outline: '2px solid rgba(79, 70, 229, 0.6)',
      outlineOffset: '-2px',
    },
  },
});

export const AvatarImage = styled('img', {
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  objectFit: 'cover',
});

export const AvatarFallback = styled('div', {
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  backgroundColor: 'rgba(79, 70, 229, 0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '10px',
  fontWeight: 600,
  color: '#fff',
  textTransform: 'uppercase',
  lineHeight: 1,
});

const STATUS_COLORS: Record<string, string> = {
  online: '#22c55e',
  away: '#eab308',
  busy: '#ef4444',
  offline: '#6b7280',
};

export const StatusDot = styled('span', {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  border: '1.5px solid #1C1C1C',
  position: 'absolute',
  bottom: '0',
  right: '0',

  variants: {
    status: Object.fromEntries(
      Object.entries(STATUS_COLORS).map(([key, color]) => [key, { backgroundColor: color }]),
    ),
  },

  defaultVariants: {
    status: 'offline',
  },
});

export const SignInButton = styled('button', {
  '&&': {
    display: 'flex',
    alignItems: 'center',
    height: '26px',
    padding: '0 12px',
    margin: 0,
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.7)',
    borderRadius: '4px',
    transition: 'background-color 100ms ease',
    whiteSpace: 'nowrap',

    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      color: 'rgba(255, 255, 255, 0.9)',
    },

    '&:focus-visible': {
      outline: '2px solid rgba(79, 70, 229, 0.6)',
      outlineOffset: '-2px',
    },
  },
});

export const Dropdown = styled('div', {
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

export const UserHeader = styled('div', {
  padding: '8px 12px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  marginBottom: '4px',
});

export const UserName = styled('div', {
  fontSize: '13px',
  fontWeight: 500,
  color: 'rgba(255, 255, 255, 0.9)',
});

export const UserEmail = styled('div', {
  fontSize: '11px',
  color: 'rgba(255, 255, 255, 0.5)',
  marginTop: '2px',
});

export const DropdownItem = styled('button', {
  '&&': {
    display: 'flex',
    alignItems: 'center',
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
  },
});

export const Separator = styled('div', {
  height: '1px',
  backgroundColor: 'rgba(255, 255, 255, 0.08)',
  margin: '4px 6px',
});
