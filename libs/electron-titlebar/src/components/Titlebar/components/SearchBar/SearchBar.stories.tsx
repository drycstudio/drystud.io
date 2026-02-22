import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { SearchBar } from './SearchBar';
import type { CommandPaletteSection, FilterChip, CommandPaletteFooterAction } from './types';

const recentSections: CommandPaletteSection[] = [
  {
    id: 'recent',
    title: 'Recently Viewed',
    items: [
      { id: 'r1', label: 'GET /api/users', description: 'User Management', icon: '🟢', metadata: '2h ago', badge: 'GET', action: fn() },
      { id: 'r2', label: 'POST /api/auth/login', description: 'Authentication', icon: '🟡', metadata: 'Yesterday', badge: 'POST', action: fn() },
    ],
  },
  {
    id: 'commands',
    title: 'Quick Actions',
    items: [
      { id: 'c1', label: 'New Request', description: 'Create a new HTTP request', icon: '➕', shortcut: 'Ctrl+N', action: fn() },
      { id: 'c2', label: 'Import Collection', description: 'Import from OpenAPI or cURL', icon: '📥', shortcut: 'Ctrl+I', action: fn() },
      { id: 'c3', label: 'Manage Environments', description: 'View and edit variables', icon: '🌐', action: fn() },
    ],
  },
];

const filters: FilterChip[] = [
  { id: 'requests', label: 'Requests', active: false, onToggle: fn() },
  { id: 'collections', label: 'Collections', active: true, onToggle: fn() },
  { id: 'environments', label: 'Environments', active: false, onToggle: fn() },
];

const footerActions: CommandPaletteFooterAction[] = [
  { id: 'workspace', icon: '🔍', label: 'Search in Workspace', action: fn() },
  { id: 'docs', icon: '📖', label: 'Browse Documentation', action: fn() },
];

const meta = {
  title: 'Components/CommandPalette',
  component: SearchBar,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: `An enterprise-grade command palette for the titlebar.

- **Sectioned results** — Items are grouped into named sections (e.g., "Recently Viewed", "Quick Actions").
- **Rich items** — Each item supports icon, label, description, badge, metadata, and shortcut.
- **Filter chips** — Scoped search filters rendered between the input and results.
- **Footer actions** — Quick-access actions at the bottom of the palette.
- **Consumer-controlled** — The library renders structure; the consumer provides data via props/callbacks.
- **Keyboard navigation** — ArrowUp/Down navigates items across sections, Enter selects, Escape closes.
- **Custom rendering** — Optionally provide a \`renderItem\` function for fully custom item UI.
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: { description: 'Placeholder text for the trigger and palette input.', control: 'text' },
    shortcut: { description: 'Keyboard shortcut badge (e.g., "Ctrl+K").', control: 'text' },
    platform: { description: 'Target platform for shortcut formatting.', control: 'select', options: ['windows', 'macos', 'linux'] },
    centered: { description: 'Center the trigger (macOS layout).', control: 'boolean' },
    loading: { description: 'Show a loading spinner instead of results.', control: 'boolean' },
    emptyMessage: { description: 'Message shown when no items exist.', control: 'text' },
  },
  decorators: [
    (Story) => (
      <div style={{ height: '400px', backgroundColor: '#1C1C1C', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', minWidth: '600px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Full enterprise palette with sections, filters, and footer. */
export const EnterpriseFull: Story = {
  args: {
    placeholder: 'Search commands, requests, collections...',
    shortcut: 'Ctrl+K',
    platform: 'windows',
    sections: recentSections,
    filters,
    footerActions,
    onQueryChange: fn(),
    onOpen: fn(),
    onClose: fn(),
  },
};

/** macOS centered layout with all features. */
export const MacOSCentered: Story = {
  args: {
    ...EnterpriseFull.args,
    platform: 'macos',
    centered: true,
  },
};

/** Palette with filter chips only (no footer). */
export const WithFilterChips: Story = {
  args: {
    placeholder: 'Filter by type...',
    shortcut: 'Ctrl+K',
    platform: 'windows',
    sections: recentSections,
    filters,
    onQueryChange: fn(),
  },
};

/** Palette with a custom renderItem for fully custom UI. */
export const WithCustomRenderer: Story = {
  args: {
    placeholder: 'Search...',
    shortcut: 'Ctrl+K',
    platform: 'windows',
    sections: [
      {
        id: 'custom',
        title: 'Custom Rendered',
        items: [
          { id: 'x1', label: 'Custom Item A', description: 'Rendered with custom function', action: fn() },
          { id: 'x2', label: 'Custom Item B', description: 'Another custom item', badge: 'NEW', action: fn() },
        ],
      },
    ],
    renderItem: (item, focused) => (
      <div
        style={{
          padding: '10px 14px',
          backgroundColor: focused ? 'rgba(79, 70, 229, 0.3)' : 'transparent',
          borderRadius: '6px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <span style={{ fontSize: '18px' }}>★</span>
        <div>
          <div style={{ color: '#fff', fontWeight: 500 }}>{item.label}</div>
          {item.description && (
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>{item.description}</div>
          )}
        </div>
        {item.badge && (
          <span style={{ marginLeft: 'auto', fontSize: '10px', padding: '2px 6px', backgroundColor: 'rgba(79,70,229,0.4)', borderRadius: '3px', color: '#fff' }}>
            {item.badge}
          </span>
        )}
      </div>
    ),
    onQueryChange: fn(),
  },
};

/** Loading state with spinner. */
export const LoadingState: Story = {
  args: {
    placeholder: 'Searching...',
    shortcut: 'Ctrl+K',
    platform: 'windows',
    sections: [],
    loading: true,
    onQueryChange: fn(),
  },
};

/** Empty state when no sections have items. */
export const EmptyState: Story = {
  args: {
    placeholder: 'Search...',
    shortcut: 'Ctrl+K',
    platform: 'windows',
    sections: [],
    emptyMessage: 'No matching results. Try a different search term.',
    onQueryChange: fn(),
  },
};

/** Multiple sections without filters or footer. */
export const MultipleSections: Story = {
  args: {
    placeholder: 'Search...',
    shortcut: 'Ctrl+K',
    platform: 'windows',
    sections: [
      ...recentSections,
      {
        id: 'workspaces',
        title: 'Workspaces',
        items: [
          { id: 'ws1', label: 'Personal Workspace', description: '12 collections · 48 requests', icon: '👤', badge: 'Active', action: fn() },
          { id: 'ws2', label: 'Team Workspace', description: '28 collections · 156 requests', icon: '👥', action: fn() },
        ],
      },
    ],
    onQueryChange: fn(),
  },
};

/** Palette with footer actions only. */
export const WithFooter: Story = {
  args: {
    placeholder: 'Search...',
    shortcut: 'Ctrl+K',
    platform: 'windows',
    sections: recentSections,
    footerActions,
    onQueryChange: fn(),
  },
};

/** Items with disabled state. */
export const WithDisabledItems: Story = {
  args: {
    placeholder: 'Search...',
    shortcut: 'Ctrl+K',
    platform: 'windows',
    sections: [
      {
        id: 'mixed',
        title: 'Actions',
        items: [
          { id: 'd1', label: 'Available Action', description: 'This can be clicked', icon: '✅', action: fn() },
          { id: 'd2', label: 'Disabled Action', description: 'This is not available', icon: '🚫', disabled: true, action: fn() },
          { id: 'd3', label: 'Another Action', description: 'This works fine', icon: '✅', action: fn() },
        ],
      },
    ],
    onQueryChange: fn(),
  },
};

/** Custom footer rendering. */
export const WithCustomFooter: Story = {
  args: {
    placeholder: 'Search...',
    shortcut: 'Ctrl+K',
    platform: 'windows',
    sections: recentSections,
    renderFooter: () => (
      <div style={{ padding: '8px 12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
        <span>Press ↵ to select · ↑↓ to navigate · Esc to close</span>
        <span>v2.0</span>
      </div>
    ),
    onQueryChange: fn(),
  },
};
