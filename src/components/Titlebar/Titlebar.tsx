import React, { useEffect } from 'react';
import { FiMinus, FiSquare, FiX, FiMinimize, FiMaximize } from 'react-icons/fi';

import message from 'antd/lib/message';
import isElectronProject from 'is-electron';
import { ActionButton } from '../ActionButton';
import titlebarLogo from '../../assets/icon/logo/electron-pretty-titlebar-logo.svg';
import CSS from '../../assets/css/titlebar.module.css';
import { globalStyles } from '../../styles/global';
import { ButtonContainer, actionButtonIconStyle } from '../ActionButton/styles';
import { Logo, LogoImage, Menu, Text, Title, TitlebarContainer } from './styles';

const isElectron = isElectronProject();

export interface TitlebarProps {
	title?: string | null;
	logo?: string;
	size?: 'default' | 'small';
	onMinus?: () => void;
	onMinimizeMaximaze?: () => void;
	onClose?: () => void;
}

export default function Titlebar({
	title,
	logo,
	size = 'default',
	onClose,
	onMinus,
	onMinimizeMaximaze,
}: TitlebarProps) {
	globalStyles();

	const [messageApi, contextHolder] = message.useMessage({
		top: 40,
	});

	const LOGO = logo || titlebarLogo;

	async function handleMinus() {
		onMinus ? onMinus() : await messageApi.error('Please Add Electron Minus Button Handler');
	}

	async function handleMinimazeMaximaze() {
		onMinimizeMaximaze
			? onMinimizeMaximaze()
			: await messageApi.error('Please Add Electron Minimaze/Maximaze Button Handler');
	}

	async function handleClose() {
		onClose ? onClose() : await messageApi.error('Please Add Electron Close Button Handler');
	}

	useEffect(() => {
		if (!isElectron) {
			console.warn(
				'Please Add Electron Button Handler functions manually because this is not an ElectronJS Application!'
			);
		}
	}, []);

	return (
		<TitlebarContainer size={size}>
			{contextHolder}
			<Logo>
				<LogoImage src={LOGO as unknown as string} alt='Electron Pretty Titlebar Logo' />
			</Logo>

			<Menu />

			<Title>
				<Text>{title}</Text>
			</Title>

			<ButtonContainer>
				<ActionButton
					onClick={() => {
						handleMinus();
					}}>
					<FiMinus className={actionButtonIconStyle()} />
				</ActionButton>
				<ActionButton
					onClick={() => {
						handleMinimazeMaximaze();
					}}>
					<FiSquare className={actionButtonIconStyle()} />
				</ActionButton>
				<ActionButton
					type='close'
					onClick={() => {
						handleClose();
					}}>
					<FiX className={actionButtonIconStyle()} />
				</ActionButton>
			</ButtonContainer>
		</TitlebarContainer>
	);
}
