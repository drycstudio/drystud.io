import type React from 'react';

export type CommandPaletteItem = {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  badge?: string;
  metadata?: string;
  disabled?: boolean;
  action: () => void;
};

export type CommandPaletteSection = {
  id: string;
  title?: string;
  items: CommandPaletteItem[];
};

export type FilterChip = {
  id: string;
  label: string;
  active?: boolean;
  onToggle: () => void;
};

export type CommandPaletteFooterAction = {
  id: string;
  icon?: React.ReactNode;
  label: string;
  action: () => void;
};

export type CommandPaletteConfig = {
  placeholder?: string;
  shortcut?: string;
  sections: CommandPaletteSection[];
  filters?: FilterChip[];
  footerActions?: CommandPaletteFooterAction[];
  loading?: boolean;
  emptyMessage?: string;
  onQueryChange?: (query: string) => void;
  onOpen?: () => void;
  onClose?: () => void;
  renderItem?: (item: CommandPaletteItem, focused: boolean) => React.ReactNode;
  renderFooter?: () => React.ReactNode;
};

/** @deprecated Use CommandPaletteItem instead */
export type SearchResult = {
  id: string;
  label: string;
  shortcut?: string;
  action: () => void;
};

/** @deprecated Use CommandPaletteConfig instead */
export type SearchBarProps = {
  placeholder?: string;
  shortcut?: string;
  onSearch?: (query: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
};
