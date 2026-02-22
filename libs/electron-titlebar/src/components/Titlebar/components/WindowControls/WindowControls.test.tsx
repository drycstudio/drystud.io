import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { WindowControls } from './WindowControls';
import type { MenuItem } from '../Menu';
import type { CommandPaletteConfig } from '../SearchBar';

const menuItems: MenuItem[] = [
  {
    label: 'File',
    submenu: [{ label: 'New', action: vi.fn() }],
  },
];

const mockCommandPalette: CommandPaletteConfig = {
  placeholder: 'Search commands...',
  shortcut: 'Ctrl+K',
  sections: [
    {
      id: 'actions',
      title: 'Actions',
      items: [
        { id: 'a', label: 'Action A', shortcut: 'Ctrl+A', action: vi.fn() },
        { id: 'b', label: 'Action B', action: vi.fn() },
      ],
    },
  ],
  onQueryChange: vi.fn(),
};

describe('WindowControls', () => {
  describe('macOnly mode', () => {
    test('does not render title text on macOS', () => {
      render(<WindowControls title="My App" macOnly />);
      expect(screen.queryByText('My App')).toBeNull();
    });

    test('renders menu when menuItems provided', () => {
      render(<WindowControls title="My App" menuItems={menuItems} macOnly />);
      expect(screen.getByText('File')).toBeTruthy();
    });

    test('does not render menu when no menuItems', () => {
      render(<WindowControls title="My App" macOnly />);
      expect(screen.queryByText('File')).toBeNull();
    });

    test('does not render action buttons', () => {
      render(<WindowControls title="My App" macOnly />);
      expect(screen.queryAllByRole('button')).toHaveLength(0);
    });

    test('renders search bar when commandPalette is provided', () => {
      render(<WindowControls title="My App" commandPalette={mockCommandPalette} macOnly />);
      expect(screen.getByTestId('searchbar-trigger')).toBeTruthy();
    });

    test('does not render search bar when no commandPalette', () => {
      render(<WindowControls title="My App" macOnly />);
      expect(screen.queryByTestId('searchbar-trigger')).toBeNull();
    });

    test('renders search bar centered with commandPalette on macOS', () => {
      render(
        <WindowControls
          title="My App"
          commandPalette={mockCommandPalette}
          platform="macos"
          macOnly
        />,
      );
      expect(screen.getByTestId('searchbar-trigger')).toBeTruthy();
      expect(screen.getByText('Search commands...')).toBeTruthy();
    });

    test('search bar replaces title area on macOS', () => {
      const { rerender } = render(<WindowControls title="My App" macOnly />);
      expect(screen.queryByTestId('searchbar-trigger')).toBeNull();

      rerender(<WindowControls title="My App" commandPalette={mockCommandPalette} macOnly />);
      expect(screen.getByTestId('searchbar-trigger')).toBeTruthy();
    });

    test('renders user profile on macOS', () => {
      render(
        <WindowControls
          title="My App"
          user={{ name: 'Test User', status: 'online' }}
          onSignOut={vi.fn()}
          macOnly
        />,
      );
      expect(screen.getByTestId('avatar-button')).toBeTruthy();
    });

    test('renders sign-in on macOS when no user', () => {
      render(
        <WindowControls title="My App" onSignIn={vi.fn()} macOnly />,
      );
      expect(screen.getByTestId('sign-in-button')).toBeTruthy();
    });

    test('renders menu, search bar, and user profile together on macOS', () => {
      render(
        <WindowControls
          title="My App"
          menuItems={menuItems}
          commandPalette={mockCommandPalette}
          user={{ name: 'Test' }}
          onSignOut={vi.fn()}
          macOnly
        />,
      );
      expect(screen.getByText('File')).toBeTruthy();
      expect(screen.getByTestId('searchbar-trigger')).toBeTruthy();
      expect(screen.getByTestId('avatar-button')).toBeTruthy();
    });
  });

  describe('windows/linux mode', () => {
    const handlers = {
      handleMinus: vi.fn(),
      handleMinimazeMaximaze: vi.fn().mockResolvedValue(undefined),
      handleClose: vi.fn(),
    };

    test('renders title and 3 action buttons', () => {
      render(
        <WindowControls
          title="My App"
          isWindowMaximized={false}
          {...handlers}
        />,
      );
      expect(screen.getByText('My App')).toBeTruthy();
      expect(screen.getAllByRole('button')).toHaveLength(3);
    });

    test('shows maximize icon when not maximized', () => {
      render(
        <WindowControls
          title="My App"
          isWindowMaximized={false}
          {...handlers}
        />,
      );
      expect(screen.getByTestId('action-button-maximize')).toBeTruthy();
    });

    test('shows minimize icon when maximized', () => {
      render(
        <WindowControls
          title="My App"
          isWindowMaximized={true}
          {...handlers}
        />,
      );
      expect(screen.getByTestId('action-button-minimize')).toBeTruthy();
    });

    test('renders menu when menuItems provided', () => {
      render(
        <WindowControls
          title="My App"
          menuItems={menuItems}
          isWindowMaximized={false}
          {...handlers}
        />,
      );
      expect(screen.getByText('File')).toBeTruthy();
    });

    test('renders placeholder when no menuItems', () => {
      const { container } = render(
        <WindowControls
          title="My App"
          isWindowMaximized={false}
          {...handlers}
        />,
      );
      expect(container.querySelector('nav')).toBeNull();
    });

    test('calls handlers on button clicks', () => {
      render(
        <WindowControls
          title="My App"
          isWindowMaximized={false}
          {...handlers}
        />,
      );
      const buttons = screen.getAllByRole('button');
      fireEvent.click(buttons[0]);
      expect(handlers.handleMinus).toHaveBeenCalled();

      fireEvent.click(buttons[1]);
      expect(handlers.handleMinimazeMaximaze).toHaveBeenCalled();

      fireEvent.click(buttons[2]);
      expect(handlers.handleClose).toHaveBeenCalled();
    });

    test('renders search bar when commandPalette is provided', () => {
      render(
        <WindowControls
          title="My App"
          isWindowMaximized={false}
          commandPalette={mockCommandPalette}
          {...handlers}
        />,
      );
      expect(screen.getByTestId('searchbar-trigger')).toBeTruthy();
    });

    test('does not render search bar when no commandPalette', () => {
      render(
        <WindowControls
          title="My App"
          isWindowMaximized={false}
          {...handlers}
        />,
      );
      expect(screen.queryByTestId('searchbar-trigger')).toBeNull();
    });

    test('renders search bar with all props on windows', () => {
      render(
        <WindowControls
          title="My App"
          isWindowMaximized={false}
          commandPalette={mockCommandPalette}
          platform="windows"
          {...handlers}
        />,
      );
      expect(screen.getByTestId('searchbar-trigger')).toBeTruthy();
      expect(screen.getByText('Search commands...')).toBeTruthy();
      expect(screen.getByText('Ctrl+K')).toBeTruthy();
    });

    test('renders title alongside search bar on windows', () => {
      render(
        <WindowControls
          title="My App"
          isWindowMaximized={false}
          commandPalette={mockCommandPalette}
          {...handlers}
        />,
      );
      expect(screen.getByText('My App')).toBeTruthy();
      expect(screen.getByTestId('searchbar-trigger')).toBeTruthy();
    });

    test('renders user profile on windows', () => {
      render(
        <WindowControls
          title="My App"
          isWindowMaximized={false}
          user={{ name: 'Test User', status: 'online' }}
          onSignOut={vi.fn()}
          {...handlers}
        />,
      );
      expect(screen.getByTestId('avatar-button')).toBeTruthy();
    });

    test('renders sign-in button on windows when no user', () => {
      render(
        <WindowControls
          title="My App"
          isWindowMaximized={false}
          onSignIn={vi.fn()}
          {...handlers}
        />,
      );
      expect(screen.getByTestId('sign-in-button')).toBeTruthy();
    });

    test('renders menu, search, user profile, and buttons together', () => {
      render(
        <WindowControls
          title="My App"
          menuItems={menuItems}
          isWindowMaximized={false}
          commandPalette={mockCommandPalette}
          user={{ name: 'Test' }}
          onSignOut={vi.fn()}
          {...handlers}
        />,
      );
      expect(screen.getByText('File')).toBeTruthy();
      expect(screen.getByText('My App')).toBeTruthy();
      expect(screen.getByTestId('searchbar-trigger')).toBeTruthy();
      expect(screen.getByTestId('avatar-button')).toBeTruthy();
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(3);
    });
  });
});
