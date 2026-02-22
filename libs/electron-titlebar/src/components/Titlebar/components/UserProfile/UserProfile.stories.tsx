import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { UserProfile } from './UserProfile';

const meta = {
  title: 'Components/UserProfile',
  component: UserProfile,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: `User profile widget for the titlebar's right side. Supports two states:

- **Logged in** — Shows avatar (image or initials fallback), optional status dot, and a dropdown with custom actions and sign-out button.
- **Logged out** — Shows a "Sign In" button with a user icon.

When no \`user\` prop and no \`onSignIn\` handler are provided, nothing is rendered.`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    user: {
      description: 'User info object. Pass `null` or `undefined` for logged-out state.',
    },
    actions: {
      description: 'Custom dropdown actions (e.g., My Account, Settings).',
    },
    onSignIn: {
      action: 'onSignIn',
      description: 'Callback for the Sign In button (logged-out state).',
    },
    onSignOut: {
      action: 'onSignOut',
      description: 'Callback for the Sign Out button in the dropdown.',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ height: '300px', backgroundColor: '#1C1C1C', display: 'flex', alignItems: 'flex-start', padding: '6px', justifyContent: 'flex-end', minWidth: '300px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof UserProfile>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Logged-in user with initials avatar and online status. */
export const LoggedInWithInitials: Story = {
  args: {
    user: {
      name: 'Euclides Dry',
      email: 'euclides@drycstudio.io',
      status: 'online',
    },
    actions: [
      { label: 'My Account', action: fn() },
      { label: 'Settings', action: fn() },
      { type: 'separator', label: 'sep' },
      { label: 'Switch Workspace', action: fn() },
    ],
    onSignOut: fn(),
  },
};

/** Logged-in user with a custom avatar image. */
export const LoggedInWithAvatar: Story = {
  args: {
    user: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Jane',
      status: 'online',
    },
    actions: [
      { label: 'My Account', action: fn() },
      { label: 'Preferences', action: fn() },
    ],
    onSignOut: fn(),
  },
};

/** Away status indicator (yellow dot). */
export const StatusAway: Story = {
  args: {
    user: {
      name: 'John Doe',
      email: 'john@example.com',
      status: 'away',
    },
    onSignOut: fn(),
  },
};

/** Busy status indicator (red dot). */
export const StatusBusy: Story = {
  args: {
    user: {
      name: 'Alice Dev',
      status: 'busy',
    },
    onSignOut: fn(),
  },
};

/** Offline status indicator (gray dot). */
export const StatusOffline: Story = {
  args: {
    user: {
      name: 'Bob Builder',
      status: 'offline',
    },
    onSignOut: fn(),
  },
};

/** User without status indicator. */
export const NoStatus: Story = {
  args: {
    user: {
      name: 'No Status User',
      email: 'nostatus@example.com',
    },
    actions: [{ label: 'Settings', action: fn() }],
    onSignOut: fn(),
  },
};

/** Logged-out state — shows "Sign In" button. */
export const LoggedOut: Story = {
  args: {
    user: null,
    onSignIn: fn(),
  },
};

/** No user and no onSignIn — renders nothing. */
export const Hidden: Story = {
  args: {
    user: null,
  },
};
