export type UserProfileAction =
  | { label: string; action: () => void; type?: never }
  | { label: string; type: 'separator'; action?: never };

export type UserStatus = 'online' | 'away' | 'busy' | 'offline';

export type UserInfo = {
  name: string;
  email?: string;
  avatar?: string;
  status?: UserStatus;
};

export type UserProfileProps = {
  user?: UserInfo | null;
  actions?: UserProfileAction[];
  onSignIn?: () => void;
  onSignOut?: () => void;
};
