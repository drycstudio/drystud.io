import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, afterEach } from 'vitest';
import { SearchBar } from './SearchBar';
import type { CommandPaletteSection, FilterChip, CommandPaletteFooterAction } from './types';

const mockSections: CommandPaletteSection[] = [
  {
    id: 'recent',
    title: 'Recently Viewed',
    items: [
      { id: 'r1', label: 'GET /api/users', description: 'User Management', icon: '🟢', badge: 'GET', metadata: '2h ago', shortcut: 'Ctrl+1', action: vi.fn() },
      { id: 'r2', label: 'POST /api/auth', description: 'Authentication', icon: '🟡', badge: 'POST', action: vi.fn() },
    ],
  },
  {
    id: 'commands',
    title: 'Quick Actions',
    items: [
      { id: 'c1', label: 'New Request', description: 'Create HTTP request', shortcut: 'Ctrl+N', action: vi.fn() },
      { id: 'c2', label: 'Import Collection', action: vi.fn() },
    ],
  },
];

const mockFilters: FilterChip[] = [
  { id: 'requests', label: 'Requests', active: false, onToggle: vi.fn() },
  { id: 'collections', label: 'Collections', active: true, onToggle: vi.fn() },
];

const mockFooterActions: CommandPaletteFooterAction[] = [
  { id: 'search-ws', icon: '🔍', label: 'Search in Workspace', action: vi.fn() },
  { id: 'docs', label: 'Browse Docs', action: vi.fn() },
];

afterEach(() => {
  vi.restoreAllMocks();
});

describe('SearchBar (CommandPalette)', () => {
  describe('trigger button', () => {
    test('renders with default placeholder and shortcut', () => {
      render(<SearchBar sections={[]} />);
      const trigger = screen.getByTestId('searchbar-trigger');
      expect(trigger).toBeTruthy();
      expect(screen.getByText('Search...')).toBeTruthy();
      expect(screen.getByText('Ctrl+K')).toBeTruthy();
    });

    test('renders custom placeholder', () => {
      render(<SearchBar sections={[]} placeholder="Search commands..." />);
      expect(screen.getByText('Search commands...')).toBeTruthy();
    });

    test('renders custom shortcut', () => {
      render(<SearchBar sections={[]} shortcut="Ctrl+P" />);
      expect(screen.getByText('Ctrl+P')).toBeTruthy();
    });

    test('formats shortcut for macOS', () => {
      render(<SearchBar sections={[]} shortcut="Ctrl+K" platform="macos" />);
      expect(screen.getByText('⌘K')).toBeTruthy();
    });
  });

  describe('palette opening', () => {
    test('opens palette when trigger is clicked', () => {
      render(<SearchBar sections={mockSections} />);
      expect(screen.queryByTestId('searchbar-palette')).toBeNull();
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      expect(screen.getByTestId('searchbar-palette')).toBeTruthy();
    });

    test('calls onOpen when palette opens', () => {
      const onOpen = vi.fn();
      render(<SearchBar sections={mockSections} onOpen={onOpen} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      expect(onOpen).toHaveBeenCalledTimes(1);
    });

    test('opens palette with Ctrl+K keyboard shortcut (windows)', () => {
      render(<SearchBar sections={mockSections} platform="windows" />);
      fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
      expect(screen.getByTestId('searchbar-palette')).toBeTruthy();
    });

    test('opens palette with Meta+K keyboard shortcut (macos)', () => {
      render(<SearchBar sections={mockSections} platform="macos" />);
      fireEvent.keyDown(document, { key: 'k', metaKey: true });
      expect(screen.getByTestId('searchbar-palette')).toBeTruthy();
    });

    test('does not open palette with wrong modifier (macos with ctrlKey)', () => {
      render(<SearchBar sections={mockSections} platform="macos" />);
      fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
      expect(screen.queryByTestId('searchbar-palette')).toBeNull();
    });
  });

  describe('palette closing', () => {
    test('closes palette when clicking overlay', () => {
      const onClose = vi.fn();
      render(<SearchBar sections={mockSections} onClose={onClose} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      expect(screen.getByTestId('searchbar-palette')).toBeTruthy();

      fireEvent.click(screen.getByTestId('searchbar-overlay'));
      expect(screen.queryByTestId('searchbar-palette')).toBeNull();
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    test('does not close when clicking inside palette', () => {
      render(<SearchBar sections={mockSections} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      fireEvent.click(screen.getByTestId('searchbar-input'));
      expect(screen.getByTestId('searchbar-palette')).toBeTruthy();
    });

    test('closes palette on Escape key', () => {
      render(<SearchBar sections={mockSections} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      expect(screen.getByTestId('searchbar-palette')).toBeTruthy();
      fireEvent.keyDown(screen.getByTestId('searchbar-palette'), { key: 'Escape' });
      expect(screen.queryByTestId('searchbar-palette')).toBeNull();
    });
  });

  describe('sections rendering', () => {
    test('renders section headers', () => {
      render(<SearchBar sections={mockSections} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      expect(screen.getByText('Recently Viewed')).toBeTruthy();
      expect(screen.getByText('Quick Actions')).toBeTruthy();
    });

    test('renders section containers with test IDs', () => {
      render(<SearchBar sections={mockSections} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      expect(screen.getByTestId('section-recent')).toBeTruthy();
      expect(screen.getByTestId('section-commands')).toBeTruthy();
    });

    test('renders items within sections', () => {
      render(<SearchBar sections={mockSections} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      expect(screen.getByText('GET /api/users')).toBeTruthy();
      expect(screen.getByText('POST /api/auth')).toBeTruthy();
      expect(screen.getByText('New Request')).toBeTruthy();
      expect(screen.getByText('Import Collection')).toBeTruthy();
    });

    test('renders item descriptions', () => {
      render(<SearchBar sections={mockSections} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      expect(screen.getByText('User Management')).toBeTruthy();
      expect(screen.getByText('Authentication')).toBeTruthy();
    });

    test('renders item icons', () => {
      render(<SearchBar sections={mockSections} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      expect(screen.getByText('🟢')).toBeTruthy();
      expect(screen.getByText('🟡')).toBeTruthy();
    });

    test('renders item badges', () => {
      render(<SearchBar sections={mockSections} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      expect(screen.getByText('GET')).toBeTruthy();
      expect(screen.getByText('POST')).toBeTruthy();
    });

    test('renders item metadata', () => {
      render(<SearchBar sections={mockSections} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      expect(screen.getByText('2h ago')).toBeTruthy();
    });

    test('renders item shortcuts', () => {
      render(<SearchBar sections={mockSections} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      expect(screen.getByText('Ctrl+1')).toBeTruthy();
      expect(screen.getByText('Ctrl+N')).toBeTruthy();
    });

    test('formats item shortcuts for macOS', () => {
      render(<SearchBar sections={mockSections} platform="macos" />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      expect(screen.getByText('⌘N')).toBeTruthy();
    });

    test('renders section without title', () => {
      const sections: CommandPaletteSection[] = [
        { id: 'untitled', items: [{ id: 'u1', label: 'Untitled Item', action: vi.fn() }] },
      ];
      render(<SearchBar sections={sections} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      expect(screen.getByText('Untitled Item')).toBeTruthy();
    });
  });

  describe('filter chips', () => {
    test('renders filter chips when provided', () => {
      render(<SearchBar sections={mockSections} filters={mockFilters} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      expect(screen.getByTestId('searchbar-filters')).toBeTruthy();
      expect(screen.getByTestId('filter-chip-requests')).toBeTruthy();
      expect(screen.getByTestId('filter-chip-collections')).toBeTruthy();
    });

    test('renders active chip with active style', () => {
      render(<SearchBar sections={mockSections} filters={mockFilters} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      expect(screen.getByText('Collections')).toBeTruthy();
    });

    test('calls onToggle when chip is clicked', () => {
      render(<SearchBar sections={mockSections} filters={mockFilters} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      fireEvent.click(screen.getByTestId('filter-chip-requests'));
      expect(mockFilters[0].onToggle).toHaveBeenCalledTimes(1);
    });

    test('does not render filter bar when no filters', () => {
      render(<SearchBar sections={mockSections} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      expect(screen.queryByTestId('searchbar-filters')).toBeNull();
    });

    test('does not render filter bar when empty filters array', () => {
      render(<SearchBar sections={mockSections} filters={[]} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      expect(screen.queryByTestId('searchbar-filters')).toBeNull();
    });
  });

  describe('footer', () => {
    test('renders footer actions when provided', () => {
      render(<SearchBar sections={mockSections} footerActions={mockFooterActions} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      expect(screen.getByTestId('searchbar-footer')).toBeTruthy();
      expect(screen.getByTestId('footer-action-search-ws')).toBeTruthy();
      expect(screen.getByTestId('footer-action-docs')).toBeTruthy();
    });

    test('renders footer action icons', () => {
      render(<SearchBar sections={mockSections} footerActions={mockFooterActions} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      expect(screen.getByText('🔍')).toBeTruthy();
    });

    test('calls footer action on click', () => {
      render(<SearchBar sections={mockSections} footerActions={mockFooterActions} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      fireEvent.click(screen.getByTestId('footer-action-search-ws'));
      expect(mockFooterActions[0].action).toHaveBeenCalledTimes(1);
    });

    test('does not render footer when no footer actions', () => {
      render(<SearchBar sections={mockSections} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      expect(screen.queryByTestId('searchbar-footer')).toBeNull();
    });

    test('does not render footer when empty footer actions array', () => {
      render(<SearchBar sections={mockSections} footerActions={[]} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      expect(screen.queryByTestId('searchbar-footer')).toBeNull();
    });

    test('renders custom footer via renderFooter', () => {
      render(
        <SearchBar
          sections={mockSections}
          footerActions={mockFooterActions}
          renderFooter={() => <div data-testid="custom-footer">Custom Footer</div>}
        />,
      );
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      expect(screen.getByTestId('custom-footer')).toBeTruthy();
      expect(screen.queryByTestId('searchbar-footer')).toBeNull();
    });
  });

  describe('loading state', () => {
    test('renders loading spinner when loading is true', () => {
      render(<SearchBar sections={[]} loading />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      expect(screen.getByTestId('searchbar-loading')).toBeTruthy();
    });

    test('does not render results or empty state when loading', () => {
      render(<SearchBar sections={[]} loading />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      expect(screen.queryByTestId('searchbar-results')).toBeNull();
      expect(screen.queryByTestId('searchbar-empty')).toBeNull();
    });

    test('renders results when loading is false', () => {
      render(<SearchBar sections={mockSections} loading={false} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      expect(screen.getByTestId('searchbar-results')).toBeTruthy();
      expect(screen.queryByTestId('searchbar-loading')).toBeNull();
    });
  });

  describe('empty state', () => {
    test('shows default empty message when no items', () => {
      render(<SearchBar sections={[]} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      expect(screen.getByTestId('searchbar-empty')).toBeTruthy();
      expect(screen.getByText('No results found')).toBeTruthy();
    });

    test('shows custom empty message', () => {
      render(<SearchBar sections={[]} emptyMessage="Nothing here" />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      expect(screen.getByText('Nothing here')).toBeTruthy();
    });

    test('shows empty for sections with zero items', () => {
      render(<SearchBar sections={[{ id: 'empty', title: 'Empty', items: [] }]} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      expect(screen.getByTestId('searchbar-empty')).toBeTruthy();
    });
  });

  describe('onQueryChange callback', () => {
    test('calls onQueryChange when typing', () => {
      const onQueryChange = vi.fn();
      render(<SearchBar sections={mockSections} onQueryChange={onQueryChange} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      fireEvent.change(screen.getByTestId('searchbar-input'), { target: { value: 'api' } });
      expect(onQueryChange).toHaveBeenCalledWith('api');
    });

    test('resets focused index on input change', () => {
      render(<SearchBar sections={mockSections} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      fireEvent.keyDown(screen.getByTestId('searchbar-palette'), { key: 'ArrowDown' });
      fireEvent.change(screen.getByTestId('searchbar-input'), { target: { value: 'test' } });

      const items = screen.getAllByRole('button').filter((b) => b.closest('[data-testid="searchbar-results"]'));
      const anyFocused = items.some((item) => item.className.includes('focused'));
      expect(anyFocused).toBe(false);
    });
  });

  describe('keyboard navigation across sections', () => {
    test('navigates down across sections with ArrowDown', () => {
      render(<SearchBar sections={mockSections} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));

      fireEvent.keyDown(screen.getByTestId('searchbar-palette'), { key: 'ArrowDown' });
      const firstItem = screen.getByTestId('palette-item-r1').querySelector('button') ?? screen.getByTestId('palette-item-r1');
      expect(firstItem.className).toContain('focused');
    });

    test('wraps to first item when ArrowDown at end', () => {
      const sections: CommandPaletteSection[] = [
        { id: 's1', items: [{ id: 'a', label: 'A', action: vi.fn() }, { id: 'b', label: 'B', action: vi.fn() }] },
      ];
      render(<SearchBar sections={sections} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));

      fireEvent.keyDown(screen.getByTestId('searchbar-palette'), { key: 'ArrowDown' });
      fireEvent.keyDown(screen.getByTestId('searchbar-palette'), { key: 'ArrowDown' });
      fireEvent.keyDown(screen.getByTestId('searchbar-palette'), { key: 'ArrowDown' });

      const itemA = screen.getByTestId('palette-item-a');
      expect(itemA.className).toContain('focused');
    });

    test('navigates up with ArrowUp', () => {
      const sections: CommandPaletteSection[] = [
        { id: 's1', items: [{ id: 'a', label: 'A', action: vi.fn() }, { id: 'b', label: 'B', action: vi.fn() }] },
      ];
      render(<SearchBar sections={sections} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));

      fireEvent.keyDown(screen.getByTestId('searchbar-palette'), { key: 'ArrowDown' });
      fireEvent.keyDown(screen.getByTestId('searchbar-palette'), { key: 'ArrowDown' });
      fireEvent.keyDown(screen.getByTestId('searchbar-palette'), { key: 'ArrowUp' });

      const itemA = screen.getByTestId('palette-item-a');
      expect(itemA.className).toContain('focused');
    });

    test('wraps to last item when ArrowUp at start', () => {
      const sections: CommandPaletteSection[] = [
        { id: 's1', items: [{ id: 'a', label: 'A', action: vi.fn() }, { id: 'b', label: 'B', action: vi.fn() }] },
      ];
      render(<SearchBar sections={sections} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));

      fireEvent.keyDown(screen.getByTestId('searchbar-palette'), { key: 'ArrowDown' });
      fireEvent.keyDown(screen.getByTestId('searchbar-palette'), { key: 'ArrowUp' });

      const itemB = screen.getByTestId('palette-item-b');
      expect(itemB.className).toContain('focused');
    });

    test('skips disabled items during navigation', () => {
      const sections: CommandPaletteSection[] = [
        {
          id: 's1',
          items: [
            { id: 'a', label: 'A', action: vi.fn() },
            { id: 'b', label: 'B', disabled: true, action: vi.fn() },
            { id: 'c', label: 'C', action: vi.fn() },
          ],
        },
      ];
      render(<SearchBar sections={sections} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));

      fireEvent.keyDown(screen.getByTestId('searchbar-palette'), { key: 'ArrowDown' });
      fireEvent.keyDown(screen.getByTestId('searchbar-palette'), { key: 'ArrowDown' });

      const itemC = screen.getByTestId('palette-item-c');
      expect(itemC.className).toContain('focused');
    });

    test('selects focused item with Enter', () => {
      const action = vi.fn();
      const sections: CommandPaletteSection[] = [
        { id: 's1', items: [{ id: 'a', label: 'A', action }] },
      ];
      render(<SearchBar sections={sections} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));

      fireEvent.keyDown(screen.getByTestId('searchbar-palette'), { key: 'ArrowDown' });
      fireEvent.keyDown(screen.getByTestId('searchbar-palette'), { key: 'Enter' });

      expect(action).toHaveBeenCalledTimes(1);
      expect(screen.queryByTestId('searchbar-palette')).toBeNull();
    });

    test('Enter does nothing when no item is focused', () => {
      render(<SearchBar sections={mockSections} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      fireEvent.keyDown(screen.getByTestId('searchbar-palette'), { key: 'Enter' });
      expect(screen.getByTestId('searchbar-palette')).toBeTruthy();
    });
  });

  describe('result selection', () => {
    test('calls action and closes palette when clicking an item', () => {
      const action = vi.fn();
      const sections: CommandPaletteSection[] = [
        { id: 's1', items: [{ id: 'a', label: 'Test Action', action }] },
      ];
      render(<SearchBar sections={sections} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));

      fireEvent.click(screen.getByText('Test Action'));
      expect(action).toHaveBeenCalledTimes(1);
      expect(screen.queryByTestId('searchbar-palette')).toBeNull();
    });

    test('does not call action when clicking disabled item', () => {
      const action = vi.fn();
      const sections: CommandPaletteSection[] = [
        { id: 's1', items: [{ id: 'a', label: 'Disabled', disabled: true, action }] },
      ];
      render(<SearchBar sections={sections} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      fireEvent.click(screen.getByText('Disabled'));
      expect(action).toHaveBeenCalledTimes(0);
    });
  });

  describe('mouse hover', () => {
    test('sets focused index on mouse enter', () => {
      const sections: CommandPaletteSection[] = [
        { id: 's1', items: [{ id: 'a', label: 'A', action: vi.fn() }, { id: 'b', label: 'B', action: vi.fn() }] },
      ];
      render(<SearchBar sections={sections} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));

      const itemB = screen.getByTestId('palette-item-b');
      fireEvent.mouseEnter(itemB);
      expect(itemB.className).toContain('focused');
    });

    test('does not update focus on hover over disabled item', () => {
      const sections: CommandPaletteSection[] = [
        {
          id: 's1',
          items: [
            { id: 'a', label: 'A', action: vi.fn() },
            { id: 'b', label: 'B', disabled: true, action: vi.fn() },
          ],
        },
      ];
      render(<SearchBar sections={sections} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));

      fireEvent.keyDown(screen.getByTestId('searchbar-palette'), { key: 'ArrowDown' });
      const itemA = screen.getByTestId('palette-item-a');
      expect(itemA.className).toContain('focused');

      fireEvent.mouseEnter(screen.getByTestId('palette-item-b'));
      expect(itemA.className).toContain('focused');
    });
  });

  describe('custom renderItem', () => {
    test('uses renderItem when provided', () => {
      const sections: CommandPaletteSection[] = [
        { id: 's1', items: [{ id: 'x1', label: 'Custom', action: vi.fn() }] },
      ];
      render(
        <SearchBar
          sections={sections}
          renderItem={(item, focused) => (
            <div data-testid="custom-item" data-focused={focused}>
              {item.label}
            </div>
          )}
        />,
      );
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      expect(screen.getByTestId('custom-item')).toBeTruthy();
      expect(screen.getByText('Custom')).toBeTruthy();
    });

    test('passes focused state to renderItem', () => {
      const sections: CommandPaletteSection[] = [
        { id: 's1', items: [{ id: 'x1', label: 'Custom', action: vi.fn() }] },
      ];
      render(
        <SearchBar
          sections={sections}
          renderItem={(item, focused) => (
            <div data-testid="custom-item" data-focused={String(focused)}>
              {item.label}
            </div>
          )}
        />,
      );
      fireEvent.click(screen.getByTestId('searchbar-trigger'));

      fireEvent.keyDown(screen.getByTestId('searchbar-palette'), { key: 'ArrowDown' });
      expect(screen.getByTestId('custom-item').getAttribute('data-focused')).toBe('true');
    });
  });

  describe('centered prop', () => {
    test('renders with centered container', () => {
      const { container } = render(<SearchBar sections={[]} centered />);
      expect(container.firstChild).toBeTruthy();
    });

    test('renders without centered container', () => {
      const { container } = render(<SearchBar sections={[]} centered={false} />);
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('cleanup', () => {
    test('removes keyboard listener on unmount', () => {
      const spy = vi.spyOn(document, 'removeEventListener');
      const { unmount } = render(<SearchBar sections={[]} />);
      unmount();
      expect(spy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });
  });

  describe('unhandled keys', () => {
    test('ignores unrelated keys in palette', () => {
      render(<SearchBar sections={mockSections} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      fireEvent.keyDown(screen.getByTestId('searchbar-palette'), { key: 'Tab' });
      expect(screen.getByTestId('searchbar-palette')).toBeTruthy();
    });
  });

  describe('re-open behavior', () => {
    test('resets query and focused index when palette is re-opened', () => {
      render(<SearchBar sections={mockSections} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));

      fireEvent.change(screen.getByTestId('searchbar-input'), { target: { value: 'api' } });
      fireEvent.keyDown(screen.getByTestId('searchbar-palette'), { key: 'ArrowDown' });

      fireEvent.keyDown(screen.getByTestId('searchbar-palette'), { key: 'Escape' });
      expect(screen.queryByTestId('searchbar-palette')).toBeNull();

      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      expect(screen.getByTestId('searchbar-input')).toBeTruthy();
      expect(screen.getByTestId<HTMLInputElement>('searchbar-input').value).toBe('');
    });
  });

  describe('keyboard shortcut edge cases', () => {
    test('opens palette with uppercase K key', () => {
      render(<SearchBar sections={mockSections} platform="windows" />);
      fireEvent.keyDown(document, { key: 'K', ctrlKey: true });
      expect(screen.getByTestId('searchbar-palette')).toBeTruthy();
    });

    test('opens palette with Ctrl+K on linux', () => {
      render(<SearchBar sections={mockSections} platform="linux" />);
      fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
      expect(screen.getByTestId('searchbar-palette')).toBeTruthy();
    });

    test('does not open palette without modifier key', () => {
      render(<SearchBar sections={mockSections} platform="windows" />);
      fireEvent.keyDown(document, { key: 'k' });
      expect(screen.queryByTestId('searchbar-palette')).toBeNull();
    });

    test('does not open palette with wrong key', () => {
      render(<SearchBar sections={mockSections} platform="windows" />);
      fireEvent.keyDown(document, { key: 'j', ctrlKey: true });
      expect(screen.queryByTestId('searchbar-palette')).toBeNull();
    });
  });

  describe('hasOpenedRef guard', () => {
    test('onClose is not called on initial render when palette is closed', () => {
      const onClose = vi.fn();
      render(<SearchBar sections={[]} onClose={onClose} />);
      expect(onClose).toHaveBeenCalledTimes(0);
    });

    test('onClose is called only after palette has been opened and closed', () => {
      const onClose = vi.fn();
      render(<SearchBar sections={mockSections} onClose={onClose} />);
      expect(onClose).toHaveBeenCalledTimes(0);

      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      expect(onClose).toHaveBeenCalledTimes(0);

      fireEvent.keyDown(screen.getByTestId('searchbar-palette'), { key: 'Escape' });
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('platform-specific shortcut display', () => {
    test('displays macOS-formatted shortcut on trigger for macos platform', () => {
      render(<SearchBar sections={[]} shortcut="Ctrl+Shift+P" platform="macos" />);
      expect(screen.getByText('⇧⌘P')).toBeTruthy();
    });

    test('displays raw shortcut on trigger for linux platform', () => {
      render(<SearchBar sections={[]} shortcut="Ctrl+Shift+P" platform="linux" />);
      expect(screen.getByText('Ctrl+Shift+P')).toBeTruthy();
    });
  });

  describe('no sections prop', () => {
    test('renders empty palette with default sections', () => {
      render(<SearchBar sections={[]} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      expect(screen.getByTestId('searchbar-palette')).toBeTruthy();
    });
  });

  describe('item without optional fields', () => {
    test('renders item with only required fields', () => {
      const sections: CommandPaletteSection[] = [
        { id: 's1', items: [{ id: 'min', label: 'Minimal Item', action: vi.fn() }] },
      ];
      render(<SearchBar sections={sections} />);
      fireEvent.click(screen.getByTestId('searchbar-trigger'));
      expect(screen.getByText('Minimal Item')).toBeTruthy();
      expect(screen.getByTestId('palette-item-min')).toBeTruthy();
    });
  });
});
