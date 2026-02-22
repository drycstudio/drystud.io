import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { Menu } from './Menu';
import type { MenuItem } from './types';

const fileMenu: MenuItem[] = [
  {
    label: 'File',
    submenu: [
      { label: 'New File', shortcut: 'Ctrl+N', action: fn() },
      { label: 'Open File...', shortcut: 'Ctrl+O', action: fn() },
      { label: 'Open Recent', disabled: true, action: fn() },
      { type: 'separator', label: '' },
      { label: 'Save', shortcut: 'Ctrl+S', action: fn() },
      { label: 'Save As...', shortcut: 'Ctrl+Shift+S', action: fn() },
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
    ],
  },
  {
    label: 'View',
    submenu: [
      { label: 'Toggle Full Screen', shortcut: 'F11', action: fn() },
      { label: 'Zoom In', shortcut: 'Ctrl+=', action: fn() },
      { label: 'Zoom Out', shortcut: 'Ctrl+-', action: fn() },
      { label: 'Reset Zoom', shortcut: 'Ctrl+0', action: fn() },
    ],
  },
  {
    label: 'Help',
    submenu: [
      { label: 'Documentation', action: fn() },
      { label: 'About', action: fn() },
    ],
  },
];

const meta = {
  title: 'Components/Menu',
  component: Menu,
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: `Interactive dropdown menu bar for the titlebar. Supports:

- **Cascading submenus** — any item can nest children to any depth, with flyout panels and edge detection
- **Keyboard shortcuts** — displayed alongside labels, auto-formatted per platform (⌘ on macOS, Ctrl on Windows/Linux)
- **Disabled items** — visually dimmed and non-interactive
- **Keyboard navigation** — Arrow keys, Enter, Escape; ArrowRight opens nested children
- **Hover switching** — move between menus by hovering when one is open
- **Click outside** — closes any open dropdown`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    platform: {
      control: 'radio',
      options: ['windows', 'macos', 'linux'],
      description:
        'Controls shortcut formatting. On macOS, `Ctrl` → `⌘`, `Alt` → `⌥`, `Shift` → `⇧`.',
    },
    items: {
      description: 'Array of `MenuItem` objects defining the menu structure.',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ height: '300px', backgroundColor: '#1C1C1C', display: 'flex', alignItems: 'flex-start', padding: '6px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Full menu bar with Windows-style shortcuts (Ctrl+Key). */
export const WindowsShortcuts: Story = {
  args: {
    items: fileMenu,
    platform: 'windows',
  },
};

/** Same menus but with macOS-style shortcuts (⌘, ⇧, ⌥). */
export const MacOSShortcuts: Story = {
  args: {
    items: fileMenu,
    platform: 'macos',
  },
};

/** Single menu with various item states — normal, disabled, and separators. */
export const DisabledItems: Story = {
  args: {
    items: [
      {
        label: 'File',
        submenu: [
          { label: 'New File', shortcut: 'Ctrl+N', action: fn() },
          { label: 'Open File...', shortcut: 'Ctrl+O', action: fn() },
          { label: 'Open Recent', disabled: true, action: fn() },
          { type: 'separator', label: '' },
          { label: 'Save (disabled)', disabled: true, action: fn() },
          { label: 'Save As...', shortcut: 'Ctrl+Shift+S', action: fn() },
        ],
      },
    ],
    platform: 'windows',
  },
};

/** Menu with a disabled top-level item. */
export const DisabledTopLevel: Story = {
  args: {
    items: [
      {
        label: 'File',
        submenu: [
          { label: 'New', action: fn() },
          { label: 'Open', action: fn() },
        ],
      },
      { label: 'Disabled Menu', disabled: true },
      {
        label: 'Help',
        submenu: [{ label: 'About', action: fn() }],
      },
    ],
    platform: 'windows',
  },
};

/** Minimal menu — a single item with a few sub-items. */
export const SingleMenu: Story = {
  args: {
    items: [
      {
        label: 'Options',
        submenu: [
          { label: 'Settings', shortcut: 'Ctrl+,', action: fn() },
          { type: 'separator', label: '' },
          { label: 'Reload', shortcut: 'Ctrl+R', action: fn() },
        ],
      },
    ],
    platform: 'windows',
  },
};

/** Items without shortcuts — only labels. */
export const NoShortcuts: Story = {
  args: {
    items: [
      {
        label: 'Actions',
        submenu: [
          { label: 'Run Task', action: fn() },
          { label: 'Build Project', action: fn() },
          { label: 'Deploy', action: fn() },
          { type: 'separator', label: '' },
          { label: 'Clean Cache', action: fn() },
        ],
      },
    ],
    platform: 'windows',
  },
};

/** Cascading (nested) submenus — items can contain child menus that fly out to the side. */
export const CascadingSubmenus: Story = {
  args: {
    items: [
      {
        label: 'File',
        submenu: [
          { label: 'New File', shortcut: 'Ctrl+N', action: fn() },
          { label: 'New Window', shortcut: 'Ctrl+Shift+N', action: fn() },
          { type: 'separator', label: '' },
          { label: 'Open File...', shortcut: 'Ctrl+O', action: fn() },
          {
            label: 'Open Recent',
            submenu: [
              { label: '~/projects/my-app', action: fn() },
              { label: '~/projects/dashboard', action: fn() },
              { label: '~/projects/electron-titlebar', action: fn() },
              { type: 'separator', label: '' },
              { label: 'Clear Recently Opened', action: fn() },
            ],
          },
          { type: 'separator', label: '' },
          { label: 'Save', shortcut: 'Ctrl+S', action: fn() },
          { label: 'Exit', shortcut: 'Alt+F4', action: fn() },
        ],
      },
      {
        label: 'View',
        submenu: [
          { label: 'Command Palette...', shortcut: 'Ctrl+Shift+P', action: fn() },
          { type: 'separator', label: '' },
          {
            label: 'Appearance',
            submenu: [
              { label: 'Zoom In', shortcut: 'Ctrl+=', action: fn() },
              { label: 'Zoom Out', shortcut: 'Ctrl+-', action: fn() },
              { label: 'Reset Zoom', shortcut: 'Ctrl+0', action: fn() },
              { type: 'separator', label: '' },
              {
                label: 'Color Theme',
                submenu: [
                  { label: 'Dark+ (default)', action: fn() },
                  { label: 'Light+', action: fn() },
                  { label: 'Monokai', action: fn() },
                  { label: 'Solarized Dark', action: fn() },
                ],
              },
            ],
          },
          { type: 'separator', label: '' },
          { label: 'Toggle Full Screen', shortcut: 'F11', action: fn() },
        ],
      },
      {
        label: 'Help',
        submenu: [
          { label: 'Documentation', action: fn() },
          { label: 'About', action: fn() },
        ],
      },
    ],
    platform: 'windows',
  },
};
