import React from 'react';

import { Button } from './styles';

type ActionButtonProps = {
  children: React.ReactNode;
  type?: 'default' | 'close';
  onClick: () => void;
};

export function ActionButton({ children, type, onClick }: ActionButtonProps) {
  return (
    <Button onClick={onClick} type={type}>
      {children}
    </Button>
  );
}
