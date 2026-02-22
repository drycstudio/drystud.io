import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import type { MenuItem } from './components/Menu';
import type { CommandPaletteConfig } from './components/SearchBar';
import type { TitlebarAction } from './components/ToolbarActions';

const MOCK_TEST_TITLE = 'Hello world!';

async function importTitlebar() {
  const mod = await import('./Titlebar');
  return mod.default;
}

const mockCommandPalette: CommandPaletteConfig = {
  placeholder: 'Search...',
  shortcut: 'Ctrl+K',
  sections: [
    {
      id: 'actions',
      title: 'Actions',
      items: [
        { id: 'a', label: 'Action A', shortcut: 'Ctrl+A', action: vi.fn() },
      ],
    },
  ],
  onQueryChange: vi.fn(),
};

describe('Titlebar', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.resetAllMocks();
    delete (globalThis as Record<string, unknown>).electron;
  });

  test('renders with default title', async () => {
    const Titlebar = await importTitlebar();
    render(<Titlebar />);
    expect(screen.getByText('Pretty Titlebar')).toBeTruthy();
  });

  test('renders with custom title', async () => {
    const Titlebar = await importTitlebar();
    render(<Titlebar title={MOCK_TEST_TITLE} />);
    expect(screen.getByText(MOCK_TEST_TITLE)).toBeTruthy();
  });

  test('renders action buttons on windows platform', async () => {
    const Titlebar = await importTitlebar();
    render(<Titlebar title={MOCK_TEST_TITLE} platform="windows" />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(3);
  });

  test('renders without action buttons on macos platform', async () => {
    const Titlebar = await importTitlebar();
    render(<Titlebar title={MOCK_TEST_TITLE} platform="macos" />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  test('renders logo on non-mac platforms', async () => {
    const Titlebar = await importTitlebar();
    render(<Titlebar title={MOCK_TEST_TITLE} platform="windows" />);
    expect(screen.getByAltText('Electron Pretty Titlebar Logo')).toBeTruthy();
  });

  test('does not render logo on macos platform', async () => {
    const Titlebar = await importTitlebar();
    render(<Titlebar title={MOCK_TEST_TITLE} platform="macos" />);
    expect(screen.queryByAltText('Electron Pretty Titlebar Logo')).toBeNull();
  });

  test('renders with custom logo', async () => {
    const Titlebar = await importTitlebar();
    render(<Titlebar title={MOCK_TEST_TITLE} platform="windows" logo="/custom-logo.png" />);
    const img = screen.getByAltText<HTMLImageElement>('Electron Pretty Titlebar Logo');
    expect(img.src).toContain('custom-logo.png');
  });

  test('renders with linux platform', async () => {
    const Titlebar = await importTitlebar();
    render(<Titlebar title={MOCK_TEST_TITLE} platform="linux" />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(3);
  });

  test('renders with small size', async () => {
    const Titlebar = await importTitlebar();
    render(<Titlebar title={MOCK_TEST_TITLE} platform="windows" size="small" />);
    expect(screen.getByText(MOCK_TEST_TITLE)).toBeTruthy();
  });

  test('renders menu items when provided', async () => {
    const Titlebar = await importTitlebar();
    const menuItems: MenuItem[] = [
      { label: 'File', submenu: [{ label: 'New', action: vi.fn() }] },
    ];
    render(<Titlebar title={MOCK_TEST_TITLE} platform="windows" menuItems={menuItems} />);
    expect(screen.getByText('File')).toBeTruthy();
  });

  test('renders menu items on macos', async () => {
    const Titlebar = await importTitlebar();
    const menuItems: MenuItem[] = [
      { label: 'Edit', submenu: [{ label: 'Undo', action: vi.fn() }] },
    ];
    render(<Titlebar title={MOCK_TEST_TITLE} platform="macos" menuItems={menuItems} />);
    expect(screen.getByText('Edit')).toBeTruthy();
  });

  test('action buttons are clickable', async () => {
    const Titlebar = await importTitlebar();
    render(<Titlebar title={MOCK_TEST_TITLE} platform="windows" />);
    const buttons = screen.getAllByRole('button');

    await waitFor(() => {
      expect(buttons[0]).toBeTruthy();
      expect(buttons[1]).toBeTruthy();
      expect(buttons[2]).toBeTruthy();
    });

    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
    fireEvent.click(buttons[2]);
  });

  test('action buttons call custom handlers', async () => {
    const Titlebar = await importTitlebar();
    const [onMinus, onMinimizeMaximize, onClose] = [vi.fn(), vi.fn(), vi.fn()];
    render(
      <Titlebar
        title={MOCK_TEST_TITLE}
        platform="windows"
        onMinus={onMinus}
        onMinimizeMaximaze={onMinimizeMaximize}
        onClose={onClose}
      />,
    );

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
    fireEvent.click(buttons[2]);

    expect(onMinus).toHaveBeenCalled();
    expect(onMinimizeMaximize).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  test('renders with null title', async () => {
    const Titlebar = await importTitlebar();
    render(<Titlebar title={null} platform="windows" />);
    expect(screen.queryByText('Pretty Titlebar')).toBeNull();
  });

  test('picks up ipcHandle when globalThis.electron exists', async () => {
    (globalThis as Record<string, unknown>).electron = {
      ipcRenderer: {
        send: vi.fn(),
        invoke: vi.fn().mockResolvedValue(false),
        on: vi.fn(),
        removeAllListeners: vi.fn(),
      },
    };
    const Titlebar = await importTitlebar();
    render(<Titlebar title={MOCK_TEST_TITLE} platform="windows" />);
    expect(screen.getByText(MOCK_TEST_TITLE)).toBeTruthy();
  });

  describe('command palette integration', () => {
    test('renders search bar on windows when commandPalette is provided', async () => {
      const Titlebar = await importTitlebar();
      render(<Titlebar title={MOCK_TEST_TITLE} platform="windows" commandPalette={mockCommandPalette} />);
      expect(screen.getByTestId('searchbar-trigger')).toBeTruthy();
      expect(screen.getByText('Search...')).toBeTruthy();
    });

    test('renders search bar on macos when commandPalette is provided', async () => {
      const Titlebar = await importTitlebar();
      render(<Titlebar title={MOCK_TEST_TITLE} platform="macos" commandPalette={mockCommandPalette} />);
      expect(screen.getByTestId('searchbar-trigger')).toBeTruthy();
    });

    test('does not render search bar when no commandPalette', async () => {
      const Titlebar = await importTitlebar();
      render(<Titlebar title={MOCK_TEST_TITLE} platform="windows" />);
      expect(screen.queryByTestId('searchbar-trigger')).toBeNull();
    });

    test('passes commandPalette props to search bar', async () => {
      const Titlebar = await importTitlebar();
      render(
        <Titlebar
          title={MOCK_TEST_TITLE}
          platform="windows"
          commandPalette={mockCommandPalette}
        />,
      );
      expect(screen.getByText('Search...')).toBeTruthy();
      expect(screen.getByText('Ctrl+K')).toBeTruthy();
    });
  });

  describe('user profile integration', () => {
    test('renders user profile on windows', async () => {
      const Titlebar = await importTitlebar();
      render(
        <Titlebar
          title={MOCK_TEST_TITLE}
          platform="windows"
          user={{ name: 'Test User', status: 'online' }}
          onSignOut={vi.fn()}
        />,
      );
      expect(screen.getByTestId('avatar-button')).toBeTruthy();
    });

    test('renders user profile on macos', async () => {
      const Titlebar = await importTitlebar();
      render(
        <Titlebar
          title={MOCK_TEST_TITLE}
          platform="macos"
          user={{ name: 'Test User' }}
          onSignOut={vi.fn()}
        />,
      );
      expect(screen.getByTestId('avatar-button')).toBeTruthy();
    });

    test('renders sign in button when no user and onSignIn provided', async () => {
      const Titlebar = await importTitlebar();
      render(
        <Titlebar
          title={MOCK_TEST_TITLE}
          platform="windows"
          onSignIn={vi.fn()}
        />,
      );
      expect(screen.getByTestId('sign-in-button')).toBeTruthy();
    });

    test('renders user actions in dropdown', async () => {
      const Titlebar = await importTitlebar();
      const action = vi.fn();
      render(
        <Titlebar
          title={MOCK_TEST_TITLE}
          platform="windows"
          user={{ name: 'Test User' }}
          userActions={[{ label: 'Settings', action }]}
          onSignOut={vi.fn()}
        />,
      );
      fireEvent.click(screen.getByTestId('avatar-button'));
      expect(screen.getByText('Settings')).toBeTruthy();
    });

    test('does not render user profile when no user props', async () => {
      const Titlebar = await importTitlebar();
      render(<Titlebar title={MOCK_TEST_TITLE} platform="windows" />);
      expect(screen.queryByTestId('avatar-button')).toBeNull();
      expect(screen.queryByTestId('sign-in-button')).toBeNull();
    });
  });

  describe('combined features', () => {
    test('renders menu, search bar, and user profile together on windows', async () => {
      const Titlebar = await importTitlebar();
      const menuItems: MenuItem[] = [
        { label: 'File', submenu: [{ label: 'New', action: vi.fn() }] },
      ];
      render(
        <Titlebar
          title={MOCK_TEST_TITLE}
          platform="windows"
          menuItems={menuItems}
          commandPalette={mockCommandPalette}
          user={{ name: 'Test User' }}
          onSignOut={vi.fn()}
        />,
      );
      expect(screen.getByText('File')).toBeTruthy();
      expect(screen.getByTestId('searchbar-trigger')).toBeTruthy();
      expect(screen.getByTestId('avatar-button')).toBeTruthy();
      expect(screen.getByText(MOCK_TEST_TITLE)).toBeTruthy();
    });

    test('renders menu, search bar, and user profile together on macos', async () => {
      const Titlebar = await importTitlebar();
      const menuItems: MenuItem[] = [
        { label: 'Edit', submenu: [{ label: 'Undo', action: vi.fn() }] },
      ];
      render(
        <Titlebar
          title={MOCK_TEST_TITLE}
          platform="macos"
          menuItems={menuItems}
          commandPalette={mockCommandPalette}
          user={{ name: 'Test User' }}
          onSignOut={vi.fn()}
        />,
      );
      expect(screen.getByText('Edit')).toBeTruthy();
      expect(screen.getByTestId('searchbar-trigger')).toBeTruthy();
      expect(screen.getByTestId('avatar-button')).toBeTruthy();
    });
  });

  describe('toolbar actions integration', () => {
    const bellIcon = React.createElement('svg', { 'data-testid': 'icon-bell' });
    const gearIcon = React.createElement('svg', { 'data-testid': 'icon-gear' });

    test('renders toolbar actions on windows', async () => {
      const Titlebar = await importTitlebar();
      const actions: TitlebarAction[] = [
        { id: 'bell', icon: bellIcon, tooltip: 'Notifications', badge: 3, badgeVariant: 'attention' },
        { id: 'gear', icon: gearIcon, tooltip: 'Settings', onClick: vi.fn() },
      ];
      render(<Titlebar title={MOCK_TEST_TITLE} platform="windows" actions={actions} />);
      expect(screen.getByTestId('toolbar-action-bell')).toBeTruthy();
      expect(screen.getByTestId('toolbar-action-gear')).toBeTruthy();
      expect(screen.getByTestId('toolbar-badge-bell')).toBeTruthy();
    });

    test('renders toolbar actions on macos', async () => {
      const Titlebar = await importTitlebar();
      const actions: TitlebarAction[] = [
        { id: 'bell', icon: bellIcon, tooltip: 'Notifications' },
      ];
      render(<Titlebar title={MOCK_TEST_TITLE} platform="macos" actions={actions} />);
      expect(screen.getByTestId('toolbar-action-bell')).toBeTruthy();
    });

    test('renders custom renderActions on windows', async () => {
      const Titlebar = await importTitlebar();
      render(
        <Titlebar
          title={MOCK_TEST_TITLE}
          platform="windows"
          renderActions={() => <button data-testid="custom-toolbar-btn">Custom</button>}
        />,
      );
      expect(screen.getByTestId('custom-toolbar-btn')).toBeTruthy();
    });

    test('renders toolbar actions on linux', async () => {
      const Titlebar = await importTitlebar();
      const actions: TitlebarAction[] = [
        { id: 'bell', icon: bellIcon, tooltip: 'Notifications' },
      ];
      render(<Titlebar title={MOCK_TEST_TITLE} platform="linux" actions={actions} />);
      expect(screen.getByTestId('toolbar-action-bell')).toBeTruthy();
    });

    test('does not render toolbar when no actions provided', async () => {
      const Titlebar = await importTitlebar();
      render(<Titlebar title={MOCK_TEST_TITLE} platform="windows" />);
      expect(screen.queryByRole('toolbar')).toBeNull();
    });

    test('toolbar action onClick fires', async () => {
      const Titlebar = await importTitlebar();
      const onClick = vi.fn();
      const actions: TitlebarAction[] = [
        { id: 'gear', icon: gearIcon, tooltip: 'Settings', onClick },
      ];
      render(<Titlebar title={MOCK_TEST_TITLE} platform="windows" actions={actions} />);
      fireEvent.click(screen.getByTestId('toolbar-action-gear'));
      expect(onClick).toHaveBeenCalledOnce();
    });

    test('renders filled split button variant on windows', async () => {
      const Titlebar = await importTitlebar();
      const zapIcon = React.createElement('svg', { 'data-testid': 'icon-zap' });
      const onClick = vi.fn();
      const actions: TitlebarAction[] = [
        {
          id: 'upgrade',
          icon: zapIcon,
          label: 'Update v2.1.0',
          variant: 'filled',
          tooltip: 'Update Available',
          badgeVariant: 'success',
          onClick,
          dropdown: [
            { label: 'Download & Update', action: vi.fn() },
            { label: 'Download Only', action: vi.fn() },
          ],
        },
      ];
      render(<Titlebar title={MOCK_TEST_TITLE} platform="windows" actions={actions} />);
      const container = screen.getByTestId('toolbar-action-upgrade');
      expect(container.getAttribute('role')).toBe('group');
      expect(screen.getByText('Update v2.1.0')).toBeTruthy();
      expect(screen.getByTestId('toolbar-action-upgrade-main')).toBeTruthy();
      expect(screen.getByTestId('toolbar-action-upgrade-chevron')).toBeTruthy();
      fireEvent.click(screen.getByTestId('toolbar-action-upgrade-main'));
      expect(onClick).toHaveBeenCalledOnce();
    });
  });

  describe('detectPlatform auto-detection', () => {
    test('detects macos without platform prop', async () => {
      Object.defineProperty(globalThis.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        configurable: true,
      });
      const Titlebar = await importTitlebar();
      render(<Titlebar title={MOCK_TEST_TITLE} />);
      expect(screen.queryByAltText('Electron Pretty Titlebar Logo')).toBeNull();
    });

    test('detects linux without platform prop', async () => {
      Object.defineProperty(globalThis.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (X11; Linux x86_64)',
        configurable: true,
      });
      const Titlebar = await importTitlebar();
      render(<Titlebar title={MOCK_TEST_TITLE} />);
      expect(screen.getByAltText('Electron Pretty Titlebar Logo')).toBeTruthy();
      expect(screen.getAllByRole('button')).toHaveLength(3);
    });

    test('detects windows without platform prop', async () => {
      Object.defineProperty(globalThis.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        configurable: true,
      });
      const Titlebar = await importTitlebar();
      render(<Titlebar title={MOCK_TEST_TITLE} />);
      expect(screen.getByAltText('Electron Pretty Titlebar Logo')).toBeTruthy();
      expect(screen.getAllByRole('button')).toHaveLength(3);
    });
  });
});
