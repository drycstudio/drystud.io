import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { FiBell, FiSettings, FiZap, FiCheckCircle, FiPackage, FiUserPlus, FiDownload, FiRefreshCw } from 'react-icons/fi';
import Titlebar from './Titlebar';
import type { MenuItem } from './components/Menu';
import type { TitlebarAction } from './components/ToolbarActions';

const sampleMenuItems: MenuItem[] = [
  {
    label: 'File',
    submenu: [
      { label: 'New File', shortcut: 'Ctrl+N', action: fn() },
      { label: 'New Window', shortcut: 'Ctrl+Shift+N', action: fn() },
      { type: 'separator', label: '' },
      { label: 'Open File...', shortcut: 'Ctrl+O', action: fn() },
      { label: 'Open Recent', disabled: true, action: fn() },
      { type: 'separator', label: '' },
      { label: 'Save', shortcut: 'Ctrl+S', action: fn() },
      { label: 'Save As...', shortcut: 'Ctrl+Shift+S', action: fn() },
      { type: 'separator', label: '' },
      { label: 'Preferences', shortcut: 'Ctrl+,', action: fn() },
      { type: 'separator', label: '' },
      { label: 'Exit', shortcut: 'Alt+F4', action: fn() },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      { label: 'Undo', shortcut: 'Ctrl+Z', action: fn() },
      { label: 'Redo', shortcut: 'Ctrl+Shift+Z', action: fn() },
      { type: 'separator', label: '' },
      { label: 'Cut', shortcut: 'Ctrl+X', action: fn() },
      { label: 'Copy', shortcut: 'Ctrl+C', action: fn() },
      { label: 'Paste', shortcut: 'Ctrl+V', action: fn() },
      { type: 'separator', label: '' },
      { label: 'Find', shortcut: 'Ctrl+F', action: fn() },
      { label: 'Select All', shortcut: 'Ctrl+A', action: fn() },
    ],
  },
  {
    label: 'View',
    submenu: [
      { label: 'Toggle Full Screen', shortcut: 'F11', action: fn() },
      { label: 'Toggle Developer Tools', shortcut: 'F12', action: fn() },
      { type: 'separator', label: '' },
      { label: 'Zoom In', shortcut: 'Ctrl+=', action: fn() },
      { label: 'Zoom Out', shortcut: 'Ctrl+-', action: fn() },
      { label: 'Reset Zoom', shortcut: 'Ctrl+0', action: fn() },
    ],
  },
  {
    label: 'Help',
    submenu: [
      { label: 'Documentation', action: fn() },
      { label: 'Release Notes', action: fn() },
      { type: 'separator', label: '' },
      { label: 'About', action: fn() },
    ],
  },
];

const meta = {
  title: 'Components/Titlebar',
  component: Titlebar,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Window title displayed in the center of the titlebar.',
    },
    logo: {
      control: 'text',
      description: 'Custom logo URL. Falls back to the built-in Electron logo.',
    },
    size: {
      control: 'radio',
      options: ['default', 'small'],
      description: 'Height variant: `default` (38px) or `small` (32px).',
    },
    platform: {
      control: 'radio',
      options: ['windows', 'macos', 'linux'],
      description:
        'Target platform. Controls the visual layout: macOS hides window controls and shows traffic lights area; Windows/Linux show minimize, maximize, and close buttons.',
    },
    menuItems: {
      control: 'object',
      description: 'Array of `MenuItem` objects to render in the menu bar.',
    },
    onMinus: {
      action: 'onMinus',
      description: 'Custom handler for the minimize button. Falls back to IPC.',
    },
    onMinimizeMaximaze: {
      action: 'onMinimizeMaximaze',
      description: 'Custom handler for the maximize/restore button. Falls back to IPC.',
    },
    onClose: {
      action: 'onClose',
      description: 'Custom handler for the close button. Falls back to IPC.',
    },
  },
  args: {
    title: 'My Application',
    onMinus: fn(),
    onMinimizeMaximaze: fn(),
    onClose: fn(),
  },
  parameters: {
    docs: {
      description: {
        component:
          'The main `Titlebar` component — a frameless, cross-platform window titlebar for Electron apps built with React. Supports menus with keyboard shortcuts, platform-aware shortcut formatting (⌘ on macOS, Ctrl on Windows/Linux), custom window control handlers, and two size variants.',
      },
    },
  },
} satisfies Meta<typeof Titlebar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default titlebar on Windows/Linux — shows logo, title, and window controls. */
export const Default: Story = {
  args: {
    title: 'My Application',
    platform: 'windows',
  },
};

/** macOS variant — no window control buttons, leaves room for traffic lights on the left. */
export const MacOS: Story = {
  args: {
    title: 'My Application',
    platform: 'macos',
  },
};

/** Linux variant — same layout as Windows with logo and window controls. */
export const Linux: Story = {
  args: {
    title: 'My Application',
    platform: 'linux',
  },
};

/** Compact titlebar with `size="small"` (32px height). */
export const SmallSize: Story = {
  args: {
    title: 'Compact Titlebar',
    platform: 'windows',
    size: 'small',
  },
};

/** Full menu bar with File, Edit, View, and Help menus on Windows — shortcuts shown as Ctrl+Key. */
export const WithMenuWindows: Story = {
  args: {
    title: 'Editor — project.ts',
    platform: 'windows',
    menuItems: sampleMenuItems,
  },
};

/** Full menu bar on macOS — shortcuts automatically formatted as ⌘ symbols. */
export const WithMenuMacOS: Story = {
  args: {
    title: 'Editor — project.ts',
    platform: 'macos',
    menuItems: sampleMenuItems,
  },
};

/** Small titlebar with menus on Windows. */
export const SmallWithMenu: Story = {
  args: {
    title: 'Compact Editor',
    platform: 'windows',
    size: 'small',
    menuItems: sampleMenuItems,
  },
};

/** Custom action handlers — click minimize, maximize, or close to see actions logged. */
export const CustomHandlers: Story = {
  args: {
    title: 'Custom Handlers Demo',
    platform: 'windows',
    menuItems: sampleMenuItems,
    onMinus: fn(),
    onMinimizeMaximaze: fn(),
    onClose: fn(),
  },
};

/** Titlebar with no title text (null). */
export const NoTitle: Story = {
  args: {
    title: null,
    platform: 'windows',
  },
};

/** Titlebar with a very long title to demonstrate text truncation behavior. */
export const LongTitle: Story = {
  args: {
    title: 'This Is A Very Long Application Title That Should Be Truncated Gracefully In The Titlebar When It Overflows',
    platform: 'windows',
    menuItems: sampleMenuItems,
  },
};

/** Windows titlebar with a logged-in user profile (initials avatar, online status, dropdown actions). */
export const WithUserProfileWindows: Story = {
  args: {
    title: 'My Application',
    platform: 'windows',
    menuItems: sampleMenuItems,
    user: {
      name: 'Euclides Dry',
      email: 'euclides@drycstudio.io',
      status: 'online',
    },
    userActions: [
      { label: 'My Account', action: fn() },
      { label: 'Settings', action: fn() },
      { type: 'separator', label: 'sep' },
      { label: 'Switch Workspace', action: fn() },
    ],
    onSignOut: fn(),
  },
};

/** macOS titlebar with a logged-in user profile. */
export const WithUserProfileMacOS: Story = {
  args: {
    title: 'My Application',
    platform: 'macos',
    menuItems: sampleMenuItems,
    user: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Jane',
      status: 'away',
    },
    userActions: [
      { label: 'My Account', action: fn() },
      { label: 'Preferences', action: fn() },
    ],
    onSignOut: fn(),
  },
};

/** Logged-out state — shows a "Sign In" button in the titlebar. */
export const LoggedOutState: Story = {
  args: {
    title: 'My Application',
    platform: 'windows',
    menuItems: sampleMenuItems,
    user: null,
    onSignIn: fn(),
  },
};

const sampleToolbarActions: TitlebarAction[] = [
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
];

/** Full-featured titlebar with menus, toolbar actions (notifications, settings, upgrade), and user profile on Windows. */
export const WithToolbarActionsWindows: Story = {
  args: {
    title: 'My Application',
    platform: 'windows',
    menuItems: sampleMenuItems,
    actions: sampleToolbarActions,
    user: {
      name: 'Euclides Dry',
      email: 'euclides@drycstudio.io',
      status: 'online',
    },
    userActions: [
      { label: 'My Account', action: fn() },
      { label: 'Settings', action: fn() },
      { type: 'separator', label: 'sep' },
      { label: 'Switch Workspace', action: fn() },
    ],
    onSignOut: fn(),
  },
};

/** Full-featured titlebar with toolbar actions on macOS. */
export const WithToolbarActionsMacOS: Story = {
  args: {
    title: 'My Application',
    platform: 'macos',
    menuItems: sampleMenuItems,
    actions: sampleToolbarActions,
    user: {
      name: 'Euclides Dry',
      email: 'euclides@drycstudio.io',
      status: 'online',
    },
    userActions: [
      { label: 'My Account', action: fn() },
    ],
    onSignOut: fn(),
  },
};
