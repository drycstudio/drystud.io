import React from 'react';
import { createPortal } from 'react-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import { OS } from '~/utils';
import type { Platform } from '~/utils';
import titlebarLogo from '~/assets/icon/logo/electron-pretty-titlebar-logo.svg';

import { useTitlebarActions } from './hooks/useTitlebarActions';

import { WindowControls } from './components/WindowControls';
import type { MenuItem } from './components/Menu';

import { htmlTagStyles, Logo, LogoImage, TitlebarContainer } from './styles';

const ipcHandle = 'electron' in globalThis ? (globalThis as unknown as Window).electron.ipcRenderer : null;

export type { Platform } from '~/utils';
export { formatShortcut } from '~/utils';

export type { MenuItem, SubMenuItem, MenuItemAction } from './components/Menu';
export type { UserProfileProps, UserProfileAction, UserInfo, UserStatus } from './components/UserProfile';
export type {
  CommandPaletteConfig,
  CommandPaletteItem,
  CommandPaletteSection,
  FilterChip,
  CommandPaletteFooterAction,
  SearchBarProps,
  SearchResult,
} from './components/SearchBar';
export type { TitlebarAction, TitlebarActionDropdownItem, ToolbarActionsProps } from './components/ToolbarActions';
export {
  NotificationPanelRoot,
  NotificationHeader,
  NotificationTitle,
  NotificationHeaderActions,
  NotificationHeaderButton,
  NotificationList,
  NotificationItem,
  NotificationDot,
  NotificationIcon,
  NotificationContent,
  NotificationItemTitle,
  NotificationDescription,
  NotificationMeta,
  NotificationBadge,
  NotificationSeparator,
  NotificationFooter,
  NotificationFooterButton,
  NotificationEmpty,
  NotificationEmptyText,
  NotificationGroup,
  NotificationGroupLabel,
} from './components/ToolbarActions';

export type TitlebarProps = {
  title?: string | null;
  logo?: string;
  size?: 'default' | 'small';
  platform?: Platform;
  menuItems?: MenuItem[];
  user?: import('./components/UserProfile').UserInfo | null;
  userActions?: import('./components/UserProfile').UserProfileAction[];
  onSignIn?: () => void;
  onSignOut?: () => void;
  commandPalette?: import('./components/SearchBar').CommandPaletteConfig;
  actions?: import('./components/ToolbarActions').TitlebarAction[];
  renderActions?: () => React.ReactNode;
  onMinus?: () => void;
  onMinimizeMaximaze?: () => void;
  onClose?: () => void;
};

function detectPlatform(): Platform {
  if (OS.isMacOS()) return 'macos';
  if (OS.isLinux()) return 'linux';
  return 'windows';
}

export default function Titlebar({
  title = 'Pretty Titlebar',
  logo,
  size = 'default',
  platform: platformOverride,
  menuItems,
  user,
  userActions,
  onSignIn,
  onSignOut,
  commandPalette,
  actions,
  renderActions,
  onClose,
  onMinus,
  onMinimizeMaximaze,
}: TitlebarProps) {
  const [isWindowMaximized, setIsWindowMaximized] = React.useState<boolean>(false);
  const { handleMinimazeMaximaze, handleMinus, handleClose } = useTitlebarActions(ipcHandle, {
    toggleWindowMaximized: setIsWindowMaximized,
    onMinus,
    onMinimizeMaximaze,
    onClose,
  });

  const platform = platformOverride ?? detectPlatform();
  const isMac = platform === 'macos';
  const LOGO = logo || titlebarLogo;

  return (
    <HelmetProvider>
      <Helmet>
        <html data-titlebar='prettier' lang='pt' className={htmlTagStyles({ size })} />
      </Helmet>
      {createPortal(
        <TitlebarContainer size={size} platform={platform} role="banner" aria-label="Application titlebar">
          {!isMac && (
            <Logo>
              <LogoImage src={LOGO} alt='Electron Pretty Titlebar Logo' />
            </Logo>
          )}

          {isMac ? (
            <WindowControls
              title={title}
              menuItems={menuItems}
              platform={platform}
              user={user}
              userActions={userActions}
              onSignIn={onSignIn}
              onSignOut={onSignOut}
              commandPalette={commandPalette}
              actions={actions}
              renderActions={renderActions}
              macOnly
            />
          ) : (
            <WindowControls
              title={title}
              menuItems={menuItems}
              platform={platform}
              user={user}
              userActions={userActions}
              onSignIn={onSignIn}
              onSignOut={onSignOut}
              commandPalette={commandPalette}
              actions={actions}
              renderActions={renderActions}
              isWindowMaximized={isWindowMaximized}
              handleMinimazeMaximaze={handleMinimazeMaximaze}
              handleMinus={handleMinus}
              handleClose={handleClose}
            />
          )}
        </TitlebarContainer>,
        document.body
      )}
    </HelmetProvider>
  );
}
