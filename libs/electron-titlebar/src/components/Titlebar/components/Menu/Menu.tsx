import React from 'react';

import type { Platform } from '~/utils';
import { formatShortcut } from '~/utils';
import type { MenuItem } from './types';
import {
  MenuContainer,
  MenuItemButton,
  OverflowButton,
  OverflowGroupLabel,
  Dropdown,
  DropdownItem,
  Separator,
  Shortcut,
} from './styles';

export type MenuProps = {
  items: MenuItem[];
  platform?: Platform;
};

function getActionableIndices(submenu: NonNullable<MenuItem['submenu']>): number[] {
  return submenu.reduce<number[]>((acc, sub, idx) => {
    if (sub.type !== 'separator' && !sub.disabled) acc.push(idx);
    return acc;
  }, []);
}

function navigateIndex(current: number, total: number, direction: 1 | -1): number {
  return (current + direction + total) % total;
}

function navigateActionable(
  actionable: number[],
  focusedSubIndex: number,
  direction: 1 | -1,
): number {
  const currentPos = actionable.indexOf(focusedSubIndex);
  const nextPos = navigateIndex(currentPos, actionable.length, direction);
  return actionable[nextPos];
}

function flattenOverflowItems(overflowItems: MenuItem[]): NonNullable<MenuItem['submenu']>[0][] {
  const flat: NonNullable<MenuItem['submenu']>[0][] = [];
  for (const item of overflowItems) {
    if (item.submenu) {
      for (const sub of item.submenu) {
        if (sub.type !== 'separator' && !sub.disabled) flat.push(sub);
      }
    } else if (!item.disabled && item.action) {
      flat.push({ label: item.label, action: item.action });
    }
  }
  return flat;
}

const OVERFLOW_BTN_WIDTH = 40;

export function Menu({ items, platform = 'windows' }: MenuProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const [focusedSubIndex, setFocusedSubIndex] = React.useState<number>(-1);
  const [visibleCount, setVisibleCount] = React.useState(items.length);
  const [overflowOpen, setOverflowOpen] = React.useState(false);
  const [overflowFocusedIndex, setOverflowFocusedIndex] = React.useState(-1);
  const menuRef = React.useRef<HTMLElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const overflowRef = React.useRef<HTMLDivElement>(null);
  const itemWidthsRef = React.useRef<number[]>([]);
  const prevItemsLengthRef = React.useRef(items.length);

  if (prevItemsLengthRef.current !== items.length) {
    prevItemsLengthRef.current = items.length;
    itemWidthsRef.current = [];
  }

  const overflowItems = items.slice(visibleCount);
  const hasOverflow = overflowItems.length > 0;
  const overflowFlatItems = React.useMemo(() => flattenOverflowItems(overflowItems), [overflowItems]);

  React.useLayoutEffect(() => {
    const container = menuRef.current;
    /* v8 ignore start */
    if (!container) return;
    /* v8 ignore stop */

    /* v8 ignore start */
    if (itemWidthsRef.current.length === 0) {
    /* v8 ignore stop */
      const els = Array.from(container.querySelectorAll('[data-menu-item]')) as HTMLElement[];
      /* v8 ignore start */
      if (els.length !== items.length) return;
      /* v8 ignore stop */
      itemWidthsRef.current = els.map((el) => el.offsetWidth + 2);
    }

    const widths = itemWidthsRef.current;
    if (typeof ResizeObserver === 'undefined' || widths.length === 0) return;

    const totalDesiredWidth = widths.reduce((a, b) => a + b, 0);
    container.style.flexBasis = `${totalDesiredWidth}px`;

    function computeVisible() {
      const containerWidth = container!.clientWidth;

      if (totalDesiredWidth <= containerWidth) {
        setVisibleCount(widths.length);
        return;
      }

      let used = 0;
      let count = 0;
      for (const w of widths) {
        if (used + w + OVERFLOW_BTN_WIDTH > containerWidth) break;
        used += w;
        count++;
      }
      setVisibleCount(Math.max(0, count));
    }

    const observer = new ResizeObserver(computeVisible);
    observer.observe(container);
    computeVisible();
    return () => {
      observer.disconnect();
      container.style.flexBasis = '';
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  React.useEffect(() => {
    if (openIndex !== null && openIndex >= visibleCount) {
      setOpenIndex(null);
    }
  }, [visibleCount, openIndex]);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenIndex(null);
        setFocusedSubIndex(-1);
        setOverflowOpen(false);
        setOverflowFocusedIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  React.useEffect(() => {
    if (openIndex !== null) {
      setFocusedSubIndex(-1);
      setOverflowOpen(false);
      setOverflowFocusedIndex(-1);
      dropdownRef.current?.focus();
    }
  }, [openIndex]);

  React.useEffect(() => {
    if (overflowOpen) {
      setOpenIndex(null);
      setFocusedSubIndex(-1);
      setOverflowFocusedIndex(-1);
    }
  }, [overflowOpen]);

  function handleMenuItemClick(index: number, item: MenuItem) {
    if (item.disabled) return;
    if (item.submenu) {
      setOpenIndex(openIndex === index ? null : index);
    } else if (item.action) {
      item.action();
      setOpenIndex(null);
    }
  }

  function handleSubmenuClick(sub: NonNullable<MenuItem['submenu']>[0]) {
    if (sub.disabled || sub.type === 'separator') return;
    sub.action?.();
    setOpenIndex(null);
    setFocusedSubIndex(-1);
  }

  function handleOverflowItemClick(sub: NonNullable<MenuItem['submenu']>[0]) {
    if (sub.disabled || sub.type === 'separator') return;
    sub.action?.();
    setOverflowOpen(false);
    setOverflowFocusedIndex(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (overflowOpen) {
      handleOverflowKeyDown(e);
      return;
    }
    if (openIndex === null) return;
    handleMenuKeyDown(e);
  }

  function handleOverflowKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setOverflowOpen(false);
        setOverflowFocusedIndex(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setOverflowFocusedIndex((prev) => (prev < overflowFlatItems.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setOverflowFocusedIndex((prev) => (prev > 0 ? prev - 1 : overflowFlatItems.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (overflowFocusedIndex >= 0 && overflowFlatItems[overflowFocusedIndex]) {
          handleOverflowItemClick(overflowFlatItems[overflowFocusedIndex]);
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        setOverflowOpen(false);
        setOverflowFocusedIndex(-1);
        if (visibleCount > 0) setOpenIndex(visibleCount - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        setOverflowOpen(false);
        setOverflowFocusedIndex(-1);
        if (visibleCount > 0) setOpenIndex(0);
        break;
      default:
        break;
    }
  }

  function handleMenuKeyDown(e: React.KeyboardEvent) {
    /* v8 ignore start */
    if (openIndex === null) return;
    /* v8 ignore stop */
    const submenu = items[openIndex]?.submenu;

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setOpenIndex(null);
        setFocusedSubIndex(-1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (openIndex > 0) {
          setOpenIndex(openIndex - 1);
        } else if (hasOverflow) {
          setOverflowOpen(true);
        } else {
          setOpenIndex(visibleCount - 1);
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (openIndex < visibleCount - 1) {
          setOpenIndex(openIndex + 1);
        } else if (hasOverflow) {
          setOverflowOpen(true);
        } else {
          setOpenIndex(0);
        }
        break;
      case 'ArrowDown': {
        if (!submenu) break;
        const downActionable = getActionableIndices(submenu);
        if (downActionable.length === 0) break;
        e.preventDefault();
        setFocusedSubIndex(navigateActionable(downActionable, focusedSubIndex, 1));
        break;
      }
      case 'ArrowUp': {
        if (!submenu) break;
        const upActionable = getActionableIndices(submenu);
        if (upActionable.length === 0) break;
        e.preventDefault();
        setFocusedSubIndex(navigateActionable(upActionable, focusedSubIndex, -1));
        break;
      }
      case 'Enter':
        e.preventDefault();
        if (submenu && focusedSubIndex >= 0 && submenu[focusedSubIndex]) {
          handleSubmenuClick(submenu[focusedSubIndex]);
        }
        break;
      default:
        break;
    }
  }

  function renderOverflowDropdown() {
    let flatIdx = 0;

    return overflowItems.map((item, itemIdx) => {
      const elements: React.ReactNode[] = [];

      if (itemIdx > 0) {
        elements.push(<Separator key={`ov-div-${item.label}`} role="separator" />);
      }

      if (item.submenu) {
        elements.push(<OverflowGroupLabel key={`ov-label-${item.label}`}>{item.label}</OverflowGroupLabel>);

        for (const sub of item.submenu) {
          if (sub.type === 'separator') {
            elements.push(<Separator key={`ov-sep-${item.label}-${sub.label}`} role="separator" />);
            continue;
          }
          const navIdx = sub.disabled ? -1 : flatIdx++;
          elements.push(
            <DropdownItem
              key={`ov-${sub.label}`}
              role="menuitem"
              disabled={sub.disabled}
              aria-disabled={sub.disabled || undefined}
              focused={navIdx === overflowFocusedIndex}
              onClick={() => handleOverflowItemClick(sub)}
              onMouseEnter={sub.disabled ? undefined : () => setOverflowFocusedIndex(navIdx)}
            >
              <span>{sub.label}</span>
              {sub.shortcut && <Shortcut>{formatShortcut(sub.shortcut, platform)}</Shortcut>}
            </DropdownItem>,
          );
        }
      } else {
        const navIdx = item.disabled ? -1 : flatIdx++;
        elements.push(
          <DropdownItem
            key={`ov-item-${item.label}`}
            role="menuitem"
            disabled={item.disabled}
            aria-disabled={item.disabled || undefined}
            focused={navIdx === overflowFocusedIndex}
            onClick={() => {
              if (!item.disabled) {
                item.action?.();
                setOverflowOpen(false);
                setOverflowFocusedIndex(-1);
              }
            }}
            onMouseEnter={item.disabled ? undefined : () => setOverflowFocusedIndex(navIdx)}
          >
            <span>{item.label}</span>
          </DropdownItem>,
        );
      }

      return <React.Fragment key={item.label}>{elements}</React.Fragment>;
    });
  }

  return (
    <MenuContainer ref={menuRef} role="menubar" aria-label="Application menu" onKeyDown={handleKeyDown}>
      {items.slice(0, visibleCount).map((item, i) => (
        <div key={item.label} data-menu-item style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
          <MenuItemButton
            role="menuitem"
            aria-haspopup={item.submenu ? 'true' : undefined}
            aria-expanded={openIndex === i ? true : undefined}
            active={openIndex === i}
            disabled={item.disabled}
            onClick={() => handleMenuItemClick(i, item)}
            onMouseEnter={() => {
              if (openIndex !== null) setOpenIndex(i);
            }}
          >
            {item.label}
          </MenuItemButton>

          {openIndex === i && item.submenu && (
            <Dropdown ref={dropdownRef} tabIndex={-1} role="menu" aria-label={`${item.label} submenu`}>
              {item.submenu.map((sub, subIdx) =>
                sub.type === 'separator' ? (
                  <Separator key={`sep-${item.label}-${sub.label || subIdx}`} role="separator" />
                ) : (
                  <DropdownItem
                    key={sub.label}
                    role="menuitem"
                    disabled={sub.disabled}
                    focused={focusedSubIndex === subIdx}
                    aria-disabled={sub.disabled || undefined}
                    onClick={() => handleSubmenuClick(sub)}
                    onMouseEnter={() => setFocusedSubIndex(subIdx)}
                    onMouseLeave={() => setFocusedSubIndex(-1)}
                  >
                    <span>{sub.label}</span>
                    {sub.shortcut && <Shortcut>{formatShortcut(sub.shortcut, platform)}</Shortcut>}
                  </DropdownItem>
                ),
              )}
            </Dropdown>
          )}
        </div>
      ))}

      {hasOverflow && (
        <div ref={overflowRef} style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
          <OverflowButton
            role="menuitem"
            aria-haspopup="true"
            aria-expanded={overflowOpen || undefined}
            aria-label={`${overflowItems.length} more menu items`}
            active={overflowOpen}
            onClick={() => setOverflowOpen((prev) => !prev)}
            onMouseEnter={() => {
              if (openIndex !== null) {
                setOpenIndex(null);
                setOverflowOpen(true);
              }
            }}
            data-testid="menu-overflow-button"
          >
            ⋯
          </OverflowButton>

          {overflowOpen && (
            <Dropdown role="menu" aria-label="More menu items" tabIndex={-1}>
              {renderOverflowDropdown()}
            </Dropdown>
          )}
        </div>
      )}
    </MenuContainer>
  );
}
