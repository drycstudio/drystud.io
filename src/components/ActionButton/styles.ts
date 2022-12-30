import { css } from '@stitches/core';
import { styled } from '@stitches/react';

export const actionButtonIconStyle = css({
	flex: '1 1 0%',
	height: '100%',
	width: '100%',
	padding: '8px',
});

export const Button = styled('button', {
	alignContent: 'center',
	alignItems: 'center',
	display: 'flex',
	height: '100%',
	margin: 0,
	overflow: 'hidden',
	textAlign: 'center',
	width: '48px',

	[`& .${actionButtonIconStyle}`]: {
		transitionDuration: '0.2s',
		transitionProperty: 'all',
		transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',

		'&:hover': {
			scale: 1.25,
			transitionDuration: '0.3s',
		},
		'&:active': {
			scale: 0.95,
		},
	},
});
