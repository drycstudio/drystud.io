import { styled, keyframes } from '@stitches/react';

const fadeIn = keyframes({
  from: { opacity: 0, transform: 'translateY(-4px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

export const NotificationPanelRoot = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '420px',
  animation: `${fadeIn} 120ms ease-out`,
});

export const NotificationHeader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 14px 8px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
  flexShrink: 0,
});

export const NotificationTitle = styled('span', {
  fontSize: '12px',
  fontWeight: 600,
  color: 'rgba(255, 255, 255, 0.5)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

export const NotificationHeaderActions = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
});

export const NotificationHeaderButton = styled('button', {
  '&&': {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '3px 8px',
    margin: 0,
    fontSize: '11px',
    fontFamily: 'inherit',
    color: 'rgba(79, 70, 229, 0.9)',
    borderRadius: '4px',
    transition: 'background-color 80ms ease',

    '&:hover': {
      backgroundColor: 'rgba(79, 70, 229, 0.15)',
      color: '#7C6FF7',
    },

    '& svg': {
      width: '12px',
      height: '12px',
    },
  },
});

export const NotificationList = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
  overflowX: 'hidden',
  padding: '4px 6px',
  flex: 1,

  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(255, 255, 255, 0.12)',
    borderRadius: '4px',
  },
});

export const NotificationItem = styled('button', {
  '&&': {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    width: '100%',
    padding: '10px 10px',
    margin: 0,
    textAlign: 'left',
    borderRadius: '6px',
    transition: 'background-color 80ms ease',
    position: 'relative',

    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
  },

  variants: {
    unread: {
      true: {
        '&&': {
          backgroundColor: 'rgba(79, 70, 229, 0.06)',
          '&:hover': {
            backgroundColor: 'rgba(79, 70, 229, 0.12)',
          },
        },
      },
    },
  },
});

export const NotificationDot = styled('span', {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  flexShrink: 0,
  marginTop: '5px',

  variants: {
    variant: {
      info: { backgroundColor: '#3B82F6' },
      success: { backgroundColor: '#22C55E' },
      warning: { backgroundColor: '#F59E0B' },
      error: { backgroundColor: '#EF4444' },
      default: { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
    },
  },

  defaultVariants: {
    variant: 'default',
  },
});

export const NotificationIcon = styled('span', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  borderRadius: '6px',
  flexShrink: 0,

  '& svg': {
    width: '14px',
    height: '14px',
  },

  variants: {
    variant: {
      info: {
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        color: '#60A5FA',
      },
      success: {
        backgroundColor: 'rgba(34, 197, 94, 0.15)',
        color: '#4ADE80',
      },
      warning: {
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        color: '#FBBF24',
      },
      error: {
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        color: '#F87171',
      },
      default: {
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        color: 'rgba(255, 255, 255, 0.6)',
      },
    },
  },

  defaultVariants: {
    variant: 'default',
  },
});

export const NotificationContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  flex: 1,
  minWidth: 0,
});

export const NotificationItemTitle = styled('span', {
  fontSize: '13px',
  fontWeight: 500,
  color: 'rgba(255, 255, 255, 0.9)',
  lineHeight: 1.3,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const NotificationDescription = styled('span', {
  fontSize: '12px',
  color: 'rgba(255, 255, 255, 0.45)',
  lineHeight: 1.4,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
});

export const NotificationMeta = styled('span', {
  fontSize: '11px',
  color: 'rgba(255, 255, 255, 0.3)',
  marginTop: '2px',
});

export const NotificationBadge = styled('span', {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '1px 6px',
  fontSize: '10px',
  fontWeight: 600,
  fontFamily: 'inherit',
  borderRadius: '3px',
  lineHeight: 1.4,
  flexShrink: 0,
  marginTop: '2px',

  variants: {
    variant: {
      info: {
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        color: '#60A5FA',
      },
      success: {
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        color: '#4ADE80',
      },
      warning: {
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        color: '#FBBF24',
      },
      error: {
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        color: '#F87171',
      },
      default: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        color: 'rgba(255, 255, 255, 0.5)',
      },
    },
  },

  defaultVariants: {
    variant: 'default',
  },
});

export const NotificationSeparator = styled('div', {
  height: '1px',
  backgroundColor: 'rgba(255, 255, 255, 0.06)',
  margin: '4px 8px',
});

export const NotificationFooter = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '8px 14px',
  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
  flexShrink: 0,
});

export const NotificationFooterButton = styled('button', {
  '&&': {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    margin: 0,
    fontSize: '12px',
    fontFamily: 'inherit',
    color: 'rgba(79, 70, 229, 0.9)',
    borderRadius: '4px',
    transition: 'background-color 80ms ease',

    '&:hover': {
      backgroundColor: 'rgba(79, 70, 229, 0.15)',
      color: '#7C6FF7',
    },

    '& svg': {
      width: '13px',
      height: '13px',
    },
  },
});

export const NotificationEmpty = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '28px 16px',
  gap: '8px',

  '& svg': {
    width: '28px',
    height: '28px',
    color: 'rgba(255, 255, 255, 0.15)',
  },
});

export const NotificationEmptyText = styled('span', {
  fontSize: '13px',
  color: 'rgba(255, 255, 255, 0.3)',
});

export const NotificationGroup = styled('div', {
  display: 'flex',
  flexDirection: 'column',
});

export const NotificationGroupLabel = styled('div', {
  padding: '6px 14px 4px',
  fontSize: '11px',
  fontWeight: 600,
  color: 'rgba(255, 255, 255, 0.35)',
  textTransform: 'uppercase',
  letterSpacing: '0.3px',
});
