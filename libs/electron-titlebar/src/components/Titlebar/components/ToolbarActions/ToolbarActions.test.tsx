import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { ToolbarActions } from './ToolbarActions';
import { ToolbarActionItem } from './ToolbarActionItem';
import type { TitlebarAction } from './types';

const bellIcon = React.createElement('svg', { 'data-testid': 'icon-bell' });
const gearIcon = React.createElement('svg', { 'data-testid': 'icon-gear' });
const zapIcon = React.createElement('svg', { 'data-testid': 'icon-zap' });

describe('ToolbarActions', () => {
  test('renders nothing when no actions or renderActions', () => {
    const { container } = render(<ToolbarActions />);
    expect(container.innerHTML).toBe('');
  });

  test('renders nothing when actions is empty', () => {
    const { container } = render(<ToolbarActions actions={[]} />);
    expect(container.innerHTML).toBe('');
  });

  test('renders action buttons from actions array', () => {
    const actions: TitlebarAction[] = [
      { id: 'bell', icon: bellIcon, tooltip: 'Notifications' },
      { id: 'gear', icon: gearIcon, tooltip: 'Settings' },
    ];
    render(<ToolbarActions actions={actions} />);
    expect(screen.getByTestId('toolbar-action-bell')).toBeTruthy();
    expect(screen.getByTestId('toolbar-action-gear')).toBeTruthy();
  });

  test('renders custom content from renderActions', () => {
    render(
      <ToolbarActions renderActions={() => <button data-testid="custom-action">Custom</button>} />,
    );
    expect(screen.getByTestId('custom-action')).toBeTruthy();
  });

  test('renders both actions and renderActions together', () => {
    const actions: TitlebarAction[] = [
      { id: 'bell', icon: bellIcon, tooltip: 'Notifications' },
    ];
    render(
      <ToolbarActions
        actions={actions}
        renderActions={() => <button data-testid="custom-action">Custom</button>}
      />,
    );
    expect(screen.getByTestId('toolbar-action-bell')).toBeTruthy();
    expect(screen.getByTestId('custom-action')).toBeTruthy();
  });

  test('container has toolbar role', () => {
    const actions: TitlebarAction[] = [
      { id: 'bell', icon: bellIcon, tooltip: 'Notifications' },
    ];
    render(<ToolbarActions actions={actions} />);
    expect(screen.getByRole('toolbar')).toBeTruthy();
  });
});

describe('ToolbarActionItem', () => {
  test('renders icon', () => {
    const action: TitlebarAction = { id: 'bell', icon: bellIcon };
    render(<ToolbarActionItem action={action} />);
    expect(screen.getByTestId('icon-bell')).toBeTruthy();
  });

  test('calls onClick when clicked', () => {
    const onClick = vi.fn();
    const action: TitlebarAction = { id: 'bell', icon: bellIcon, onClick };
    render(<ToolbarActionItem action={action} />);
    fireEvent.click(screen.getByTestId('toolbar-action-bell'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  test('does not call onClick when disabled', () => {
    const onClick = vi.fn();
    const action: TitlebarAction = { id: 'bell', icon: bellIcon, onClick, disabled: true };
    render(<ToolbarActionItem action={action} />);
    fireEvent.click(screen.getByTestId('toolbar-action-bell'));
    expect(onClick).not.toHaveBeenCalled();
  });

  test('renders number badge', () => {
    const action: TitlebarAction = { id: 'bell', icon: bellIcon, badge: 5, badgeVariant: 'attention' };
    render(<ToolbarActionItem action={action} />);
    const badge = screen.getByTestId('toolbar-badge-bell');
    expect(badge.textContent).toBe('5');
  });

  test('renders 99+ for large badge counts', () => {
    const action: TitlebarAction = { id: 'bell', icon: bellIcon, badge: 150 };
    render(<ToolbarActionItem action={action} />);
    expect(screen.getByTestId('toolbar-badge-bell').textContent).toBe('99+');
  });

  test('renders dot badge for boolean true', () => {
    const action: TitlebarAction = { id: 'bell', icon: bellIcon, badge: true, badgeVariant: 'success' };
    render(<ToolbarActionItem action={action} />);
    const badge = screen.getByTestId('toolbar-badge-bell');
    expect(badge.textContent).toBe('');
  });

  test('does not render badge when badge is false', () => {
    const action: TitlebarAction = { id: 'bell', icon: bellIcon, badge: false };
    render(<ToolbarActionItem action={action} />);
    expect(screen.queryByTestId('toolbar-badge-bell')).toBeNull();
  });

  test('does not render badge when badge is 0', () => {
    const action: TitlebarAction = { id: 'bell', icon: bellIcon, badge: 0 };
    render(<ToolbarActionItem action={action} />);
    expect(screen.queryByTestId('toolbar-badge-bell')).toBeNull();
  });

  test('shows tooltip on hover', () => {
    const action: TitlebarAction = { id: 'bell', icon: bellIcon, tooltip: 'Notifications' };
    render(<ToolbarActionItem action={action} />);
    const wrapper = screen.getByTestId('toolbar-action-bell').parentElement!;
    fireEvent.mouseEnter(wrapper);
    expect(screen.getByText('Notifications')).toBeTruthy();
    fireEvent.mouseLeave(wrapper);
    expect(screen.queryByText('Notifications')).toBeNull();
  });

  test('opens dropdown on click when dropdown items provided', () => {
    const dropdownAction = vi.fn();
    const action: TitlebarAction = {
      id: 'bell',
      icon: bellIcon,
      dropdown: [
        { label: 'Mark all read', action: dropdownAction },
        { label: '', type: 'separator' },
        { label: 'Item 2', action: vi.fn() },
      ],
    };
    render(<ToolbarActionItem action={action} />);
    fireEvent.click(screen.getByTestId('toolbar-action-bell'));
    expect(screen.getByTestId('toolbar-dropdown-bell')).toBeTruthy();
    expect(screen.getByText('Mark all read')).toBeTruthy();
    expect(screen.getByText('Item 2')).toBeTruthy();
  });

  test('closes dropdown and calls action on dropdown item click', () => {
    const dropdownAction = vi.fn();
    const action: TitlebarAction = {
      id: 'bell',
      icon: bellIcon,
      dropdown: [{ label: 'Mark all read', action: dropdownAction }],
    };
    render(<ToolbarActionItem action={action} />);
    fireEvent.click(screen.getByTestId('toolbar-action-bell'));
    fireEvent.click(screen.getByText('Mark all read'));
    expect(dropdownAction).toHaveBeenCalledOnce();
    expect(screen.queryByTestId('toolbar-dropdown-bell')).toBeNull();
  });

  test('closes dropdown on Escape key', () => {
    const action: TitlebarAction = {
      id: 'bell',
      icon: bellIcon,
      dropdown: [{ label: 'Item', action: vi.fn() }],
    };
    render(<ToolbarActionItem action={action} />);
    fireEvent.click(screen.getByTestId('toolbar-action-bell'));
    expect(screen.getByTestId('toolbar-dropdown-bell')).toBeTruthy();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByTestId('toolbar-dropdown-bell')).toBeNull();
  });

  test('closes dropdown on click outside', () => {
    const action: TitlebarAction = {
      id: 'bell',
      icon: bellIcon,
      dropdown: [{ label: 'Item', action: vi.fn() }],
    };
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <ToolbarActionItem action={action} />
      </div>,
    );
    fireEvent.click(screen.getByTestId('toolbar-action-bell'));
    expect(screen.getByTestId('toolbar-dropdown-bell')).toBeTruthy();
    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByTestId('toolbar-dropdown-bell')).toBeNull();
  });

  test('hides tooltip when dropdown is open', () => {
    const action: TitlebarAction = {
      id: 'bell',
      icon: bellIcon,
      tooltip: 'Notifications',
      dropdown: [{ label: 'Item', action: vi.fn() }],
    };
    render(<ToolbarActionItem action={action} />);
    const button = screen.getByTestId('toolbar-action-bell');
    fireEvent.click(button);
    const wrapper = button.parentElement!;
    fireEvent.mouseEnter(wrapper);
    expect(screen.queryByText('Notifications')).toBeNull();
  });

  test('has correct aria-label from tooltip', () => {
    const action: TitlebarAction = { id: 'bell', icon: bellIcon, tooltip: 'Notifications' };
    render(<ToolbarActionItem action={action} />);
    expect(screen.getByTestId('toolbar-action-bell').getAttribute('aria-label')).toBe('Notifications');
  });

  test('does not register click outside listener when dropdown is closed', () => {
    const addSpy = vi.spyOn(document, 'addEventListener');
    const action: TitlebarAction = { id: 'bell', icon: bellIcon };
    render(<ToolbarActionItem action={action} />);
    const mousedownCalls = addSpy.mock.calls.filter(([ev]) => ev === 'mousedown');
    expect(mousedownCalls).toHaveLength(0);
    addSpy.mockRestore();
  });

  test('does not register escape listener when dropdown is closed', () => {
    const addSpy = vi.spyOn(document, 'addEventListener');
    const action: TitlebarAction = { id: 'bell', icon: bellIcon };
    render(<ToolbarActionItem action={action} />);
    const keydownCalls = addSpy.mock.calls.filter(([ev]) => ev === 'keydown');
    expect(keydownCalls).toHaveLength(0);
    addSpy.mockRestore();
  });

  test('does not call onClick when no onClick handler is provided', () => {
    const action: TitlebarAction = { id: 'bell', icon: bellIcon };
    render(<ToolbarActionItem action={action} />);
    fireEvent.click(screen.getByTestId('toolbar-action-bell'));
  });

  test('toggles dropdown closed when clicking action button again', () => {
    const action: TitlebarAction = {
      id: 'bell',
      icon: bellIcon,
      dropdown: [{ label: 'Item', action: vi.fn() }],
    };
    render(<ToolbarActionItem action={action} />);
    fireEvent.click(screen.getByTestId('toolbar-action-bell'));
    expect(screen.getByTestId('toolbar-dropdown-bell')).toBeTruthy();
    fireEvent.click(screen.getByTestId('toolbar-action-bell'));
    expect(screen.queryByTestId('toolbar-dropdown-bell')).toBeNull();
  });

  test('renders without badge when badge is undefined', () => {
    const action: TitlebarAction = { id: 'bell', icon: bellIcon };
    render(<ToolbarActionItem action={action} />);
    expect(screen.queryByTestId('toolbar-badge-bell')).toBeNull();
  });

  test('renders dropdown items with icons', () => {
    const action: TitlebarAction = {
      id: 'bell',
      icon: bellIcon,
      dropdown: [{ label: 'Deploy', icon: zapIcon, action: vi.fn() }],
    };
    render(<ToolbarActionItem action={action} />);
    fireEvent.click(screen.getByTestId('toolbar-action-bell'));
    expect(screen.getByTestId('icon-zap')).toBeTruthy();
  });

  test('does not fire action on disabled dropdown item click', () => {
    const disabledAction = vi.fn();
    const enabledAction = vi.fn();
    const action: TitlebarAction = {
      id: 'bell',
      icon: bellIcon,
      dropdown: [
        { label: 'Disabled Item', action: disabledAction, disabled: true },
        { label: 'Enabled Item', action: enabledAction },
      ],
    };
    render(<ToolbarActionItem action={action} />);
    fireEvent.click(screen.getByTestId('toolbar-action-bell'));
    const disabledBtn = screen.getByText('Disabled Item');
    fireEvent.click(disabledBtn);
    expect(disabledAction).not.toHaveBeenCalled();
    expect(screen.getByTestId('toolbar-dropdown-bell')).toBeTruthy();
  });

  test('applies highlight variant when highlight is true', () => {
    const action: TitlebarAction = { id: 'upgrade', icon: zapIcon, highlight: true };
    render(<ToolbarActionItem action={action} />);
    const button = screen.getByTestId('toolbar-action-upgrade');
    expect(button.className).toContain('highlight');
  });

  test('badge defaults to default variant when badgeVariant is not specified', () => {
    const action: TitlebarAction = { id: 'bell', icon: bellIcon, badge: 2 };
    render(<ToolbarActionItem action={action} />);
    const badge = screen.getByTestId('toolbar-badge-bell');
    expect(badge).toBeTruthy();
    expect(badge.textContent).toBe('2');
  });

  describe('dropdown keyboard navigation', () => {
    test('ArrowDown moves focus to next item', () => {
      const action: TitlebarAction = {
        id: 'bell',
        icon: bellIcon,
        dropdown: [
          { label: 'Item A', action: vi.fn() },
          { label: 'Item B', action: vi.fn() },
        ],
      };
      render(<ToolbarActionItem action={action} />);
      fireEvent.click(screen.getByTestId('toolbar-action-bell'));
      fireEvent.keyDown(document, { key: 'ArrowDown' });
      expect(screen.getByText('Item A').getAttribute('data-focused')).toBe('true');
      fireEvent.keyDown(document, { key: 'ArrowDown' });
      expect(screen.getByText('Item B').getAttribute('data-focused')).toBe('true');
    });

    test('ArrowDown wraps to first item at end of list', () => {
      const action: TitlebarAction = {
        id: 'bell',
        icon: bellIcon,
        dropdown: [
          { label: 'Item A', action: vi.fn() },
          { label: 'Item B', action: vi.fn() },
        ],
      };
      render(<ToolbarActionItem action={action} />);
      fireEvent.click(screen.getByTestId('toolbar-action-bell'));
      fireEvent.keyDown(document, { key: 'ArrowDown' });
      fireEvent.keyDown(document, { key: 'ArrowDown' });
      fireEvent.keyDown(document, { key: 'ArrowDown' });
      expect(screen.getByText('Item A').getAttribute('data-focused')).toBe('true');
    });

    test('ArrowUp moves focus to previous item', () => {
      const action: TitlebarAction = {
        id: 'bell',
        icon: bellIcon,
        dropdown: [
          { label: 'Item A', action: vi.fn() },
          { label: 'Item B', action: vi.fn() },
        ],
      };
      render(<ToolbarActionItem action={action} />);
      fireEvent.click(screen.getByTestId('toolbar-action-bell'));
      fireEvent.keyDown(document, { key: 'ArrowDown' });
      fireEvent.keyDown(document, { key: 'ArrowDown' });
      fireEvent.keyDown(document, { key: 'ArrowUp' });
      expect(screen.getByText('Item A').getAttribute('data-focused')).toBe('true');
    });

    test('ArrowUp wraps to last item from start', () => {
      const action: TitlebarAction = {
        id: 'bell',
        icon: bellIcon,
        dropdown: [
          { label: 'Item A', action: vi.fn() },
          { label: 'Item B', action: vi.fn() },
        ],
      };
      render(<ToolbarActionItem action={action} />);
      fireEvent.click(screen.getByTestId('toolbar-action-bell'));
      fireEvent.keyDown(document, { key: 'ArrowUp' });
      expect(screen.getByText('Item B').getAttribute('data-focused')).toBe('true');
    });

    test('ArrowDown skips separators and disabled items', () => {
      const action: TitlebarAction = {
        id: 'bell',
        icon: bellIcon,
        dropdown: [
          { label: 'Item A', action: vi.fn() },
          { label: '', type: 'separator' },
          { label: 'Disabled', action: vi.fn(), disabled: true },
          { label: 'Item B', action: vi.fn() },
        ],
      };
      render(<ToolbarActionItem action={action} />);
      fireEvent.click(screen.getByTestId('toolbar-action-bell'));
      fireEvent.keyDown(document, { key: 'ArrowDown' });
      fireEvent.keyDown(document, { key: 'ArrowDown' });
      expect(screen.getByText('Item B').getAttribute('data-focused')).toBe('true');
    });

    test('Enter activates the focused item and closes dropdown', () => {
      const itemAction = vi.fn();
      const action: TitlebarAction = {
        id: 'bell',
        icon: bellIcon,
        dropdown: [
          { label: 'Item A', action: itemAction },
          { label: 'Item B', action: vi.fn() },
        ],
      };
      render(<ToolbarActionItem action={action} />);
      fireEvent.click(screen.getByTestId('toolbar-action-bell'));
      fireEvent.keyDown(document, { key: 'ArrowDown' });
      fireEvent.keyDown(document, { key: 'Enter' });
      expect(itemAction).toHaveBeenCalledOnce();
      expect(screen.queryByTestId('toolbar-dropdown-bell')).toBeNull();
    });

    test('Enter does nothing when no item is focused', () => {
      const itemAction = vi.fn();
      const action: TitlebarAction = {
        id: 'bell',
        icon: bellIcon,
        dropdown: [{ label: 'Item A', action: itemAction }],
      };
      render(<ToolbarActionItem action={action} />);
      fireEvent.click(screen.getByTestId('toolbar-action-bell'));
      fireEvent.keyDown(document, { key: 'Enter' });
      expect(itemAction).not.toHaveBeenCalled();
      expect(screen.getByTestId('toolbar-dropdown-bell')).toBeTruthy();
    });

    test('mouse enter on item updates focused index', () => {
      const action: TitlebarAction = {
        id: 'bell',
        icon: bellIcon,
        dropdown: [
          { label: 'Item A', action: vi.fn() },
          { label: 'Item B', action: vi.fn() },
        ],
      };
      render(<ToolbarActionItem action={action} />);
      fireEvent.click(screen.getByTestId('toolbar-action-bell'));
      fireEvent.mouseEnter(screen.getByText('Item B'));
      expect(screen.getByText('Item B').getAttribute('data-focused')).toBe('true');
    });

    test('focused index resets when dropdown closes', () => {
      const action: TitlebarAction = {
        id: 'bell',
        icon: bellIcon,
        dropdown: [
          { label: 'Item A', action: vi.fn() },
          { label: 'Item B', action: vi.fn() },
        ],
      };
      render(<ToolbarActionItem action={action} />);
      fireEvent.click(screen.getByTestId('toolbar-action-bell'));
      fireEvent.keyDown(document, { key: 'ArrowDown' });
      fireEvent.keyDown(document, { key: 'Escape' });
      fireEvent.click(screen.getByTestId('toolbar-action-bell'));
      const itemA = screen.getByText('Item A');
      const itemB = screen.getByText('Item B');
      expect(itemA.getAttribute('data-focused')).toBeNull();
      expect(itemB.getAttribute('data-focused')).toBeNull();
    });
  });

  describe('filled variant (split button)', () => {
    test('renders label text and icon in filled button', () => {
      const action: TitlebarAction = {
        id: 'upgrade',
        icon: zapIcon,
        label: 'Update v2.1.0',
        variant: 'filled',
        onClick: vi.fn(),
      };
      render(<ToolbarActionItem action={action} />);
      expect(screen.getByText('Update v2.1.0')).toBeTruthy();
      expect(screen.getByTestId('icon-zap')).toBeTruthy();
    });

    test('split button container has role="group" and aria-label', () => {
      const action: TitlebarAction = {
        id: 'upgrade',
        icon: zapIcon,
        label: 'Update',
        variant: 'filled',
        tooltip: 'Update Available',
        onClick: vi.fn(),
      };
      render(<ToolbarActionItem action={action} />);
      const container = screen.getByTestId('toolbar-action-upgrade');
      expect(container.getAttribute('role')).toBe('group');
      expect(container.getAttribute('aria-label')).toBe('Update Available');
    });

    test('main button fires onClick', () => {
      const onClick = vi.fn();
      const action: TitlebarAction = {
        id: 'upgrade',
        icon: zapIcon,
        label: 'Update',
        variant: 'filled',
        onClick,
      };
      render(<ToolbarActionItem action={action} />);
      fireEvent.click(screen.getByTestId('toolbar-action-upgrade-main'));
      expect(onClick).toHaveBeenCalledOnce();
    });

    test('main button does not fire onClick when disabled', () => {
      const onClick = vi.fn();
      const action: TitlebarAction = {
        id: 'upgrade',
        icon: zapIcon,
        label: 'Update',
        variant: 'filled',
        onClick,
        disabled: true,
      };
      render(<ToolbarActionItem action={action} />);
      fireEvent.click(screen.getByTestId('toolbar-action-upgrade-main'));
      expect(onClick).not.toHaveBeenCalled();
    });

    test('renders chevron when dropdown is provided', () => {
      const action: TitlebarAction = {
        id: 'upgrade',
        icon: zapIcon,
        label: 'Update',
        variant: 'filled',
        onClick: vi.fn(),
        dropdown: [{ label: 'Download Only', action: vi.fn() }],
      };
      render(<ToolbarActionItem action={action} />);
      expect(screen.getByTestId('toolbar-action-upgrade-chevron')).toBeTruthy();
    });

    test('does not render chevron when no dropdown', () => {
      const action: TitlebarAction = {
        id: 'upgrade',
        icon: zapIcon,
        label: 'Update',
        variant: 'filled',
        onClick: vi.fn(),
      };
      render(<ToolbarActionItem action={action} />);
      expect(screen.queryByTestId('toolbar-action-upgrade-chevron')).toBeNull();
    });

    test('chevron opens dropdown without firing main onClick', () => {
      const onClick = vi.fn();
      const dropdownAction = vi.fn();
      const action: TitlebarAction = {
        id: 'upgrade',
        icon: zapIcon,
        label: 'Update',
        variant: 'filled',
        onClick,
        dropdown: [{ label: 'Download Only', action: dropdownAction }],
      };
      render(<ToolbarActionItem action={action} />);
      fireEvent.click(screen.getByTestId('toolbar-action-upgrade-chevron'));
      expect(onClick).not.toHaveBeenCalled();
      expect(screen.getByTestId('toolbar-dropdown-upgrade')).toBeTruthy();
      expect(screen.getByText('Download Only')).toBeTruthy();
    });

    test('dropdown item fires action and closes', () => {
      const dropdownAction = vi.fn();
      const action: TitlebarAction = {
        id: 'upgrade',
        icon: zapIcon,
        label: 'Update',
        variant: 'filled',
        dropdown: [
          { label: 'Download & Update', action: dropdownAction },
          { label: 'Download Only', action: vi.fn() },
        ],
      };
      render(<ToolbarActionItem action={action} />);
      fireEvent.click(screen.getByTestId('toolbar-action-upgrade-chevron'));
      fireEvent.click(screen.getByText('Download & Update'));
      expect(dropdownAction).toHaveBeenCalledOnce();
      expect(screen.queryByTestId('toolbar-dropdown-upgrade')).toBeNull();
    });

    test('chevron does not open dropdown when disabled', () => {
      const action: TitlebarAction = {
        id: 'upgrade',
        icon: zapIcon,
        label: 'Update',
        variant: 'filled',
        disabled: true,
        dropdown: [{ label: 'Download Only', action: vi.fn() }],
      };
      render(<ToolbarActionItem action={action} />);
      fireEvent.click(screen.getByTestId('toolbar-action-upgrade-chevron'));
      expect(screen.queryByTestId('toolbar-dropdown-upgrade')).toBeNull();
    });

    test('shows tooltip on hover', () => {
      const action: TitlebarAction = {
        id: 'upgrade',
        icon: zapIcon,
        label: 'Update',
        variant: 'filled',
        tooltip: 'Update Available',
      };
      render(<ToolbarActionItem action={action} />);
      const wrapper = screen.getByTestId('toolbar-action-upgrade').parentElement!;
      fireEvent.mouseEnter(wrapper);
      expect(screen.getByText('Update Available')).toBeTruthy();
    });

    test('Escape closes dropdown opened via chevron', () => {
      const action: TitlebarAction = {
        id: 'upgrade',
        icon: zapIcon,
        label: 'Update',
        variant: 'filled',
        dropdown: [{ label: 'Item', action: vi.fn() }],
      };
      render(<ToolbarActionItem action={action} />);
      fireEvent.click(screen.getByTestId('toolbar-action-upgrade-chevron'));
      expect(screen.getByTestId('toolbar-dropdown-upgrade')).toBeTruthy();
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.queryByTestId('toolbar-dropdown-upgrade')).toBeNull();
    });
  });
});
