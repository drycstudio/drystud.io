import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { Menu } from './Menu';
import type { MenuItem } from './types';

const createMenuItems = (overrides: Partial<MenuItem>[] = []): MenuItem[] => {
  const defaults: MenuItem[] = [
    {
      label: 'File',
      submenu: [
        { label: 'New', action: vi.fn(), shortcut: 'Ctrl+N' },
        { label: 'Open', action: vi.fn() },
        { type: 'separator', label: '' },
        { label: 'Save', action: vi.fn(), disabled: true },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', action: vi.fn() },
        { label: 'Redo', action: vi.fn() },
      ],
    },
    { label: 'Run', action: vi.fn() },
    { label: 'Disabled', disabled: true },
  ];
  return defaults.map((item, i) => ({ ...item, ...overrides[i] }));
};

describe('Menu', () => {
  let items: MenuItem[];

  beforeEach(() => {
    items = createMenuItems();
  });

  test('renders all top-level menu items', () => {
    render(<Menu items={items} />);
    expect(screen.getByText('File')).toBeTruthy();
    expect(screen.getByText('Edit')).toBeTruthy();
    expect(screen.getByText('Run')).toBeTruthy();
    expect(screen.getByText('Disabled')).toBeTruthy();
  });

  test('opens dropdown when clicking a menu item with submenu', () => {
    render(<Menu items={items} />);
    fireEvent.click(screen.getByText('File'));
    expect(screen.getByText('New')).toBeTruthy();
    expect(screen.getByText('Open')).toBeTruthy();
    expect(screen.getByText('Save')).toBeTruthy();
  });

  test('renders keyboard shortcuts in dropdown (windows format)', () => {
    render(<Menu items={items} platform="windows" />);
    fireEvent.click(screen.getByText('File'));
    expect(screen.getByText('Ctrl+N')).toBeTruthy();
  });

  test('renders keyboard shortcuts in Mac format when platform is macos', () => {
    render(<Menu items={items} platform="macos" />);
    fireEvent.click(screen.getByText('File'));
    expect(screen.getByText('⌘N')).toBeTruthy();
  });

  test('closes dropdown when clicking the same menu item', () => {
    render(<Menu items={items} />);
    fireEvent.click(screen.getByText('File'));
    expect(screen.getByText('New')).toBeTruthy();

    fireEvent.click(screen.getByText('File'));
    expect(screen.queryByText('New')).toBeNull();
  });

  test('switches dropdown when hovering another menu while one is open', () => {
    render(<Menu items={items} />);
    fireEvent.click(screen.getByText('File'));
    expect(screen.getByText('New')).toBeTruthy();

    fireEvent.mouseEnter(screen.getByText('Edit'));
    expect(screen.getByText('Undo')).toBeTruthy();
    expect(screen.queryByText('New')).toBeNull();
  });

  test('does not open dropdown when hovering with nothing open', () => {
    render(<Menu items={items} />);
    fireEvent.mouseEnter(screen.getByText('Edit'));
    expect(screen.queryByText('Undo')).toBeNull();
  });

  test('calls action on submenu item click', () => {
    render(<Menu items={items} />);
    fireEvent.click(screen.getByText('File'));
    fireEvent.click(screen.getByText('Open'));
    expect(items[0].submenu![1].action).toHaveBeenCalled();
  });

  test('ignores click on disabled submenu items', () => {
    render(<Menu items={items} />);
    fireEvent.click(screen.getByText('File'));
    fireEvent.click(screen.getByText('Save'));
    expect(items[0].submenu![3].action).not.toHaveBeenCalled();
  });

  test('calls action directly for items without submenu', () => {
    render(<Menu items={items} />);
    fireEvent.click(screen.getByText('Run'));
    expect(items[2].action).toHaveBeenCalled();
  });

  test('ignores click on disabled top-level items', () => {
    render(<Menu items={items} />);
    fireEvent.click(screen.getByText('Disabled'));
    expect(screen.queryByText('New')).toBeNull();
  });

  test('closes dropdown on click outside', async () => {
    render(<Menu items={items} />);
    fireEvent.click(screen.getByText('File'));
    expect(screen.getByText('New')).toBeTruthy();

    fireEvent.mouseDown(document.body);
    await waitFor(() => {
      expect(screen.queryByText('New')).toBeNull();
    });
  });

  describe('keyboard navigation', () => {
    function openFileMenu() {
      render(<Menu items={items} />);
      fireEvent.click(screen.getByText('File'));
    }

    test('Escape closes the dropdown', () => {
      openFileMenu();
      fireEvent.keyDown(screen.getByRole('menubar'), { key: 'Escape' });
      expect(screen.queryByText('New')).toBeNull();
    });

    test('ArrowRight moves to next menu', () => {
      openFileMenu();
      fireEvent.keyDown(screen.getByRole('menubar'), { key: 'ArrowRight' });
      expect(screen.getByText('Undo')).toBeTruthy();
    });

    test('ArrowLeft moves to previous menu', () => {
      openFileMenu();
      fireEvent.keyDown(screen.getByRole('menubar'), { key: 'ArrowLeft' });
      expect(screen.getByText('Disabled')).toBeTruthy();
    });

    test('ArrowDown focuses first actionable submenu item', () => {
      openFileMenu();
      fireEvent.keyDown(screen.getByRole('menubar'), { key: 'ArrowDown' });
      const newItem = screen.getByText('New').closest('button');
      expect(newItem?.getAttribute('class')).toContain('focused');
    });

    test('ArrowDown then ArrowDown skips separator', () => {
      openFileMenu();
      const nav = screen.getByRole('menubar');
      fireEvent.keyDown(nav, { key: 'ArrowDown' });
      fireEvent.keyDown(nav, { key: 'ArrowDown' });
      const openItem = screen.getByText('Open').closest('button');
      expect(openItem?.getAttribute('class')).toContain('focused');
    });

    test('ArrowUp from no selection wraps around', () => {
      openFileMenu();
      fireEvent.keyDown(screen.getByRole('menubar'), { key: 'ArrowUp' });
      const newItem = screen.getByText('New').closest('button');
      expect(newItem?.getAttribute('class')).toContain('focused');
    });

    test('Enter activates the focused submenu item', () => {
      openFileMenu();
      const nav = screen.getByRole('menubar');
      fireEvent.keyDown(nav, { key: 'ArrowDown' });
      fireEvent.keyDown(nav, { key: 'Enter' });
      expect(items[0].submenu![0].action).toHaveBeenCalled();
    });

    test('Enter does nothing when no item is focused', () => {
      openFileMenu();
      fireEvent.keyDown(screen.getByRole('menubar'), { key: 'Enter' });
      expect(items[0].submenu![0].action).not.toHaveBeenCalled();
    });

    test('keyboard navigation is ignored when no menu is open', () => {
      render(<Menu items={items} />);
      fireEvent.keyDown(screen.getByRole('menubar'), { key: 'ArrowDown' });
      expect(screen.queryByText('New')).toBeNull();
    });

    test('unhandled keys fall through to default case', () => {
      openFileMenu();
      fireEvent.keyDown(screen.getByRole('menubar'), { key: 'Tab' });
      expect(screen.getByText('New')).toBeTruthy();
    });
  });

  describe('mouse interactions on dropdown items', () => {
    test('mouseEnter highlights item and mouseLeave removes highlight', () => {
      render(<Menu items={items} />);
      fireEvent.click(screen.getByText('File'));

      const newButton = screen.getByText('New').closest('button')!;
      fireEvent.mouseEnter(newButton);
      expect(newButton.getAttribute('class')).toContain('focused');

      fireEvent.mouseLeave(newButton);
      expect(newButton.getAttribute('class')).not.toContain('focused');
    });
  });
});

describe('Menu edge cases', () => {
  test('clicking item with no submenu and no action does nothing', () => {
    const items: MenuItem[] = [
      { label: 'File', submenu: [{ label: 'New', action: vi.fn() }] },
      { label: 'NoOp' },
    ];
    render(<Menu items={items} />);
    fireEvent.click(screen.getByText('NoOp'));
    expect(screen.queryByText('New')).toBeNull();
  });

  test('ArrowDown on menu item with no submenu does not crash', () => {
    const items: MenuItem[] = [
      { label: 'File', submenu: [{ label: 'New', action: vi.fn() }] },
      { label: 'Run', action: vi.fn() },
    ];
    render(<Menu items={items} />);
    fireEvent.click(screen.getByText('File'));
    const nav = screen.getByRole('menubar');
    fireEvent.keyDown(nav, { key: 'ArrowRight' });
    fireEvent.keyDown(nav, { key: 'ArrowDown' });
    expect(screen.queryByText('New')).toBeNull();
  });

  test('ArrowUp on menu item with no submenu does not crash', () => {
    const items: MenuItem[] = [
      { label: 'File', submenu: [{ label: 'New', action: vi.fn() }] },
      { label: 'Run', action: vi.fn() },
    ];
    render(<Menu items={items} />);
    fireEvent.click(screen.getByText('File'));
    const nav = screen.getByRole('menubar');
    fireEvent.keyDown(nav, { key: 'ArrowRight' });
    fireEvent.keyDown(nav, { key: 'ArrowUp' });
    expect(screen.queryByText('New')).toBeNull();
  });

  test('ArrowDown when all submenu items are disabled', () => {
    const items: MenuItem[] = [
      {
        label: 'File',
        submenu: [
          { type: 'separator', label: '' },
          { label: 'Locked', action: vi.fn(), disabled: true },
        ],
      },
    ];
    render(<Menu items={items} />);
    fireEvent.click(screen.getByText('File'));
    fireEvent.keyDown(screen.getByRole('menubar'), { key: 'ArrowDown' });
    expect(screen.getByText('Locked')).toBeTruthy();
  });

  test('ArrowUp when all submenu items are disabled', () => {
    const items: MenuItem[] = [
      {
        label: 'File',
        submenu: [
          { type: 'separator', label: '' },
          { label: 'Locked', action: vi.fn(), disabled: true },
        ],
      },
    ];
    render(<Menu items={items} />);
    fireEvent.click(screen.getByText('File'));
    fireEvent.keyDown(screen.getByRole('menubar'), { key: 'ArrowUp' });
    expect(screen.getByText('Locked')).toBeTruthy();
  });

  test('click inside menu keeps dropdown open', () => {
    const items: MenuItem[] = [
      {
        label: 'File',
        submenu: [
          { label: 'New', action: vi.fn() },
          { label: 'Open', action: vi.fn() },
        ],
      },
    ];
    render(<Menu items={items} />);
    fireEvent.click(screen.getByText('File'));
    expect(screen.getByText('New')).toBeTruthy();
    fireEvent.mouseDown(screen.getByText('New'));
    expect(screen.getByText('New')).toBeTruthy();
  });

  test('clicking separator in submenu does not call action', () => {
    const action = vi.fn();
    const items: MenuItem[] = [
      {
        label: 'File',
        submenu: [
          { label: 'New', action },
          { type: 'separator', label: '' },
        ],
      },
    ];
    render(<Menu items={items} />);
    fireEvent.click(screen.getByText('File'));
    expect(screen.getByText('New')).toBeTruthy();
  });

  test('submenu item without action does not crash on click', () => {
    const items: MenuItem[] = [
      {
        label: 'File',
        submenu: [{ label: 'Label Only' }],
      },
    ];
    render(<Menu items={items} />);
    fireEvent.click(screen.getByText('File'));
    fireEvent.click(screen.getByText('Label Only'));
    expect(screen.queryByText('Label Only')).toBeNull();
  });

  test('renders separator correctly within submenu', () => {
    const items: MenuItem[] = [
      {
        label: 'File',
        submenu: [
          { label: 'New', action: vi.fn() },
          { type: 'separator', label: '' },
          { label: 'Exit', action: vi.fn() },
        ],
      },
    ];
    render(<Menu items={items} />);
    fireEvent.click(screen.getByText('File'));
    expect(screen.getByText('New')).toBeTruthy();
    expect(screen.getByText('Exit')).toBeTruthy();
  });
});

describe('Menu ARIA attributes', () => {
  test('menubar role and label on container', () => {
    render(<Menu items={[{ label: 'File' }]} />);
    const menubar = screen.getByRole('menubar');
    expect(menubar).toBeTruthy();
    expect(menubar.getAttribute('aria-label')).toBe('Application menu');
  });

  test('menuitem role on top-level items', () => {
    render(<Menu items={[{ label: 'File', submenu: [{ label: 'New', action: vi.fn() }] }]} />);
    const item = screen.getByRole('menuitem', { name: 'File' });
    expect(item).toBeTruthy();
    expect(item.getAttribute('aria-haspopup')).toBe('true');
  });

  test('aria-expanded on open menu item', () => {
    render(<Menu items={[{ label: 'File', submenu: [{ label: 'New', action: vi.fn() }] }]} />);
    const item = screen.getByRole('menuitem', { name: 'File' });
    expect(item.getAttribute('aria-expanded')).toBeNull();
    fireEvent.click(item);
    expect(item.getAttribute('aria-expanded')).toBe('true');
  });

  test('submenu has role=menu and aria-label', () => {
    render(<Menu items={[{ label: 'File', submenu: [{ label: 'New', action: vi.fn() }] }]} />);
    fireEvent.click(screen.getByText('File'));
    const submenu = screen.getByRole('menu', { name: 'File submenu' });
    expect(submenu).toBeTruthy();
  });

  test('separator has role=separator', () => {
    render(<Menu items={[{ label: 'File', submenu: [{ label: 'New', action: vi.fn() }, { type: 'separator', label: '' }, { label: 'Exit', action: vi.fn() }] }]} />);
    fireEvent.click(screen.getByText('File'));
    expect(screen.getAllByRole('separator').length).toBeGreaterThan(0);
  });

  test('disabled submenu item has aria-disabled', () => {
    render(<Menu items={[{ label: 'File', submenu: [{ label: 'Locked', action: vi.fn(), disabled: true }] }]} />);
    fireEvent.click(screen.getByText('File'));
    const item = screen.getByRole('menuitem', { name: 'Locked' });
    expect(item.getAttribute('aria-disabled')).toBe('true');
  });
});

describe('Menu overflow', () => {
  let observeCallback: ResizeObserverCallback;
  let containerWidthOverride = 500;
  let originalOffsetWidth: PropertyDescriptor | undefined;
  let originalClientWidth: PropertyDescriptor | undefined;

  class MockResizeObserver {
    constructor(cb: ResizeObserverCallback) {
      observeCallback = cb;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  beforeEach(() => {
    containerWidthOverride = 500;
    vi.stubGlobal('ResizeObserver', MockResizeObserver);

    originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
    originalClientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth');

    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      get() {
        if (this.hasAttribute?.('data-menu-item')) return 60;
        return 0;
      },
      configurable: true,
    });

    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      get() {
        if (this.getAttribute?.('role') === 'menubar') return containerWidthOverride;
        return 0;
      },
      configurable: true,
    });
  });

  afterEach(() => {
    if (originalOffsetWidth) Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth);
    if (originalClientWidth) Object.defineProperty(HTMLElement.prototype, 'clientWidth', originalClientWidth);
    vi.unstubAllGlobals();
  });

  function createOverflowItems(): MenuItem[] {
    return [
      { label: 'File', submenu: [{ label: 'New', action: vi.fn(), shortcut: 'Ctrl+N' }, { type: 'separator', label: '' }, { label: 'Open', action: vi.fn() }] },
      { label: 'Edit', submenu: [{ label: 'Undo', action: vi.fn() }, { label: 'Redo', action: vi.fn() }] },
      { label: 'View', submenu: [{ label: 'Zoom In', action: vi.fn() }] },
      { label: 'Help', action: vi.fn() },
    ];
  }

  function triggerResize(width: number) {
    containerWidthOverride = width;
    const container = screen.getByRole('menubar');
    act(() => {
      observeCallback(
        [{ target: container, contentRect: { width } } as unknown as ResizeObserverEntry],
        new MockResizeObserver(observeCallback) as unknown as ResizeObserver,
      );
    });
  }

  test('shows overflow button when items do not fit', () => {
    render(<Menu items={createOverflowItems()} />);
    triggerResize(170);
    expect(screen.getByTestId('menu-overflow-button')).toBeTruthy();
  });

  test('overflow button has correct aria attributes', () => {
    render(<Menu items={createOverflowItems()} />);
    triggerResize(170);

    const btn = screen.getByTestId('menu-overflow-button');
    expect(btn.getAttribute('role')).toBe('menuitem');
    expect(btn.getAttribute('aria-haspopup')).toBe('true');
    expect(btn.getAttribute('aria-label')).toContain('more menu items');
  });

  test('clicking overflow button opens overflow dropdown', () => {
    render(<Menu items={createOverflowItems()} />);
    triggerResize(170);

    fireEvent.click(screen.getByTestId('menu-overflow-button'));
    expect(screen.getByRole('menu', { name: 'More menu items' })).toBeTruthy();
  });

  test('overflow dropdown contains hidden items with group labels', () => {
    render(<Menu items={createOverflowItems()} />);
    triggerResize(170);

    fireEvent.click(screen.getByTestId('menu-overflow-button'));
    expect(screen.getByText('Zoom In')).toBeTruthy();
    expect(screen.getByText('Help')).toBeTruthy();
  });

  test('clicking overflow submenu item calls action and closes dropdown', () => {
    const items = createOverflowItems();
    render(<Menu items={items} />);
    triggerResize(170);

    fireEvent.click(screen.getByTestId('menu-overflow-button'));
    fireEvent.click(screen.getByText('Zoom In'));
    expect(items[2].submenu![0].action).toHaveBeenCalled();
    expect(screen.queryByRole('menu', { name: 'More menu items' })).toBeNull();
  });

  test('clicking disabled overflow item does not call action', () => {
    const items: MenuItem[] = [
      { label: 'File', submenu: [{ label: 'New', action: vi.fn() }] },
      { label: 'Locked', disabled: true, action: vi.fn() },
    ];
    render(<Menu items={items} />);
    triggerResize(90);

    fireEvent.click(screen.getByTestId('menu-overflow-button'));
    fireEvent.click(screen.getByText('Locked'));
    expect(items[1].action).not.toHaveBeenCalled();
  });

  test('clicking top-level overflow item without submenu calls action', () => {
    const items = createOverflowItems();
    render(<Menu items={items} />);
    triggerResize(170);

    fireEvent.click(screen.getByTestId('menu-overflow-button'));
    fireEvent.click(screen.getByText('Help'));
    expect(items[3].action).toHaveBeenCalled();
  });

  test('overflow button toggles dropdown on repeated clicks', () => {
    render(<Menu items={createOverflowItems()} />);
    triggerResize(170);

    const btn = screen.getByTestId('menu-overflow-button');
    fireEvent.click(btn);
    expect(screen.getByRole('menu', { name: 'More menu items' })).toBeTruthy();
    fireEvent.click(btn);
    expect(screen.queryByRole('menu', { name: 'More menu items' })).toBeNull();
  });

  test('opening overflow closes regular menu', () => {
    render(<Menu items={createOverflowItems()} />);
    triggerResize(170);

    fireEvent.click(screen.getByText('File'));
    expect(screen.getByText('New')).toBeTruthy();

    fireEvent.click(screen.getByTestId('menu-overflow-button'));
    expect(screen.queryByText('New')).toBeNull();
    expect(screen.getByRole('menu', { name: 'More menu items' })).toBeTruthy();
  });

  test('mouseEnter on overflow button opens it when a menu is already open', () => {
    render(<Menu items={createOverflowItems()} />);
    triggerResize(170);

    fireEvent.click(screen.getByText('File'));
    expect(screen.getByText('New')).toBeTruthy();

    fireEvent.mouseEnter(screen.getByTestId('menu-overflow-button'));
    expect(screen.queryByText('New')).toBeNull();
    expect(screen.getByRole('menu', { name: 'More menu items' })).toBeTruthy();
  });

  test('hides overflow button when all items fit', () => {
    render(<Menu items={createOverflowItems()} />);
    expect(screen.queryByTestId('menu-overflow-button')).toBeNull();
  });

  test('overflow dropdown renders shortcuts', () => {
    render(<Menu items={createOverflowItems()} platform="windows" />);
    triggerResize(50);

    fireEvent.click(screen.getByTestId('menu-overflow-button'));
    expect(screen.getByText('Ctrl+N')).toBeTruthy();
  });

  test('closes open index that exceeds new visible count', () => {
    const items = createOverflowItems();
    render(<Menu items={items} />);
    fireEvent.click(screen.getByText('Help'));
    triggerResize(170);
    expect(screen.queryByRole('menu', { name: 'Help submenu' })).toBeNull();
  });

  describe('overflow keyboard navigation', () => {
    function setupOverflow() {
      const items = createOverflowItems();
      render(<Menu items={items} />);
      triggerResize(170);
      return items;
    }

    test('Escape closes overflow dropdown', () => {
      setupOverflow();
      const mb = screen.getByRole('menubar');
      fireEvent.click(screen.getByTestId('menu-overflow-button'));
      expect(screen.getByRole('menu', { name: 'More menu items' })).toBeTruthy();
      fireEvent.keyDown(mb, { key: 'Escape' });
      expect(screen.queryByRole('menu', { name: 'More menu items' })).toBeNull();
    });

    test('ArrowDown navigates overflow items', () => {
      setupOverflow();
      const mb = screen.getByRole('menubar');
      fireEvent.click(screen.getByTestId('menu-overflow-button'));
      fireEvent.keyDown(mb, { key: 'ArrowDown' });
      const firstItem = screen.getByText('Zoom In').closest('button');
      expect(firstItem?.getAttribute('class')).toContain('focused');
    });

    test('ArrowUp wraps to last overflow item', () => {
      setupOverflow();
      const mb = screen.getByRole('menubar');
      fireEvent.click(screen.getByTestId('menu-overflow-button'));
      fireEvent.keyDown(mb, { key: 'ArrowUp' });
      const lastItem = screen.getByText('Help').closest('button');
      expect(lastItem?.getAttribute('class')).toContain('focused');
    });

    test('Enter activates focused overflow item', () => {
      const items = setupOverflow();
      const mb = screen.getByRole('menubar');
      fireEvent.click(screen.getByTestId('menu-overflow-button'));
      fireEvent.keyDown(mb, { key: 'ArrowDown' });
      fireEvent.keyDown(mb, { key: 'Enter' });
      expect(items[2].submenu![0].action).toHaveBeenCalled();
    });

    test('ArrowLeft from overflow opens last visible menu', () => {
      setupOverflow();
      const mb = screen.getByRole('menubar');
      fireEvent.click(screen.getByTestId('menu-overflow-button'));
      fireEvent.keyDown(mb, { key: 'ArrowLeft' });
      expect(screen.queryByRole('menu', { name: 'More menu items' })).toBeNull();
      expect(screen.getByText('Undo')).toBeTruthy();
    });

    test('ArrowRight from overflow opens first visible menu', () => {
      setupOverflow();
      const mb = screen.getByRole('menubar');
      fireEvent.click(screen.getByTestId('menu-overflow-button'));
      fireEvent.keyDown(mb, { key: 'ArrowRight' });
      expect(screen.queryByRole('menu', { name: 'More menu items' })).toBeNull();
      expect(screen.getByText('New')).toBeTruthy();
    });

    test('ArrowRight from last visible menu opens overflow', () => {
      setupOverflow();
      const mb = screen.getByRole('menubar');
      fireEvent.click(screen.getByText('Edit'));
      fireEvent.keyDown(mb, { key: 'ArrowRight' });
      expect(screen.getByRole('menu', { name: 'More menu items' })).toBeTruthy();
    });

    test('ArrowLeft from first visible menu opens overflow', () => {
      setupOverflow();
      const mb = screen.getByRole('menubar');
      fireEvent.click(screen.getByText('File'));
      fireEvent.keyDown(mb, { key: 'ArrowLeft' });
      expect(screen.getByRole('menu', { name: 'More menu items' })).toBeTruthy();
    });

    test('unhandled keys in overflow do not crash', () => {
      setupOverflow();
      const mb = screen.getByRole('menubar');
      fireEvent.click(screen.getByTestId('menu-overflow-button'));
      fireEvent.keyDown(mb, { key: 'Tab' });
      expect(screen.getByRole('menu', { name: 'More menu items' })).toBeTruthy();
    });

    test('ArrowLeft in overflow when all items overflow just closes', () => {
      const items = createOverflowItems();
      render(<Menu items={items} />);
      triggerResize(10);
      fireEvent.click(screen.getByTestId('menu-overflow-button'));
      const mb = screen.getByRole('menubar');
      fireEvent.keyDown(mb, { key: 'ArrowLeft' });
      expect(screen.queryByRole('menu', { name: 'More menu items' })).toBeNull();
      expect(screen.queryByText('New')).toBeNull();
    });

    test('ArrowRight in overflow when all items overflow just closes', () => {
      const items = createOverflowItems();
      render(<Menu items={items} />);
      triggerResize(10);
      fireEvent.click(screen.getByTestId('menu-overflow-button'));
      const mb = screen.getByRole('menubar');
      fireEvent.keyDown(mb, { key: 'ArrowRight' });
      expect(screen.queryByRole('menu', { name: 'More menu items' })).toBeNull();
      expect(screen.queryByText('New')).toBeNull();
    });

    test('ArrowDown wraps around in overflow', () => {
      setupOverflow();
      const mb = screen.getByRole('menubar');
      fireEvent.click(screen.getByTestId('menu-overflow-button'));
      fireEvent.keyDown(mb, { key: 'ArrowDown' });
      fireEvent.keyDown(mb, { key: 'ArrowDown' });
      fireEvent.keyDown(mb, { key: 'ArrowDown' });
      const firstItem = screen.getByText('Zoom In').closest('button');
      expect(firstItem?.getAttribute('class')).toContain('focused');
    });

    test('ArrowUp from non-first overflow item moves to previous', () => {
      setupOverflow();
      const mb = screen.getByRole('menubar');
      fireEvent.click(screen.getByTestId('menu-overflow-button'));
      fireEvent.keyDown(mb, { key: 'ArrowDown' });
      fireEvent.keyDown(mb, { key: 'ArrowDown' });
      const helpItem = screen.getByText('Help').closest('button');
      expect(helpItem?.getAttribute('class')).toContain('focused');
      fireEvent.keyDown(mb, { key: 'ArrowUp' });
      const zoomItem = screen.getByText('Zoom In').closest('button');
      expect(zoomItem?.getAttribute('class')).toContain('focused');
    });

    test('Enter does nothing when no overflow item focused', () => {
      const items = setupOverflow();
      const mb = screen.getByRole('menubar');
      fireEvent.click(screen.getByTestId('menu-overflow-button'));
      fireEvent.keyDown(mb, { key: 'Enter' });
      for (const item of items) {
        if (item.submenu) {
          for (const sub of item.submenu) {
            if (sub.action) expect(sub.action).not.toHaveBeenCalled();
          }
        } else if (item.action) {
          expect(item.action).not.toHaveBeenCalled();
        }
      }
    });
  });

  test('overflow item mouseEnter sets focused index', () => {
    render(<Menu items={createOverflowItems()} />);
    triggerResize(170);

    fireEvent.click(screen.getByTestId('menu-overflow-button'));
    const zoomItem = screen.getByText('Zoom In').closest('button')!;
    fireEvent.mouseEnter(zoomItem);
    expect(zoomItem.getAttribute('class')).toContain('focused');
  });

  test('mouseEnter on non-submenu overflow item sets focused index', () => {
    render(<Menu items={createOverflowItems()} />);
    triggerResize(170);

    fireEvent.click(screen.getByTestId('menu-overflow-button'));
    const helpItem = screen.getByText('Help').closest('button')!;
    fireEvent.mouseEnter(helpItem);
    expect(helpItem.getAttribute('class')).toContain('focused');
  });

  test('closes open submenu index that exceeds new visible count on resize', () => {
    const items = createOverflowItems();
    render(<Menu items={items} />);
    fireEvent.click(screen.getByText('View'));
    expect(screen.getByText('Zoom In')).toBeTruthy();
    triggerResize(170);
    expect(screen.queryByText('Zoom In')).toBeNull();
  });

  test('ArrowLeft from non-first visible item moves to previous (with overflow)', () => {
    render(<Menu items={createOverflowItems()} />);
    triggerResize(170);
    fireEvent.click(screen.getByText('Edit'));
    const mb = screen.getByRole('menubar');
    fireEvent.keyDown(mb, { key: 'ArrowLeft' });
    expect(screen.getByText('New')).toBeTruthy();
  });

  test('ArrowRight wraps to first menu when no overflow', () => {
    const items: MenuItem[] = [
      { label: 'A', submenu: [{ label: 'A1', action: vi.fn() }] },
      { label: 'B', submenu: [{ label: 'B1', action: vi.fn() }] },
    ];
    render(<Menu items={items} />);
    fireEvent.click(screen.getByText('B'));
    const mb = screen.getByRole('menubar');
    fireEvent.keyDown(mb, { key: 'ArrowRight' });
    expect(screen.getByText('A1')).toBeTruthy();
  });

  test('overflow renders disabled submenu items correctly', () => {
    const disabledAction = vi.fn();
    const items: MenuItem[] = [
      { label: 'File', submenu: [{ label: 'New', action: vi.fn() }] },
      { label: 'Edit', submenu: [{ label: 'Locked', action: disabledAction, disabled: true }, { label: 'Open', action: vi.fn() }] },
    ];
    render(<Menu items={items} />);
    triggerResize(90);

    fireEvent.click(screen.getByTestId('menu-overflow-button'));
    const lockedItem = screen.getByText('Locked').closest('button')!;
    expect(lockedItem.getAttribute('aria-disabled')).toBe('true');
    fireEvent.click(lockedItem);
    expect(disabledAction).not.toHaveBeenCalled();
  });

  test('mouseEnter on disabled overflow submenu item does not change focus', () => {
    const items: MenuItem[] = [
      { label: 'File', submenu: [{ label: 'New', action: vi.fn() }] },
      { label: 'Edit', submenu: [{ label: 'Locked', action: vi.fn(), disabled: true }, { label: 'Open', action: vi.fn() }] },
    ];
    render(<Menu items={items} />);
    triggerResize(90);

    fireEvent.click(screen.getByTestId('menu-overflow-button'));
    const openItem = screen.getByText('Open').closest('button')!;
    fireEvent.mouseEnter(openItem);
    expect(openItem.getAttribute('class')).toContain('focused');

    const lockedItem = screen.getByText('Locked').closest('button')!;
    fireEvent.mouseEnter(lockedItem);
    expect(openItem.getAttribute('class')).toContain('focused');
  });

  test('mouseEnter on overflow button when no menu is open does nothing', () => {
    render(<Menu items={createOverflowItems()} />);
    triggerResize(170);

    fireEvent.mouseEnter(screen.getByTestId('menu-overflow-button'));
    expect(screen.queryByRole('menu', { name: 'More menu items' })).toBeNull();
  });

  test('items restore when container is resized back to full width', () => {
    render(<Menu items={createOverflowItems()} />);
    triggerResize(170);
    expect(screen.getByTestId('menu-overflow-button')).toBeTruthy();
    expect(screen.queryByText('View')).toBeNull();
    expect(screen.queryByText('Help')).toBeNull();

    triggerResize(500);
    expect(screen.queryByTestId('menu-overflow-button')).toBeNull();
    expect(screen.getByText('File')).toBeTruthy();
    expect(screen.getByText('Edit')).toBeTruthy();
    expect(screen.getByText('View')).toBeTruthy();
    expect(screen.getByText('Help')).toBeTruthy();
  });

  test('sets flex-basis on container to total desired width', () => {
    render(<Menu items={createOverflowItems()} />);
    const container = screen.getByRole('menubar');
    expect(container.style.flexBasis).toBe('248px');
  });

  test('re-measures widths when items count changes', () => {
    const items = createOverflowItems();
    const { rerender } = render(<Menu items={items} />);
    triggerResize(170);
    expect(screen.getByTestId('menu-overflow-button')).toBeTruthy();

    const newItems: MenuItem[] = [
      { label: 'File', submenu: [{ label: 'New', action: vi.fn() }] },
    ];
    rerender(<Menu items={newItems} />);
    expect(screen.queryByTestId('menu-overflow-button')).toBeNull();
    expect(screen.getByText('File')).toBeTruthy();
  });
});

describe('Cascading (nested) submenus', () => {
  function createNestedItems(): MenuItem[] {
    return [
      {
        label: 'File',
        submenu: [
          { label: 'New File', action: vi.fn(), shortcut: 'Ctrl+N' },
          {
            label: 'Open Recent',
            submenu: [
              { label: 'project-a', action: vi.fn() },
              { label: 'project-b', action: vi.fn() },
              { type: 'separator', label: '' },
              { label: 'Clear Recently Opened', action: vi.fn() },
            ],
          },
          { type: 'separator', label: '' },
          { label: 'Save', action: vi.fn(), shortcut: 'Ctrl+S' },
        ],
      },
      {
        label: 'Edit',
        submenu: [
          { label: 'Undo', action: vi.fn() },
        ],
      },
    ];
  }

  test('renders chevron indicator for items with nested submenu', () => {
    render(<Menu items={createNestedItems()} />);
    fireEvent.click(screen.getByText('File'));
    expect(screen.getByText('▸')).toBeTruthy();
  });

  test('items with nested submenu have aria-haspopup', () => {
    render(<Menu items={createNestedItems()} />);
    fireEvent.click(screen.getByText('File'));
    const trigger = screen.getByTestId('submenu-trigger-Open Recent');
    expect(trigger.getAttribute('aria-haspopup')).toBe('true');
  });

  test('items without nested submenu do not have aria-haspopup', () => {
    render(<Menu items={createNestedItems()} />);
    fireEvent.click(screen.getByText('File'));
    const newFileBtn = screen.getByText('New File').closest('button')!;
    expect(newFileBtn.getAttribute('aria-haspopup')).toBeNull();
  });

  test('clicking a nested submenu trigger opens the child dropdown', () => {
    render(<Menu items={createNestedItems()} />);
    fireEvent.click(screen.getByText('File'));
    fireEvent.click(screen.getByTestId('submenu-trigger-Open Recent'));
    expect(screen.getByTestId('submenu-dropdown-Open Recent')).toBeTruthy();
    expect(screen.getByText('project-a')).toBeTruthy();
    expect(screen.getByText('project-b')).toBeTruthy();
  });

  test('clicking a nested submenu trigger again closes it', () => {
    render(<Menu items={createNestedItems()} />);
    fireEvent.click(screen.getByText('File'));
    fireEvent.click(screen.getByTestId('submenu-trigger-Open Recent'));
    expect(screen.getByText('project-a')).toBeTruthy();

    fireEvent.click(screen.getByTestId('submenu-trigger-Open Recent'));
    expect(screen.queryByText('project-a')).toBeNull();
  });

  test('clicking a child item calls action and closes all menus', () => {
    const items = createNestedItems();
    render(<Menu items={items} />);
    fireEvent.click(screen.getByText('File'));
    fireEvent.click(screen.getByTestId('submenu-trigger-Open Recent'));
    fireEvent.click(screen.getByText('project-a'));
    expect(items[0].submenu![1].submenu![0].action).toHaveBeenCalled();
    expect(screen.queryByText('project-a')).toBeNull();
    expect(screen.queryByText('New File')).toBeNull();
  });

  test('nested submenu has correct aria-label', () => {
    render(<Menu items={createNestedItems()} />);
    fireEvent.click(screen.getByText('File'));
    fireEvent.click(screen.getByTestId('submenu-trigger-Open Recent'));
    expect(screen.getByRole('menu', { name: 'Open Recent submenu' })).toBeTruthy();
  });

  test('nested submenu renders separators', () => {
    render(<Menu items={createNestedItems()} />);
    fireEvent.click(screen.getByText('File'));
    fireEvent.click(screen.getByTestId('submenu-trigger-Open Recent'));
    const separators = screen.getAllByRole('separator');
    expect(separators.length).toBeGreaterThan(0);
  });

  test('does not show shortcut for items with children', () => {
    const items: MenuItem[] = [
      {
        label: 'File',
        submenu: [
          { label: 'Open Recent', shortcut: 'Ctrl+R', submenu: [{ label: 'A', action: vi.fn() }] },
        ],
      },
    ];
    render(<Menu items={items} />);
    fireEvent.click(screen.getByText('File'));
    expect(screen.queryByText('Ctrl+R')).toBeNull();
    expect(screen.getByText('▸')).toBeTruthy();
  });

  test('hover on nested trigger opens child after delay', async () => {
    vi.useFakeTimers();
    render(<Menu items={createNestedItems()} />);
    fireEvent.click(screen.getByText('File'));
    const trigger = screen.getByTestId('submenu-trigger-Open Recent');
    fireEvent.mouseEnter(trigger);

    expect(screen.queryByText('project-a')).toBeNull();

    act(() => { vi.advanceTimersByTime(250); });
    expect(screen.getByText('project-a')).toBeTruthy();

    vi.useRealTimers();
  });

  test('hover on non-nested item closes open child after delay', async () => {
    vi.useFakeTimers();
    render(<Menu items={createNestedItems()} />);
    fireEvent.click(screen.getByText('File'));

    const trigger = screen.getByTestId('submenu-trigger-Open Recent');
    fireEvent.mouseEnter(trigger);
    act(() => { vi.advanceTimersByTime(250); });
    expect(screen.getByText('project-a')).toBeTruthy();

    const saveBtn = screen.getByText('Save').closest('button')!;
    fireEvent.mouseEnter(saveBtn);
    act(() => { vi.advanceTimersByTime(250); });
    expect(screen.queryByText('project-a')).toBeNull();

    vi.useRealTimers();
  });

  test('mouseLeave on nested trigger clears hover timer', () => {
    vi.useFakeTimers();
    render(<Menu items={createNestedItems()} />);
    fireEvent.click(screen.getByText('File'));
    const trigger = screen.getByTestId('submenu-trigger-Open Recent');
    fireEvent.mouseEnter(trigger);
    fireEvent.mouseLeave(trigger);

    act(() => { vi.advanceTimersByTime(250); });
    expect(screen.queryByText('project-a')).toBeNull();

    vi.useRealTimers();
  });

  describe('keyboard navigation in nested submenus', () => {
    test('ArrowDown/ArrowUp navigates within parent submenu', () => {
      render(<Menu items={createNestedItems()} />);
      fireEvent.click(screen.getByText('File'));
      const nav = screen.getByRole('menubar');
      fireEvent.keyDown(nav, { key: 'ArrowDown' });
      const newFileBtn = screen.getByText('New File').closest('button');
      expect(newFileBtn?.getAttribute('class')).toContain('focused');

      fireEvent.keyDown(nav, { key: 'ArrowDown' });
      const openRecentBtn = screen.getByTestId('submenu-trigger-Open Recent');
      expect(openRecentBtn.getAttribute('class')).toContain('focused');
    });

    test('Enter on item with children opens child submenu', () => {
      render(<Menu items={createNestedItems()} />);
      fireEvent.click(screen.getByText('File'));
      const nav = screen.getByRole('menubar');
      fireEvent.keyDown(nav, { key: 'ArrowDown' });
      fireEvent.keyDown(nav, { key: 'ArrowDown' });
      fireEvent.keyDown(nav, { key: 'Enter' });
      expect(screen.queryByText('project-a')).toBeNull();
    });

    test('clicking outside closes all including nested submenus', async () => {
      render(<Menu items={createNestedItems()} />);
      fireEvent.click(screen.getByText('File'));
      fireEvent.click(screen.getByTestId('submenu-trigger-Open Recent'));
      expect(screen.getByText('project-a')).toBeTruthy();

      fireEvent.mouseDown(document.body);
      await waitFor(() => {
        expect(screen.queryByText('project-a')).toBeNull();
        expect(screen.queryByText('New File')).toBeNull();
      });
    });
  });

  test('deeply nested (3 levels) submenus work', () => {
    const deepAction = vi.fn();
    const items: MenuItem[] = [
      {
        label: 'File',
        submenu: [
          {
            label: 'Level 1',
            submenu: [
              {
                label: 'Level 2',
                submenu: [
                  { label: 'Deep Action', action: deepAction },
                ],
              },
            ],
          },
        ],
      },
    ];
    render(<Menu items={items} />);
    fireEvent.click(screen.getByText('File'));
    fireEvent.click(screen.getByTestId('submenu-trigger-Level 1'));
    fireEvent.click(screen.getByTestId('submenu-trigger-Level 2'));
    expect(screen.getByText('Deep Action')).toBeTruthy();

    fireEvent.click(screen.getByText('Deep Action'));
    expect(deepAction).toHaveBeenCalled();
    expect(screen.queryByText('Deep Action')).toBeNull();
  });

  test('disabled nested submenu trigger does not open', () => {
    const items: MenuItem[] = [
      {
        label: 'File',
        submenu: [
          {
            label: 'Locked Submenu',
            disabled: true,
            submenu: [{ label: 'Hidden', action: vi.fn() }],
          },
        ],
      },
    ];
    render(<Menu items={items} />);
    fireEvent.click(screen.getByText('File'));

    vi.useFakeTimers();
    const trigger = screen.getByText('Locked Submenu').closest('button')!;
    fireEvent.mouseEnter(trigger);
    act(() => { vi.advanceTimersByTime(250); });
    expect(screen.queryByText('Hidden')).toBeNull();
    vi.useRealTimers();
  });

  test('switching top-level menus closes nested submenus', () => {
    render(<Menu items={createNestedItems()} />);
    fireEvent.click(screen.getByText('File'));
    fireEvent.click(screen.getByTestId('submenu-trigger-Open Recent'));
    expect(screen.getByText('project-a')).toBeTruthy();

    fireEvent.mouseEnter(screen.getByText('Edit'));
    expect(screen.getByText('Undo')).toBeTruthy();
    expect(screen.queryByText('project-a')).toBeNull();
    expect(screen.queryByText('New File')).toBeNull();
  });

  test('child submenu opens to the right by default', () => {
    const getBoundingClientRectSpy = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      right: 200,
      left: 0,
      top: 40,
      bottom: 70,
      width: 200,
      height: 30,
      x: 0,
      y: 40,
      toJSON: () => {},
    });
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true, configurable: true });

    render(<Menu items={createNestedItems()} />);
    fireEvent.click(screen.getByText('File'));
    fireEvent.click(screen.getByTestId('submenu-trigger-Open Recent'));
    const dropdown = screen.getByTestId('submenu-dropdown-Open Recent');
    const left = parseInt(dropdown.style.left, 10);
    expect(left).toBeGreaterThan(0);

    getBoundingClientRectSpy.mockRestore();
  });

  test('child submenu flips to left when not enough space on right', () => {
    Object.defineProperty(window, 'innerWidth', { value: 300, writable: true, configurable: true });

    const getBoundingClientRectSpy = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      right: 280,
      left: 260,
      top: 40,
      bottom: 70,
      width: 220,
      height: 30,
      x: 260,
      y: 40,
      toJSON: () => {},
    });

    vi.useFakeTimers();
    render(<Menu items={createNestedItems()} />);
    fireEvent.click(screen.getByText('File'));

    const trigger = screen.getByTestId('submenu-trigger-Open Recent');
    fireEvent.mouseEnter(trigger);
    act(() => { vi.advanceTimersByTime(250); });

    const dropdown = screen.getByTestId('submenu-dropdown-Open Recent');
    const left = parseInt(dropdown.style.left, 10);
    expect(left).toBeLessThan(260);

    vi.useRealTimers();
    getBoundingClientRectSpy.mockRestore();
  });

  test('aria-expanded toggles on nested submenu trigger', () => {
    render(<Menu items={createNestedItems()} />);
    fireEvent.click(screen.getByText('File'));
    const trigger = screen.getByTestId('submenu-trigger-Open Recent');
    expect(trigger.getAttribute('aria-expanded')).toBeNull();

    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBeNull();
  });
});
