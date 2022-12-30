import React from 'react';

import { Button } from './styles';

type ActionButtonProps = {
	children: React.ReactNode;
	onClick: () => void;
};

export function ActionButton({ children, onClick }: ActionButtonProps) {
	return <Button onClick={onClick}>{children}</Button>;
}
