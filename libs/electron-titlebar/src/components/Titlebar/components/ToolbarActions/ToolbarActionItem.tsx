import React from 'react';
import { FiChevronDown } from 'react-icons/fi';
import type { TitlebarAction } from './types';
import {
  ActionItemWrapper,
  ActionButton,
  Badge,
  Tooltip,
  ActionDropdown,
  DropdownItem,
  DropdownSeparator,
  SplitButtonContainer,
  SplitMainButton,
  SplitDivider,
  SplitChevronButton,
} from './styles';

function formatBadge(value: number): string {
  return value > 99 ? '99+' : String(value);
}

export function ToolbarActionItem({ action }: { action: TitlebarAction }) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [showTooltip, setShowTooltip] = React.useState(false);
  const [focusedIndex, setFocusedIndex] = React.useState(-1);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const actionableIndices = React.useMemo(() => {
    if (!action.dropdown) return [];
    return action.dropdown.reduce<number[]>((acc, item, i) => {
      if (item.type !== 'separator' && !item.disabled) acc.push(i);
      return acc;
    }, []);
  }, [action.dropdown]);

  React.useEffect(() => {
    if (!dropdownOpen) {
      setFocusedIndex(-1);
      return;
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          setDropdownOpen(false);
          break;
        case 'ArrowDown': {
          e.preventDefault();
          setFocusedIndex((prev) => {
            const currentPos = actionableIndices.indexOf(prev);
            const next = currentPos < actionableIndices.length - 1 ? currentPos + 1 : 0;
            return actionableIndices[next] ?? -1;
          });
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          setFocusedIndex((prev) => {
            const currentPos = actionableIndices.indexOf(prev);
            const next = currentPos > 0 ? currentPos - 1 : actionableIndices.length - 1;
            return actionableIndices[next] ?? -1;
          });
          break;
        }
        case 'Enter': {
          if (focusedIndex >= 0 && action.dropdown) {
            const item = action.dropdown[focusedIndex];
            if (item && item.type !== 'separator' && !item.disabled) {
              try {
                item.action();
              } finally {
                setDropdownOpen(false);
              }
            }
          }
          break;
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dropdownOpen, focusedIndex, actionableIndices, action.dropdown]);

  const hasDropdown = action.dropdown && action.dropdown.length > 0;
  const badgeKind = typeof action.badge === 'number' ? 'count' : 'dot';
  const showBadge = action.badge !== undefined && action.badge !== false && action.badge !== 0;

  function handleClick() {
    if (action.disabled) return;
    if (hasDropdown) {
      setDropdownOpen((prev) => !prev);
    } else {
      action.onClick?.();
    }
  }

  const dropdownContent = dropdownOpen && hasDropdown && (
    <ActionDropdown data-testid={`toolbar-dropdown-${action.id}`} role="menu">
      {action.dropdown!.map((item, index) =>
        item.type === 'separator' ? (
          <DropdownSeparator key={`sep-${index}`} role="separator" />
        ) : (
          <DropdownItem
            key={item.label}
            role="menuitem"
            disabled={item.disabled}
            data-focused={index === focusedIndex || undefined}
            onMouseEnter={() => setFocusedIndex(index)}
            onClick={() => {
              try {
                item.action();
              } finally {
                setDropdownOpen(false);
              }
            }}
          >
            {item.icon}
            {item.label}
          </DropdownItem>
        ),
      )}
    </ActionDropdown>
  );

  if (action.variant === 'filled') {
    return (
      <ActionItemWrapper
        ref={wrapperRef}
        onMouseEnter={() => !dropdownOpen && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <SplitButtonContainer
          role="group"
          aria-label={action.tooltip || action.label}
          variant={action.badgeVariant || 'default'}
          disabled={action.disabled}
          data-testid={`toolbar-action-${action.id}`}
        >
          <SplitMainButton
            onClick={() => { if (!action.disabled) action.onClick?.(); }}
            disabled={action.disabled}
            aria-label={action.tooltip}
            data-testid={`toolbar-action-${action.id}-main`}
          >
            {action.icon}
            {action.label}
          </SplitMainButton>
          {hasDropdown && (
            <>
              <SplitDivider />
              <SplitChevronButton
                onClick={() => { if (!action.disabled) setDropdownOpen((prev) => !prev); }}
                disabled={action.disabled}
                aria-label={`${action.tooltip || action.label} options`}
                data-testid={`toolbar-action-${action.id}-chevron`}
              >
                <FiChevronDown />
              </SplitChevronButton>
            </>
          )}
        </SplitButtonContainer>

        {showTooltip && action.tooltip && !dropdownOpen && (
          <Tooltip>{action.tooltip}</Tooltip>
        )}

        {dropdownContent}
      </ActionItemWrapper>
    );
  }

  return (
    <ActionItemWrapper
      ref={wrapperRef}
      onMouseEnter={() => !dropdownOpen && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <ActionButton
        onClick={handleClick}
        disabled={action.disabled}
        active={dropdownOpen}
        highlight={action.highlight && !dropdownOpen}
        aria-label={action.tooltip}
        data-testid={`toolbar-action-${action.id}`}
      >
        {action.icon}
        {showBadge && (
          <Badge
            kind={badgeKind}
            variant={action.badgeVariant || 'default'}
            aria-live="polite"
            data-testid={`toolbar-badge-${action.id}`}
          >
            {badgeKind === 'count' ? formatBadge(action.badge as number) : null}
          </Badge>
        )}
      </ActionButton>

      {showTooltip && action.tooltip && !dropdownOpen && (
        <Tooltip>{action.tooltip}</Tooltip>
      )}

      {dropdownContent}
    </ActionItemWrapper>
  );
}
