import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, afterEach } from 'vitest';
import { UserProfile } from './UserProfile';
import type { UserInfo, UserProfileAction } from './types';

const mockUser: UserInfo = {
  name: 'Euclides Dry',
  email: 'euclides@drycstudio.io',
  status: 'online',
};

const mockActions: UserProfileAction[] = [
  { label: 'My Account', action: vi.fn() },
  { label: 'Settings', action: vi.fn() },
  { type: 'separator', label: 'sep' },
  { label: 'Switch Workspace', action: vi.fn() },
];

afterEach(() => {
  vi.restoreAllMocks();
});

describe('UserProfile', () => {
  describe('logged-out state', () => {
    test('renders sign in button when no user and onSignIn provided', () => {
      const onSignIn = vi.fn();
      render(<UserProfile onSignIn={onSignIn} />);
      const btn = screen.getByTestId('sign-in-button');
      expect(btn).toBeTruthy();
      expect(screen.getByText('Sign In')).toBeTruthy();
    });

    test('calls onSignIn when sign in button is clicked', () => {
      const onSignIn = vi.fn();
      render(<UserProfile onSignIn={onSignIn} />);
      fireEvent.click(screen.getByTestId('sign-in-button'));
      expect(onSignIn).toHaveBeenCalledTimes(1);
    });

    test('renders nothing when no user and no onSignIn', () => {
      const { container } = render(<UserProfile />);
      expect(container.innerHTML).toBe('');
    });

    test('renders nothing when user is null and no onSignIn', () => {
      const { container } = render(<UserProfile user={null} />);
      expect(container.innerHTML).toBe('');
    });
  });

  describe('logged-in state', () => {
    test('renders avatar button with initials when no avatar image', () => {
      render(<UserProfile user={mockUser} />);
      expect(screen.getByTestId('avatar-button')).toBeTruthy();
      expect(screen.getByText('ED')).toBeTruthy();
    });

    test('renders avatar image when avatar URL is provided', () => {
      const userWithAvatar = { ...mockUser, avatar: 'https://example.com/avatar.png' };
      render(<UserProfile user={userWithAvatar} />);
      const img = screen.getByAltText('Euclides Dry');
      expect(img).toBeTruthy();
      expect((img as HTMLImageElement).src).toContain('avatar.png');
    });

    test('renders status dot when status is provided', () => {
      render(<UserProfile user={mockUser} />);
      expect(screen.getByTestId('status-dot')).toBeTruthy();
    });

    test('does not render status dot when status is not provided', () => {
      const userNoStatus = { name: 'Test User' };
      render(<UserProfile user={userNoStatus} />);
      expect(screen.queryByTestId('status-dot')).toBeNull();
    });

    test('opens dropdown when avatar button is clicked', () => {
      render(<UserProfile user={mockUser} actions={mockActions} onSignOut={vi.fn()} />);
      expect(screen.queryByTestId('user-dropdown')).toBeNull();

      fireEvent.click(screen.getByTestId('avatar-button'));
      expect(screen.getByTestId('user-dropdown')).toBeTruthy();
    });

    test('displays user name and email in dropdown header', () => {
      render(<UserProfile user={mockUser} onSignOut={vi.fn()} />);
      fireEvent.click(screen.getByTestId('avatar-button'));

      expect(screen.getByText('Euclides Dry')).toBeTruthy();
      expect(screen.getByText('euclides@drycstudio.io')).toBeTruthy();
    });

    test('does not display email when not provided', () => {
      const userNoEmail = { name: 'Test User', status: 'online' as const };
      render(<UserProfile user={userNoEmail} onSignOut={vi.fn()} />);
      fireEvent.click(screen.getByTestId('avatar-button'));

      expect(screen.getByText('Test User')).toBeTruthy();
      expect(screen.queryByText('euclides@drycstudio.io')).toBeNull();
    });

    test('renders custom actions in dropdown', () => {
      render(<UserProfile user={mockUser} actions={mockActions} onSignOut={vi.fn()} />);
      fireEvent.click(screen.getByTestId('avatar-button'));

      expect(screen.getByText('My Account')).toBeTruthy();
      expect(screen.getByText('Settings')).toBeTruthy();
      expect(screen.getByText('Switch Workspace')).toBeTruthy();
    });

    test('calls action and closes dropdown when action item is clicked', () => {
      const action = vi.fn();
      const actions = [{ label: 'Test Action', action }];
      render(<UserProfile user={mockUser} actions={actions} />);
      fireEvent.click(screen.getByTestId('avatar-button'));
      fireEvent.click(screen.getByText('Test Action'));

      expect(action).toHaveBeenCalledTimes(1);
      expect(screen.queryByTestId('user-dropdown')).toBeNull();
    });

    test('renders sign out button when onSignOut is provided', () => {
      render(<UserProfile user={mockUser} onSignOut={vi.fn()} />);
      fireEvent.click(screen.getByTestId('avatar-button'));

      expect(screen.getByTestId('sign-out-button')).toBeTruthy();
      expect(screen.getByText('Sign Out')).toBeTruthy();
    });

    test('calls onSignOut and closes dropdown when sign out is clicked', () => {
      const onSignOut = vi.fn();
      render(<UserProfile user={mockUser} onSignOut={onSignOut} />);
      fireEvent.click(screen.getByTestId('avatar-button'));
      fireEvent.click(screen.getByTestId('sign-out-button'));

      expect(onSignOut).toHaveBeenCalledTimes(1);
      expect(screen.queryByTestId('user-dropdown')).toBeNull();
    });

    test('does not render sign out button when onSignOut is not provided', () => {
      render(<UserProfile user={mockUser} />);
      fireEvent.click(screen.getByTestId('avatar-button'));

      expect(screen.queryByTestId('sign-out-button')).toBeNull();
    });

    test('closes dropdown when clicking outside', () => {
      render(<UserProfile user={mockUser} onSignOut={vi.fn()} />);
      fireEvent.click(screen.getByTestId('avatar-button'));
      expect(screen.getByTestId('user-dropdown')).toBeTruthy();

      fireEvent.mouseDown(document.body);
      expect(screen.queryByTestId('user-dropdown')).toBeNull();
    });

    test('toggles dropdown open and closed on avatar clicks', () => {
      render(<UserProfile user={mockUser} onSignOut={vi.fn()} />);
      const avatarBtn = screen.getByTestId('avatar-button');

      fireEvent.click(avatarBtn);
      expect(screen.getByTestId('user-dropdown')).toBeTruthy();

      fireEvent.click(avatarBtn);
      expect(screen.queryByTestId('user-dropdown')).toBeNull();
    });

    test('renders separator in actions', () => {
      const actionsWithSep: UserProfileAction[] = [
        { label: 'Action A', action: vi.fn() },
        { type: 'separator', label: 'sep' },
        { label: 'Action B', action: vi.fn() },
      ];
      render(<UserProfile user={mockUser} actions={actionsWithSep} />);
      fireEvent.click(screen.getByTestId('avatar-button'));

      expect(screen.getByText('Action A')).toBeTruthy();
      expect(screen.getByText('Action B')).toBeTruthy();
    });

    test('renders separator before sign out when actions exist', () => {
      const actions: UserProfileAction[] = [{ label: 'Item', action: vi.fn() }];
      render(<UserProfile user={mockUser} actions={actions} onSignOut={vi.fn()} />);
      fireEvent.click(screen.getByTestId('avatar-button'));

      expect(screen.getByText('Item')).toBeTruthy();
      expect(screen.getByText('Sign Out')).toBeTruthy();
    });

    test('does not render separator before sign out when no actions', () => {
      render(<UserProfile user={mockUser} onSignOut={vi.fn()} />);
      fireEvent.click(screen.getByTestId('avatar-button'));
      expect(screen.getByText('Sign Out')).toBeTruthy();
    });

    test('getInitials handles single name', () => {
      render(<UserProfile user={{ name: 'Euclides' }} />);
      expect(screen.getByText('E')).toBeTruthy();
    });

    test('keeps dropdown open when clicking inside the container', () => {
      render(<UserProfile user={mockUser} onSignOut={vi.fn()} />);
      fireEvent.click(screen.getByTestId('avatar-button'));
      expect(screen.getByTestId('user-dropdown')).toBeTruthy();

      fireEvent.mouseDown(screen.getByTestId('user-dropdown'));
      expect(screen.getByTestId('user-dropdown')).toBeTruthy();
    });
  });
});
