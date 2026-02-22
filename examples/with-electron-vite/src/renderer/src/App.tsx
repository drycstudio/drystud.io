import { useState, useCallback } from 'react'

import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'

import { FiBell, FiSettings, FiZap, FiCheckCircle, FiUserPlus, FiPackage, FiDownload, FiRefreshCw } from 'react-icons/fi'

import Titlebar from '@drycstud.io/electron-titlebar'
import type {
  MenuItem,
  UserInfo,
  UserProfileAction,
  CommandPaletteSection,
  CommandPaletteConfig,
  FilterChip,
  TitlebarAction,
} from '@drycstud.io/electron-titlebar'

const menuItems: MenuItem[] = [
  {
    label: 'File',
    submenu: [
      { label: 'New File', shortcut: 'Ctrl+N', action: () => console.log('New File') },
      { label: 'New Window', shortcut: 'Ctrl+Shift+N', action: () => console.log('New Window') },
      { type: 'separator', label: '' },
      { label: 'Open File...', shortcut: 'Ctrl+O', action: () => console.log('Open File') },
      { label: 'Open Folder...', shortcut: 'Ctrl+Shift+O', action: () => console.log('Open Folder') },
      { label: 'Open Recent', disabled: true, action: () => {} },
      { type: 'separator', label: '' },
      { label: 'Save', shortcut: 'Ctrl+S', action: () => console.log('Save') },
      { label: 'Save As...', shortcut: 'Ctrl+Shift+S', action: () => console.log('Save As') },
      { label: 'Save All', shortcut: 'Ctrl+Alt+S', action: () => console.log('Save All') },
      { type: 'separator', label: '' },
      { label: 'Preferences', shortcut: 'Ctrl+,', action: () => console.log('Preferences') },
      { type: 'separator', label: '' },
      { label: 'Exit', shortcut: 'Alt+F4', action: () => globalThis.close() },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      { label: 'Undo', shortcut: 'Ctrl+Z', action: () => console.log('Undo') },
      { label: 'Redo', shortcut: 'Ctrl+Shift+Z', action: () => console.log('Redo') },
      { type: 'separator', label: '' },
      { label: 'Cut', shortcut: 'Ctrl+X', action: () => console.log('Cut') },
      { label: 'Copy', shortcut: 'Ctrl+C', action: () => console.log('Copy') },
      { label: 'Paste', shortcut: 'Ctrl+V', action: () => console.log('Paste') },
      { label: 'Delete', action: () => console.log('Delete') },
      { type: 'separator', label: '' },
      { label: 'Find', shortcut: 'Ctrl+F', action: () => console.log('Find') },
      { label: 'Find and Replace', shortcut: 'Ctrl+H', action: () => console.log('Find and Replace') },
      { type: 'separator', label: '' },
      { label: 'Select All', shortcut: 'Ctrl+A', action: () => console.log('Select All') },
    ],
  },
  {
    label: 'View',
    submenu: [
      { label: 'Command Palette...', shortcut: 'Ctrl+Shift+P', action: () => console.log('Command Palette') },
      { type: 'separator', label: '' },
      { label: 'Toggle Full Screen', shortcut: 'F11', action: () => console.log('Toggle Full Screen') },
      { label: 'Toggle Sidebar', shortcut: 'Ctrl+B', action: () => console.log('Toggle Sidebar') },
      { label: 'Toggle Panel', shortcut: 'Ctrl+J', action: () => console.log('Toggle Panel') },
      { type: 'separator', label: '' },
      { label: 'Zoom In', shortcut: 'Ctrl+=', action: () => console.log('Zoom In') },
      { label: 'Zoom Out', shortcut: 'Ctrl+-', action: () => console.log('Zoom Out') },
      { label: 'Reset Zoom', shortcut: 'Ctrl+0', action: () => console.log('Reset Zoom') },
      { type: 'separator', label: '' },
      { label: 'Toggle Word Wrap', shortcut: 'Alt+Z', action: () => console.log('Toggle Word Wrap') },
    ],
  },
  {
    label: 'Terminal',
    submenu: [
      { label: 'New Terminal', shortcut: 'Ctrl+`', action: () => console.log('New Terminal') },
      { label: 'Split Terminal', shortcut: 'Ctrl+Shift+5', action: () => console.log('Split Terminal') },
      { type: 'separator', label: '' },
      { label: 'Run Task...', action: () => console.log('Run Task') },
      { label: 'Run Build Task...', shortcut: 'Ctrl+Shift+B', action: () => console.log('Run Build Task') },
      { type: 'separator', label: '' },
      { label: 'Configure Tasks...', action: () => console.log('Configure Tasks') },
    ],
  },
  {
    label: 'Window',
    submenu: [
      { label: 'Minimize', shortcut: 'Ctrl+M', action: () => console.log('Minimize') },
      { label: 'Maximize', action: () => console.log('Maximize') },
      { type: 'separator', label: '' },
      { label: 'Close Window', shortcut: 'Ctrl+W', action: () => console.log('Close Window') },
    ],
  },
  {
    label: 'Help',
    submenu: [
      { label: 'Welcome', action: () => console.log('Welcome') },
      { label: 'Documentation', action: () => console.log('Documentation') },
      { label: 'Release Notes', action: () => console.log('Release Notes') },
      { type: 'separator', label: '' },
      { label: 'Report Issue...', action: () => console.log('Report Issue') },
      { type: 'separator', label: '' },
      { label: 'Toggle Developer Tools', shortcut: 'F12', action: () => console.log('Toggle DevTools') },
      { type: 'separator', label: '' },
      { label: 'About', action: () => console.log('About') },
    ],
  },
]

const currentUser: UserInfo = {
  name: 'Euclides Dry',
  email: 'euclides@drycstudio.io',
  status: 'online',
}

const userActions: UserProfileAction[] = [
  { label: 'My Account', action: () => console.log('My Account') },
  { label: 'Settings', action: () => console.log('Settings') },
  { type: 'separator', label: 'sep' },
  { label: 'Switch Workspace', action: () => console.log('Switch Workspace') },
]

const recentSections: CommandPaletteSection[] = [
  {
    id: 'recent',
    title: 'Recently Viewed',
    items: [
      {
        id: 'recent-1',
        label: 'GET /api/users',
        description: 'User Management Collection',
        icon: '🟢',
        metadata: 'Last viewed 2 hours ago',
        badge: 'GET',
        action: () => console.log('Open GET /api/users'),
      },
      {
        id: 'recent-2',
        label: 'POST /api/auth/login',
        description: 'Authentication Collection',
        icon: '🟡',
        metadata: 'Last viewed yesterday',
        badge: 'POST',
        action: () => console.log('Open POST /api/auth/login'),
      },
      {
        id: 'recent-3',
        label: 'Environment: Production',
        description: 'Environment configuration',
        icon: '⚙️',
        metadata: 'Modified 3 days ago',
        action: () => console.log('Open Production env'),
      },
    ],
  },
  {
    id: 'commands',
    title: 'Quick Actions',
    items: [
      {
        id: 'cmd-new-request',
        label: 'New Request',
        description: 'Create a new HTTP request',
        icon: '➕',
        shortcut: 'Ctrl+N',
        action: () => console.log('New Request'),
      },
      {
        id: 'cmd-new-collection',
        label: 'New Collection',
        description: 'Create a new collection to organize requests',
        icon: '📁',
        action: () => console.log('New Collection'),
      },
      {
        id: 'cmd-import',
        label: 'Import Collection',
        description: 'Import from OpenAPI, cURL, or file',
        icon: '📥',
        shortcut: 'Ctrl+I',
        action: () => console.log('Import'),
      },
      {
        id: 'cmd-environments',
        label: 'Manage Environments',
        description: 'View and edit environment variables',
        icon: '🌐',
        shortcut: 'Ctrl+E',
        action: () => console.log('Environments'),
      },
      {
        id: 'cmd-runner',
        label: 'Collection Runner',
        description: 'Run a collection of requests in sequence',
        icon: '▶️',
        action: () => console.log('Runner'),
      },
    ],
  },
  {
    id: 'workspaces',
    title: 'Workspaces',
    items: [
      {
        id: 'ws-personal',
        label: 'Personal Workspace',
        description: '12 collections · 48 requests',
        icon: '👤',
        badge: 'Active',
        action: () => console.log('Personal Workspace'),
      },
      {
        id: 'ws-team',
        label: 'Team Workspace',
        description: '28 collections · 156 requests',
        icon: '👥',
        action: () => console.log('Team Workspace'),
      },
    ],
  },
]

const toolbarActions: TitlebarAction[] = [
  {
    id: 'notifications',
    icon: <FiBell />,
    tooltip: 'Notifications',
    badge: 3,
    badgeVariant: 'attention',
    dropdown: [
      { label: 'Mark all as read', icon: <FiCheckCircle />, action: () => console.log('Mark all read') },
      { label: '', type: 'separator' },
      { label: 'New deployment completed', icon: <FiPackage />, action: () => console.log('Deployment') },
      { label: 'Team invite from John', icon: <FiUserPlus />, action: () => console.log('Team invite') },
      { label: 'Build succeeded: v2.1.0', icon: <FiCheckCircle />, action: () => console.log('Build') },
    ],
  },
  {
    id: 'settings',
    icon: <FiSettings />,
    tooltip: 'Settings',
    onClick: () => console.log('Open settings'),
  },
  {
    id: 'upgrade',
    icon: <FiZap />,
    label: 'Update v2.1.0',
    variant: 'filled',
    tooltip: 'Update Available — v2.1.0',
    badgeVariant: 'success',
    onClick: () => console.log('Download & Update Now'),
    dropdown: [
      { label: 'Download & Update Now', icon: <FiRefreshCw />, action: () => console.log('Download & Update') },
      { label: 'Download Only', icon: <FiDownload />, action: () => console.log('Download Only') },
      { label: '', type: 'separator' },
      { label: 'Release Notes', icon: <FiPackage />, action: () => console.log('Release Notes') },
    ],
  },
]

function buildSearchSections(query: string): CommandPaletteSection[] {
  const q = query.toLowerCase()
  const allItems = recentSections.flatMap((s) => s.items)
  const matched = allItems.filter(
    (item) =>
      item.label.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q),
  )

  if (matched.length === 0) return []

  return [{ id: 'search-results', title: `Results for "${query}"`, items: matched }]
}

function App(): JSX.Element {
  const ipcHandle = (): void => globalThis.electron.ipcRenderer.send('ping')

  const [sections, setSections] = useState<CommandPaletteSection[]>(recentSections)
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({
    requests: false,
    collections: false,
    environments: false,
  })

  const handleQueryChange = useCallback((query: string) => {
    if (!query.trim()) {
      setSections(recentSections)
    } else {
      setSections(buildSearchSections(query))
    }
  }, [])

  const toggleFilter = useCallback((id: string) => {
    setActiveFilters((prev) => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const filters: FilterChip[] = [
    { id: 'requests', label: 'Requests', active: activeFilters.requests, onToggle: () => toggleFilter('requests') },
    { id: 'collections', label: 'Collections', active: activeFilters.collections, onToggle: () => toggleFilter('collections') },
    { id: 'environments', label: 'Environments', active: activeFilters.environments, onToggle: () => toggleFilter('environments') },
  ]

  const commandPalette: CommandPaletteConfig = {
    placeholder: 'Search commands, requests, collections...',
    shortcut: 'Ctrl+K',
    sections,
    filters,
    footerActions: [
      { id: 'search-web', icon: '🔍', label: 'Search in Workspace', action: () => console.log('Search workspace') },
      { id: 'search-docs', icon: '📖', label: 'Browse Documentation', action: () => console.log('Browse docs') },
    ],
    emptyMessage: 'No matching results. Try a different search term.',
    onQueryChange: handleQueryChange,
    onOpen: () => console.log('Command palette opened'),
    onClose: () => console.log('Command palette closed'),
  }

  return (
    <>
      <Titlebar
        title="Electron Pretty Titlebar"
        logo={electronLogo}
        menuItems={menuItems}
        user={currentUser}
        userActions={userActions}
        onSignOut={() => console.log('Sign out clicked')}
        commandPalette={commandPalette}
        actions={toolbarActions}
        onMinus={() => console.log('Custom minimize handler')}
        onClose={() => console.log('Custom close handler')}
      />
      <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span> and{' '}
        <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className="action">
          <button type="button" onClick={ipcHandle}>
            Send IPC
          </button>
        </div>
      </div>
      <Versions />
    </>
  )
}

export default App
