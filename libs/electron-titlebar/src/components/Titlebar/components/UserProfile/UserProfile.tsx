import React from 'react';
import { FiUser } from 'react-icons/fi';
import type { UserProfileProps } from './types';
import {
  Container,
  AvatarButton,
  AvatarImage,
  AvatarFallback,
  StatusDot,
  SignInButton,
  Dropdown,
  UserHeader,
  UserName,
  UserEmail,
  DropdownItem,
  Separator,
} from './styles';

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('');
}

export function UserProfile({ user, actions, onSignIn, onSignOut }: UserProfileProps) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return onSignIn ? (
      <Container>
        <SignInButton onClick={onSignIn} data-testid="sign-in-button">
          <FiUser style={{ marginRight: '6px', width: '14px', height: '14px' }} />
          Sign In
        </SignInButton>
      </Container>
    ) : null;
  }

  return (
    <Container ref={containerRef}>
      <AvatarButton
        onClick={() => setOpen(!open)}
        aria-haspopup="true"
        aria-expanded={open || undefined}
        aria-label={`User menu for ${user.name}`}
        data-testid="avatar-button"
      >
        <div style={{ position: 'relative', display: 'flex' }}>
          {user.avatar ? (
            <AvatarImage src={user.avatar} alt={user.name} />
          ) : (
            <AvatarFallback aria-hidden="true">{getInitials(user.name)}</AvatarFallback>
          )}
          {user.status && <StatusDot status={user.status} aria-label={`Status: ${user.status}`} data-testid="status-dot" />}
        </div>
      </AvatarButton>

      {open && (
        <Dropdown role="menu" aria-label="User menu" data-testid="user-dropdown">
          <UserHeader>
            <UserName>{user.name}</UserName>
            {user.email && <UserEmail>{user.email}</UserEmail>}
          </UserHeader>

          {actions?.map((item, index) =>
            item.type === 'separator' ? (
              <Separator key={`sep-${index}`} role="separator" />
            ) : (
              <DropdownItem
                key={item.label}
                role="menuitem"
                onClick={() => {
                  item.action();
                  setOpen(false);
                }}
              >
                {item.label}
              </DropdownItem>
            ),
          )}

          {onSignOut && (
            <>
              {actions?.length ? <Separator role="separator" /> : null}
              <DropdownItem
                role="menuitem"
                onClick={() => {
                  onSignOut();
                  setOpen(false);
                }}
                data-testid="sign-out-button"
              >
                Sign Out
              </DropdownItem>
            </>
          )}
        </Dropdown>
      )}
    </Container>
  );
}
