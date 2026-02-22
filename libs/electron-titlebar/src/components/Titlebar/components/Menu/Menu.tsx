import React from 'react';

import type { Platform } from '~/utils';
import { formatShortcut } from '~/utils';
import type { MenuItem } from './types';
import {
  MenuContainer,
  MenuItemButton,
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

export function Menu({ items, platform = 'windows' }: MenuProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const [focusedSubIndex, setFocusedSubIndex] = React.useState<number>(-1);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenIndex(null);
        setFocusedSubIndex(-1);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  React.useEffect(() => {
    if (openIndex !== null) {
      setFocusedSubIndex(-1);
      dropdownRef.current?.focus();
    }
  }, [openIndex]);

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

  function handleKeyDown(e: React.KeyboardEvent) {
    if (openIndex === null) return;

    const submenu = items[openIndex]?.submenu;

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setOpenIndex(null);
        setFocusedSubIndex(-1);
        break;

      case 'ArrowLeft':
        e.preventDefault();
        setOpenIndex(navigateIndex(openIndex, items.length, -1));
        break;

      case 'ArrowRight':
        e.preventDefault();
        setOpenIndex(navigateIndex(openIndex, items.length, 1));
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

  return (
    <MenuContainer ref={menuRef} onKeyDown={handleKeyDown}>
      {items.map((item, i) => (
        <div key={item.label} style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
          <MenuItemButton
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
            <Dropdown ref={dropdownRef} tabIndex={-1}>
              {item.submenu.map((sub, subIdx) =>
                sub.type === 'separator' ? (
                  <Separator key={`sep-${item.label}-${subIdx}`} />
                ) : (
                  <DropdownItem
                    key={sub.label}
                    disabled={sub.disabled}
                    focused={focusedSubIndex === subIdx}
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
    </MenuContainer>
  );
}
