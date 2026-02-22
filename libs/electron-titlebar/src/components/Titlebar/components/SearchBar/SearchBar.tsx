import React from 'react';
import { createPortal } from 'react-dom';
import { FiSearch } from 'react-icons/fi';

import type { Platform } from '~/utils';
import { formatShortcut } from '~/utils';
import type {
  CommandPaletteConfig,
  CommandPaletteItem,
  CommandPaletteSection,
} from './types';
import {
  Container,
  InputWrapper,
  SearchIcon,
  PlaceholderText,
  ShortcutBadge,
  Overlay,
  PaletteContainer,
  PaletteInputWrapper,
  PaletteInputIcon,
  PaletteInput,
  PaletteResults,
  PaletteItem,
  ItemIcon,
  ItemContent,
  ItemLabel,
  ItemDescription,
  ItemTrailing,
  ItemBadge,
  ItemMetadata,
  ItemShortcut,
  SectionHeader,
  FilterBar,
  FilterChipButton,
  Footer,
  FooterActionButton,
  LoadingContainer,
  LoadingSpinner,
  EmptyState,
} from './styles';

export type SearchBarFullProps = CommandPaletteConfig & {
  platform?: Platform;
  centered?: boolean;
};

function flattenItems(
  sections: CommandPaletteSection[],
): CommandPaletteItem[] {
  return sections.flatMap((s) =>
    s.items.filter((item) => !item.disabled),
  );
}

export function SearchBar({
  placeholder = 'Search...',
  shortcut = 'Ctrl+K',
  sections = [],
  filters,
  footerActions,
  loading = false,
  emptyMessage = 'No results found',
  onQueryChange,
  onOpen,
  onClose,
  renderItem,
  renderFooter,
  platform = 'windows',
  centered = false,
}: SearchBarFullProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [focusedIndex, setFocusedIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const hasOpenedRef = React.useRef(false);

  const navigableItems = React.useMemo(
    () => flattenItems(sections),
    [sections],
  );

  const totalItems = React.useMemo(
    () => sections.reduce((sum, s) => sum + s.items.length, 0),
    [sections],
  );

  React.useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isMac = platform === 'macos';
      const modifier = isMac ? e.metaKey : e.ctrlKey;
      if (modifier && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [platform]);

  React.useEffect(() => {
    if (open) {
      hasOpenedRef.current = true;
      setQuery('');
      setFocusedIndex(-1);
      requestAnimationFrame(() => inputRef.current?.focus());
      onOpen?.();
    } else if (hasOpenedRef.current) {
      onClose?.();
    }
  }, [open, onOpen, onClose]);

  const handleClose = React.useCallback(() => {
    setOpen(false);
    setQuery('');
    setFocusedIndex(-1);
  }, []);

  const handleSelect = React.useCallback(
    (item: CommandPaletteItem) => {
      /* v8 ignore start */
      if (item.disabled) return;
      /* v8 ignore stop */
      item.action();
      handleClose();
    },
    [handleClose],
  );

  const handlePaletteKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          handleClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev < navigableItems.length - 1 ? prev + 1 : 0,
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev > 0 ? prev - 1 : navigableItems.length - 1,
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (focusedIndex >= 0 && navigableItems[focusedIndex]) {
            handleSelect(navigableItems[focusedIndex]);
          }
          break;
        default:
          break;
      }
    },
    [navigableItems, focusedIndex, handleClose, handleSelect],
  );

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setQuery(val);
      setFocusedIndex(-1);
      onQueryChange?.(val);
    },
    [onQueryChange],
  );

  const displayedShortcut = formatShortcut(shortcut, platform);

  const navIndexMap = React.useMemo(() => {
    const map = new Map<string, number>();
    let counter = 0;
    for (const section of sections) {
      for (const item of section.items) {
        if (!item.disabled) {
          map.set(item.id, counter++);
        }
      }
    }
    return map;
  }, [sections]);

  function renderPaletteItem(item: CommandPaletteItem) {
    const isDisabled = !!item.disabled;
    /* v8 ignore start */
    const navIdx = isDisabled ? -1 : (navIndexMap.get(item.id) ?? -1);
    /* v8 ignore stop */
    const isFocused = navIdx === focusedIndex;

    if (renderItem) {
      return (
        <div key={item.id} data-testid={`palette-item-${item.id}`}>
          {renderItem(item, isFocused)}
        </div>
      );
    }

    return (
      <PaletteItem
        key={item.id}
        focused={isFocused}
        disabled={isDisabled}
        onClick={() => handleSelect(item)}
        onMouseEnter={isDisabled ? undefined : () => setFocusedIndex(navIdx)}
        data-testid={`palette-item-${item.id}`}
      >
        {item.icon && <ItemIcon>{item.icon}</ItemIcon>}
        <ItemContent>
          <ItemLabel>{item.label}</ItemLabel>
          {item.description && (
            <ItemDescription>{item.description}</ItemDescription>
          )}
        </ItemContent>
        <ItemTrailing>
          {item.badge && <ItemBadge>{item.badge}</ItemBadge>}
          {item.metadata && <ItemMetadata>{item.metadata}</ItemMetadata>}
          {item.shortcut && (
            <ItemShortcut>{formatShortcut(item.shortcut, platform)}</ItemShortcut>
          )}
        </ItemTrailing>
      </PaletteItem>
    );
  }

  function renderPaletteBody() {
    if (loading) {
      return (
        <LoadingContainer data-testid="searchbar-loading">
          <LoadingSpinner />
        </LoadingContainer>
      );
    }

    if (totalItems === 0) {
      return (
        <EmptyState data-testid="searchbar-empty">
          {emptyMessage}
        </EmptyState>
      );
    }

    return (
      <PaletteResults data-testid="searchbar-results">
        {sections.map((section) => (
          <div key={section.id} data-testid={`section-${section.id}`}>
            {section.title && <SectionHeader>{section.title}</SectionHeader>}
            {section.items.map((item) => renderPaletteItem(item))}
          </div>
        ))}
      </PaletteResults>
    );
  }

  function renderPaletteFooter() {
    if (renderFooter) return renderFooter();
    if (!footerActions || footerActions.length === 0) return null;

    return (
      <Footer data-testid="searchbar-footer">
        {footerActions.map((fa) => (
          <FooterActionButton
            key={fa.id}
            onClick={fa.action}
            data-testid={`footer-action-${fa.id}`}
          >
            {fa.icon && (
              <span style={{ display: 'flex' }}>{fa.icon}</span>
            )}
            {fa.label}
          </FooterActionButton>
        ))}
      </Footer>
    );
  }

  return (
    <>
      <Container centered={centered} role="search">
        <InputWrapper
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open || undefined}
          aria-label={placeholder}
          data-testid="searchbar-trigger"
        >
          <SearchIcon aria-hidden="true">
            <FiSearch style={{ width: '13px', height: '13px' }} />
          </SearchIcon>
          <PlaceholderText>{placeholder}</PlaceholderText>
          <ShortcutBadge aria-hidden="true">{displayedShortcut}</ShortcutBadge>
        </InputWrapper>
      </Container>

      {open &&
        createPortal(
          <Overlay
            onClick={(e) => {
              if (e.target === e.currentTarget) handleClose();
            }}
            data-testid="searchbar-overlay"
          >
            <PaletteContainer
              role="dialog"
              aria-label="Command palette"
              aria-modal="true"
              onKeyDown={handlePaletteKeyDown}
              data-testid="searchbar-palette"
            >
              <PaletteInputWrapper>
                <PaletteInputIcon aria-hidden="true">
                  <FiSearch style={{ width: '16px', height: '16px' }} />
                </PaletteInputIcon>
                <PaletteInput
                  ref={inputRef}
                  value={query}
                  onChange={handleInputChange}
                  placeholder={placeholder}
                  aria-label="Search commands"
                  aria-autocomplete="list"
                  data-testid="searchbar-input"
                />
              </PaletteInputWrapper>

              {filters && filters.length > 0 && (
                <FilterBar data-testid="searchbar-filters">
                  {filters.map((chip) => (
                    <FilterChipButton
                      key={chip.id}
                      active={chip.active}
                      onClick={chip.onToggle}
                      data-testid={`filter-chip-${chip.id}`}
                    >
                      {chip.label}
                    </FilterChipButton>
                  ))}
                </FilterBar>
              )}

              {renderPaletteBody()}
              {renderPaletteFooter()}
            </PaletteContainer>
          </Overlay>,
          document.body,
        )}
    </>
  );
}
