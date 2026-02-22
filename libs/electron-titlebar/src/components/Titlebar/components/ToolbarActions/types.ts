import type { ReactNode } from 'react';

export type TitlebarActionDropdownItem =
  | { label: string; icon?: ReactNode; action: () => void; type?: never; disabled?: boolean }
  | { label: string; type: 'separator'; action?: never; icon?: never; disabled?: never };

export type TitlebarAction = {
  id: string;
  icon: ReactNode;
  label?: string;
  variant?: 'icon' | 'filled';
  tooltip?: string;
  badge?: number | boolean;
  badgeVariant?: 'default' | 'attention' | 'success';
  highlight?: boolean;
  onClick?: () => void;
  dropdown?: TitlebarActionDropdownItem[];
  disabled?: boolean;
};

export type ToolbarActionsProps = {
  actions?: TitlebarAction[];
  renderActions?: () => ReactNode;
};
