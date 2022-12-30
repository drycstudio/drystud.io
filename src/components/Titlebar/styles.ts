import { styled } from '@stitches/react';

export const TitlebarContainer = styled('div', {
	width: '100%',
	alignContent: 'space-between',
	alignItems: 'center',
	backgroundColor: 'rgb(27, 27, 47 , 1)',
	color: 'rgb(255, 255, 255 , 1)',
	display: 'flex',
	flexWrap: 'wrap',
	position: 'fixed',
	zIndex: 999999999,
	variants: {
		size: {
			default: {
				height: '38px',
			},
			small: {
				height: '32px',
			},
		},
	},
	defaultVariants: {
		size: 'default',
	},
});

export const Logo = styled('div', {
	alignContent: 'center',
	alignItems: 'center',
	display: 'flex',
	height: '100%',
	width: '38px',
});

export const LogoImage = styled('img', {
	flex: '1 1 0%',
	height: '38px',
	padding: '6px',
	width: '38px',
});

export const Menu = styled('div', {
	width: '58px',
});

export const Title = styled('div', {
	appRegion: 'drag',
	flexGrow: 1,
	textAlign: 'center',
	userSelect: 'none',
});

export const Text = styled('h6', {
	margin: 0,
	padding: 0,
});
