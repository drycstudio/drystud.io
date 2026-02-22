import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { WindowControls } from './WindowControls';
import type { MenuItem } from '../Menu/types';

const menuItems: MenuItem[] = [
  {
    label: 'File',
    submenu: [
      { label: 'New', shortcut: 'Ctrl+N', action: fn() },
      { label: 'Open', shortcut: 'Ctrl+O', action: fn() },
      { type: 'separator', label: '' },
      { label: 'Save', shortcut: 'Ctrl+S', action: fn() },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      { label: 'Undo', shortcut: 'Ctrl+Z', action: fn() },
      { label: 'Redo', shortcut: 'Ctrl+Shift+Z', action: fn() },
    ],
  },
];

const meta = {
  title: 'Components/WindowControls',
  component: WindowControls,
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: `Internal layout component responsible for rendering the menu bar, title text, and window control buttons.

Operates in two modes:
- **macOnly** — Renders only the menu (if provided) and centered title. No window buttons (macOS uses native traffic lights).
- **Windows/Linux** — Renders the full set: menu or placeholder, centered title, and minimize/maximize/close buttons.`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Title text displayed in the center.',
    },
    macOnly: {
      control: 'boolean',
      description: 'When `true`, hides window control buttons (macOS mode).',
    },
    isWindowMaximized: {
      control: 'boolean',
      description: 'Toggles the maximize/restore icon.',
    },
    platform: {
      control: 'radio',
      options: ['windows', 'macos', 'linux'],
      description: 'Platform for shortcut formatting.',
    },
  },
  decorators: [
    (Story) => (
      <div style={{
        height: '38px',
        backgroundColor: '#1C1C1C',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
        color: 'rgba(255,255,255,0.9)',
      }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WindowControls>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Windows mode — shows menu, title, and all 3 window control buttons. Window is not maximized. */
export const WindowsDefault: Story = {
  args: {
    title: 'My Application',
    platform: 'windows',
    menuItems,
    isWindowMaximized: false,
    handleMinus: fn(),
    handleMinimazeMaximaze: fn() as unknown as () => Promise<void>,
    handleClose: fn(),
  },
};

/** Windows mode when the window is maximized — shows the restore icon instead of maximize. */
export const WindowsMaximized: Story = {
  args: {
    title: 'My Application',
    platform: 'windows',
    menuItems,
    isWindowMaximized: true,
    handleMinus: fn(),
    handleMinimazeMaximaze: fn() as unknown as () => Promise<void>,
    handleClose: fn(),
  },
};

/** Windows mode without a menu — shows the empty placeholder on the left. */
export const WindowsNoMenu: Story = {
  args: {
    title: 'Simple Window',
    platform: 'windows',
    isWindowMaximized: false,
    handleMinus: fn(),
    handleMinimazeMaximaze: fn() as unknown as () => Promise<void>,
    handleClose: fn(),
  },
};

/** macOS mode — no window buttons, only menu and centered title. */
export const MacOnly: Story = {
  args: {
    title: 'My Mac App',
    platform: 'macos',
    menuItems,
    macOnly: true,
  },
};

/** macOS mode without a menu. */
export const MacOnlyNoMenu: Story = {
  args: {
    title: 'Simple Mac App',
    platform: 'macos',
    macOnly: true,
  },
};
