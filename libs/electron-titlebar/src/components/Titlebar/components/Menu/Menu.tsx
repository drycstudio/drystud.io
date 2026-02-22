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
  SubMenuWrapper,
  SubMenuDropdown,
  ChevronIndicator,
} from './styles';

export type MenuProps = {
  items: MenuItem[];
  platform?: Platform;
};

function getActionableIndices(submenu: MenuItem[]): number[] {
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

function flattenOverflowItems(overflowItems: MenuItem[]): MenuItem[] {
  const flat: MenuItem[] = [];
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
const SUBMENU_HOVER_DELAY = 200;

type ChildPosition = { top: number; left: number };

function computeChildPosition(trigger: HTMLElement): ChildPosition {
  const rect = trigger.getBoundingClientRect();
  const submenuWidth = 240;
  const spaceRight = window.innerWidth - rect.right;
  const left = spaceRight >= submenuWidth
    ? rect.right + 2
    : rect.left - submenuWidth - 2;
  const top = Math.max(0, Math.min(rect.top - 6, window.innerHeight - 300));
  return { top, left };
}

type SubMenuItemsProps = {
  items: MenuItem[];
  platform: Platform;
  focusedIndex: number;
  onFocusIndex: (idx: number) => void;
  onItemClick: (item: MenuItem) => void;
  depth?: number;
  onCloseToParent?: () => void;
  onOpenRight?: () => void;
};

function SubMenuItems({
  items,
  platform,
  focusedIndex,
  onFocusIndex,
  onItemClick,
  depth = 0,
  onCloseToParent,
  onOpenRight,
}: SubMenuItemsProps) {
  const [openChildIndex, setOpenChildIndex] = React.useState<number | null>(null);
  const [childFocusedIndex, setChildFocusedIndex] = React.useState(-1);
  const [childPos, setChildPos] = React.useState<ChildPosition>({ top: 0, left: 0 });
  const hoverTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const childDropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  React.useEffect(() => {
    if (focusedIndex === -1) {
      setOpenChildIndex(null);
      setChildFocusedIndex(-1);
    }
  }, [focusedIndex]);

  function handleMouseEnter(idx: number, item: MenuItem, e: React.MouseEvent) {
    if (item.disabled || item.type === 'separator') return;
    onFocusIndex(idx);

    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);

    if (item.submenu && item.submenu.length > 0) {
      const target = e.currentTarget as HTMLElement;
      hoverTimerRef.current = setTimeout(() => {
        setChildPos(computeChildPosition(target));
        setOpenChildIndex(idx);
        setChildFocusedIndex(-1);
      }, SUBMENU_HOVER_DELAY);
    } else {
      hoverTimerRef.current = setTimeout(() => {
        setOpenChildIndex(null);
        setChildFocusedIndex(-1);
      }, SUBMENU_HOVER_DELAY);
    }
  }

  function handleMouseLeave(_idx: number, item: MenuItem) {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    if (!item.submenu || item.submenu.length === 0) {
      onFocusIndex(-1);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (openChildIndex !== null && items[openChildIndex]?.submenu) {
      return;
    }

    const actionable = getActionableIndices(items);

    switch (e.key) {
      case 'ArrowDown': {
        if (actionable.length === 0) break;
        e.preventDefault();
        e.stopPropagation();
        onFocusIndex(navigateActionable(actionable, focusedIndex, 1));
        break;
      }
      case 'ArrowUp': {
        if (actionable.length === 0) break;
        e.preventDefault();
        e.stopPropagation();
        onFocusIndex(navigateActionable(actionable, focusedIndex, -1));
        break;
      }
      case 'ArrowRight': {
        e.preventDefault();
        e.stopPropagation();
        const currentItem = focusedIndex >= 0 ? items[focusedIndex] : null;
        if (currentItem?.submenu && currentItem.submenu.length > 0) {
          setOpenChildIndex(focusedIndex);
          setChildFocusedIndex(-1);
          setTimeout(() => {
            childDropdownRef.current?.focus();
          }, 0);
        } else {
          onOpenRight?.();
        }
        break;
      }
      case 'ArrowLeft': {
        e.preventDefault();
        e.stopPropagation();
        onCloseToParent?.();
        break;
      }
      case 'Enter': {
        e.preventDefault();
        e.stopPropagation();
        if (focusedIndex >= 0 && items[focusedIndex]) {
          const item = items[focusedIndex];
          if (item.submenu && item.submenu.length > 0) {
            setOpenChildIndex(focusedIndex);
            setChildFocusedIndex(-1);
            setTimeout(() => {
              childDropdownRef.current?.focus();
            }, 0);
          } else {
            onItemClick(item);
          }
        }
        break;
      }
      default:
        break;
    }
  }

  function handleChildCloseToParent() {
    setOpenChildIndex(null);
    setChildFocusedIndex(-1);
  }

  return (
    <div role="presentation" onKeyDown={handleKeyDown}>
      {items.map((sub, subIdx) => {
        if (sub.type === 'separator') {
          return <Separator key={`sep-${sub.label || subIdx}`} role="separator" />;
        }

        const hasChildren = sub.submenu && sub.submenu.length > 0;

        return (
          <SubMenuWrapper key={sub.label}>
            <DropdownItem
              role="menuitem"
              disabled={sub.disabled}
              focused={focusedIndex === subIdx}
              aria-disabled={sub.disabled || undefined}
              aria-haspopup={hasChildren ? 'true' : undefined}
              aria-expanded={openChildIndex === subIdx ? true : undefined}
              onClick={(e) => {
                if (hasChildren) {
                  if (openChildIndex === subIdx) {
                    setOpenChildIndex(null);
                  } else {
                    setChildPos(computeChildPosition(e.currentTarget as HTMLElement));
                    setOpenChildIndex(subIdx);
                  }
                  setChildFocusedIndex(-1);
                } else {
                  onItemClick(sub);
                }
              }}
              onMouseEnter={(e) => handleMouseEnter(subIdx, sub, e)}
              onMouseLeave={() => handleMouseLeave(subIdx, sub)}
              data-testid={hasChildren ? `submenu-trigger-${sub.label}` : undefined}
            >
              <span>{sub.label}</span>
              {sub.shortcut && !hasChildren && (
                <Shortcut>{formatShortcut(sub.shortcut, platform)}</Shortcut>
              )}
              {hasChildren && <ChevronIndicator aria-hidden="true">▸</ChevronIndicator>}
            </DropdownItem>

            {hasChildren && openChildIndex === subIdx && (
              <SubMenuDropdown
                ref={childDropdownRef}
                tabIndex={-1}
                role="menu"
                aria-label={`${sub.label} submenu`}
                style={{ top: childPos.top, left: childPos.left }}
                data-testid={`submenu-dropdown-${sub.label}`}
              >
                <SubMenuItems
                  items={sub.submenu!}
                  platform={platform}
                  focusedIndex={childFocusedIndex}
                  onFocusIndex={setChildFocusedIndex}
                  onItemClick={onItemClick}
                  depth={depth + 1}
                  onCloseToParent={handleChildCloseToParent}
                  onOpenRight={onOpenRight}
                />
              </SubMenuDropdown>
            )}
          </SubMenuWrapper>
        );
      })}
    </div>
  );
}

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
  }, [items.length]); // only re-run when item count changes

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

  function closeAll() {
    setOpenIndex(null);
    setFocusedSubIndex(-1);
  }

  function handleMenuItemClick(index: number, item: MenuItem) {
    if (item.disabled) return;
    if (item.submenu) {
      setOpenIndex(openIndex === index ? null : index);
    } else if (item.action) {
      item.action();
      setOpenIndex(null);
    }
  }

  function handleSubmenuItemClick(sub: MenuItem) {
    if (sub.disabled || sub.type === 'separator') return;
    sub.action?.();
    closeAll();
  }

  function handleOverflowItemClick(sub: MenuItem) {
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
          const focusedItem = submenu[focusedSubIndex];
          if (focusedItem.submenu && focusedItem.submenu.length > 0) {
            // Do not close, let SubMenuItems handle opening the child
          } else {
            handleSubmenuItemClick(submenu[focusedSubIndex]);
          }
        }
        break;
      default:
        break;
    }
  }

  function handleOpenRightFromSubmenu() {
    if (openIndex !== null && openIndex < visibleCount - 1) {
      setOpenIndex(openIndex + 1);
    } else if (hasOverflow) {
      setOverflowOpen(true);
    } else if (visibleCount > 0) {
      setOpenIndex(0);
    }
  }

  function handleCloseToParentFromSubmenu() {
    if (openIndex !== null && openIndex > 0) {
      setOpenIndex(openIndex - 1);
    } else if (hasOverflow) {
      setOverflowOpen(true);
    } else if (visibleCount > 0) {
      setOpenIndex(visibleCount - 1);
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
              <SubMenuItems
                items={item.submenu}
                platform={platform}
                focusedIndex={focusedSubIndex}
                onFocusIndex={setFocusedSubIndex}
                onItemClick={handleSubmenuItemClick}
                depth={0}
                onCloseToParent={handleCloseToParentFromSubmenu}
                onOpenRight={handleOpenRightFromSubmenu}
              />
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
