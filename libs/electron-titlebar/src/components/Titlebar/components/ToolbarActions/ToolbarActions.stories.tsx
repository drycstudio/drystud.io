import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { FiBell, FiSettings, FiZap, FiCheckCircle, FiPackage, FiUserPlus, FiDownload, FiGitPullRequest, FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

import { ToolbarActions } from './ToolbarActions';
import type { TitlebarAction } from './types';

const meta = {
  title: 'Components/ToolbarActions',
  component: ToolbarActions,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A customizable action toolbar that sits between the SearchBar and UserProfile in the titlebar. Supports icon buttons with badges, tooltips, dropdowns, and highlight effects.',
      },
    },
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div style={{ backgroundColor: '#1C1C1C', padding: '8px 16px', display: 'flex', alignItems: 'center', height: '38px', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ToolbarActions>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Notifications bell with a count badge and dropdown menu. */
export const NotificationsBell: Story = {
  args: {
    actions: [
      {
        id: 'notifications',
        icon: <FiBell />,
        tooltip: 'Notifications',
        badge: 3,
        badgeVariant: 'attention',
        dropdown: [
          { label: 'Mark all as read', icon: <FiCheckCircle />, action: fn() },
          { label: '', type: 'separator' },
          { label: 'New deployment completed', icon: <FiPackage />, action: fn() },
          { label: 'Team invite from John', icon: <FiUserPlus />, action: fn() },
          { label: 'Build succeeded: v2.1.0', icon: <FiCheckCircle />, action: fn() },
        ],
      },
    ],
  },
};

/** Settings gear icon — simple click action, no dropdown. */
export const SettingsButton: Story = {
  args: {
    actions: [
      {
        id: 'settings',
        icon: <FiSettings />,
        tooltip: 'Settings',
        onClick: fn(),
      },
    ],
  },
};

/** Upgrade/update button with highlight pulse and success dot badge. */
export const UpgradeHighlight: Story = {
  args: {
    actions: [
      {
        id: 'upgrade',
        icon: <FiZap />,
        tooltip: 'Update Available — v2.1.0',
        highlight: true,
        badge: true,
        badgeVariant: 'success',
        onClick: fn(),
      },
    ],
  },
};

/** All three actions together — notifications, settings, and upgrade. */
export const FullToolbar: Story = {
  args: {
    actions: [
      {
        id: 'notifications',
        icon: <FiBell />,
        tooltip: 'Notifications',
        badge: 12,
        badgeVariant: 'attention',
        dropdown: [
          { label: 'Mark all as read', icon: <FiCheckCircle />, action: fn() },
          { label: '', type: 'separator' },
          { label: 'PR #42 approved', icon: <FiGitPullRequest />, action: fn() },
          { label: 'Download complete', icon: <FiDownload />, action: fn() },
        ],
      },
      {
        id: 'settings',
        icon: <FiSettings />,
        tooltip: 'Settings',
        onClick: fn(),
      },
      {
        id: 'upgrade',
        icon: <FiZap />,
        tooltip: 'Upgrade to Pro',
        highlight: true,
        badge: true,
        badgeVariant: 'success',
        onClick: fn(),
      },
    ],
  },
};

/** High badge count capped at 99+. */
export const HighBadgeCount: Story = {
  args: {
    actions: [
      {
        id: 'notifications',
        icon: <FiBell />,
        tooltip: '150 unread notifications',
        badge: 150,
        badgeVariant: 'attention',
        onClick: fn(),
      },
    ],
  },
};

/** Disabled action button. */
export const DisabledAction: Story = {
  args: {
    actions: [
      {
        id: 'settings',
        icon: <FiSettings />,
        tooltip: 'Settings (offline)',
        disabled: true,
      },
    ],
  },
};

/** Warning badge variant using default (blue) color. */
export const DefaultBadgeVariant: Story = {
  args: {
    actions: [
      {
        id: 'alerts',
        icon: <FiAlertTriangle />,
        tooltip: 'Alerts',
        badge: 7,
        badgeVariant: 'default',
        onClick: fn(),
      },
    ],
  },
};

/** Custom JSX via renderActions escape hatch. */
export const CustomRenderActions: Story = {
  args: {
    renderActions: () => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button
          type="button"
          style={{
            padding: '4px 10px',
            borderRadius: '4px',
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={fn()}
        >
          Upgrade
        </button>
      </div>
    ),
  },
};

const mixedActions: TitlebarAction[] = [
  {
    id: 'notifications',
    icon: <FiBell />,
    tooltip: 'Notifications',
    badge: 5,
    badgeVariant: 'attention',
    dropdown: [
      { label: 'Mark all as read', action: fn() },
    ],
  },
  {
    id: 'settings',
    icon: <FiSettings />,
    tooltip: 'Settings',
    onClick: fn(),
  },
];

/** Filled split button for software update — primary action + chevron dropdown. */
export const UpdateSplitButton: Story = {
  args: {
    actions: [
      {
        id: 'update',
        icon: <FiZap />,
        label: 'Update v2.1.0',
        variant: 'filled',
        tooltip: 'Update Available',
        badgeVariant: 'success',
        onClick: fn(),
        dropdown: [
          { label: 'Download & Update Now', icon: <FiRefreshCw />, action: fn() },
          { label: 'Download Only', icon: <FiDownload />, action: fn() },
          { label: '', type: 'separator' },
          { label: 'Release Notes', icon: <FiPackage />, action: fn() },
        ],
      },
    ],
  },
};

/** Filled split button with attention (red) variant. */
export const UpdateSplitButtonAttention: Story = {
  args: {
    actions: [
      {
        id: 'critical-update',
        icon: <FiAlertTriangle />,
        label: 'Critical Update',
        variant: 'filled',
        tooltip: 'Security patch required',
        badgeVariant: 'attention',
        onClick: fn(),
        dropdown: [
          { label: 'Update Now (Recommended)', icon: <FiRefreshCw />, action: fn() },
          { label: 'Remind Me Later', icon: <FiAlertTriangle />, action: fn() },
        ],
      },
    ],
  },
};

/** Filled button without dropdown — simple action button. */
export const FilledButtonNoDropdown: Story = {
  args: {
    actions: [
      {
        id: 'pro',
        icon: <FiZap />,
        label: 'Upgrade to Pro',
        variant: 'filled',
        tooltip: 'Unlock premium features',
        badgeVariant: 'default',
        onClick: fn(),
      },
    ],
  },
};

/** Disabled filled split button. */
export const FilledButtonDisabled: Story = {
  args: {
    actions: [
      {
        id: 'update-disabled',
        icon: <FiZap />,
        label: 'Update v2.1.0',
        variant: 'filled',
        disabled: true,
        dropdown: [
          { label: 'Download & Update Now', icon: <FiRefreshCw />, action: fn() },
        ],
      },
    ],
  },
};

/** Full toolbar combining icon buttons and a filled split button. */
export const FullToolbarWithSplitButton: Story = {
  args: {
    actions: [
      {
        id: 'notifications',
        icon: <FiBell />,
        tooltip: 'Notifications',
        badge: 5,
        badgeVariant: 'attention',
        dropdown: [
          { label: 'Mark all as read', icon: <FiCheckCircle />, action: fn() },
          { label: '', type: 'separator' },
          { label: 'PR #42 approved', icon: <FiGitPullRequest />, action: fn() },
        ],
      },
      {
        id: 'settings',
        icon: <FiSettings />,
        tooltip: 'Settings',
        onClick: fn(),
      },
      {
        id: 'update',
        icon: <FiZap />,
        label: 'Update v2.1.0',
        variant: 'filled',
        badgeVariant: 'success',
        onClick: fn(),
        dropdown: [
          { label: 'Download & Update Now', icon: <FiRefreshCw />, action: fn() },
          { label: 'Download Only', icon: <FiDownload />, action: fn() },
          { label: '', type: 'separator' },
          { label: 'Release Notes', icon: <FiPackage />, action: fn() },
        ],
      },
    ],
  },
};

/** Both data-driven actions and custom renderActions combined. */
export const MixedActionsAndCustom: Story = {
  args: {
    actions: mixedActions,
    renderActions: () => (
      <button
        type="button"
        style={{
          padding: '4px 10px',
          borderRadius: '4px',
          background: 'rgba(34, 197, 94, 0.2)',
          color: '#22C55E',
          fontSize: '11px',
          fontWeight: 600,
          border: '1px solid rgba(34, 197, 94, 0.3)',
          cursor: 'pointer',
          marginLeft: '4px',
        }}
        onClick={fn()}
      >
        v2.1.0 Available
      </button>
    ),
  },
};
