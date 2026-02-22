export type MenuItemAction = () => void;

export type SubMenuItem = {
  label: string;
  action?: MenuItemAction;
  disabled?: boolean;
  type?: 'separator';
  shortcut?: string;
};

export type MenuItem = {
  label: string;
  action?: MenuItemAction;
  submenu?: SubMenuItem[];
  disabled?: boolean;
};
