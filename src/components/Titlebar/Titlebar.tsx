import React from 'react';
import { FiMinus, FiSquare, FiX, FiMinimize, FiMaximize } from 'react-icons/fi';

import { ConfigProvider, message } from 'antd';
import { ActionButton } from '../ActionButton';
import titlebarLogo from '../../assets/icon/logo/electron-pretty-titlebar-logo.svg';
import CSS from '../../assets/css/titlebar.module.css';

const ALERT_DURATION = 5; // 5 seconds

export interface TitlebarProps {
	title?: string | null;
	logo?: string;
	onMinus?: () => void;
	onMinimizeMaximaze?: () => void;
	onClose?: () => void;
}

export default function Titlebar({ title, logo, onClose, onMinus, onMinimizeMaximaze }: TitlebarProps) {
	const [messageApi, contextHolder] = message.useMessage();

	const LOGO = logo || titlebarLogo;

	async function handleMinus() {
		onMinus ? onMinus() : await messageApi.error('Please Add Electron Minus Button Handler', ALERT_DURATION);
	}

	async function handleMinimazeMaximaze() {
		onMinimizeMaximaze
			? onMinimizeMaximaze()
			: await messageApi.error('Please Add Electron Minimaze/Maximaze Button Handler', ALERT_DURATION);
	}

	async function handleClose() {
		onClose ? onClose() : await messageApi.error('Please Add Electron Close Button Handler', ALERT_DURATION);
	}

	return (
		<div className={CSS.epTitlebar}>
			<ConfigProvider>
				{contextHolder}
				<div className={CSS.epTitlebar__logo}>
					<img className={CSS.logo__image} src={LOGO as unknown as string} alt='Electron Pretty Titlebar Logo' />
				</div>
				<div className={CSS.epTitlebar__menu} />
				<div className={CSS.epTitlebar__title}>
					<h6 className={CSS.title__text} style={{ margin: 0 }}>
						{title}
					</h6>
				</div>
				<div className={CSS.epTitlebar__actionButtons}>
					<ActionButton
						onClick={() => {
							handleMinus();
						}}>
						<FiMinus className={CSS.actionButtons__icon} />
					</ActionButton>
					<ActionButton
						onClick={() => {
							handleMinimazeMaximaze();
						}}>
						<FiSquare className={CSS.actionButtons__icon} />
					</ActionButton>
					<ActionButton
						onClick={() => {
							handleClose();
						}}>
						<FiX className={CSS.actionButtons__icon} />
					</ActionButton>
				</div>
			</ConfigProvider>
		</div>
	);
}
