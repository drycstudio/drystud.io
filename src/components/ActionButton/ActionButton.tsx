import React from 'react';

import CSS from '../../assets/css/titlebar.module.css';

type ActionButtonProps = {
	children: React.ReactNode;
	onClick: () => void;
};

export function ActionButton({ children, onClick }: ActionButtonProps) {
	return (
		<button type='button' className={`${CSS.actionButtons__button} ${CSS.actionButtons__minus}`} onClick={onClick}>
			{children}
		</button>
	);
}
