import React from 'react';

import { Button } from './styles';

type ActionButtonProps = {
  children: React.ReactNode;
  type?: 'default' | 'close';
  'aria-label'?: string;
  onClick: () => void;
};

export function ActionButton({ children, type, onClick, 'aria-label': ariaLabel }: ActionButtonProps) {
  return (
    <Button onClick={onClick} type={type} aria-label={ariaLabel}>
      {children}
    </Button>
  );
}
