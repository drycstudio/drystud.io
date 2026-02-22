export type MenuItemAction = () => void;

/**
 * @deprecated Use `MenuItem` instead. `SubMenuItem` is kept as an alias for backward compatibility.
 */
export type SubMenuItem = MenuItem;

export type MenuItem = {
  label: string;
  action?: MenuItemAction;
  submenu?: MenuItem[];
  disabled?: boolean;
  type?: 'separator';
  shortcut?: string;
};
