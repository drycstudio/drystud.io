import React from 'react';
import { FiMinus, FiSquare, FiX, FiCopy } from 'react-icons/fi';
import isElectronProject from 'is-electron';
import { ActionButton } from '../ActionButton';
import titlebarLogo from '../../assets/icon/logo/electron-pretty-titlebar-logo.svg';
import { globalStyles } from '../../styles/global';
import { ButtonContainer, actionButtonIconStyle } from '../ActionButton/styles';
import { Logo, LogoImage, Menu, Text, Title, TitlebarContainer } from './styles';

type ipcRendererType = Electron.IpcRenderer | null | undefined;

const ipcRenderer = (
	typeof window !== 'undefined' && window && 'ipcRenderer' in window ? window.ipcRenderer : null
) as ipcRendererType;

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
	title = 'Pretty Titlebar',
	logo,
	size = 'default',
	onClose,
	onMinus,
	onMinimizeMaximaze,
}: TitlebarProps) {
	globalStyles();

	const [isWindowMaximized, setIsWindowMaximized] = React.useState<boolean>(false);

	const LOGO = logo || titlebarLogo;

	const handleVerifyIfWindowIsMaximized = async () => {
		if (ipcRenderer) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const response_ = await ipcRenderer.invoke('windowsIsMaximized');
			setIsWindowMaximized(!!response_);
			return response_;
		}
	};

	React.useLayoutEffect(() => {
		if (ipcRenderer) {
			const updateSize = async () => {
				const body = document.querySelector('body') as HTMLBodyElement;
				body.style.width = window.innerWidth.toString();
				await handleVerifyIfWindowIsMaximized();
			};
			window.addEventListener('resize', updateSize);
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			updateSize();
			return () => window.removeEventListener('resize', updateSize);
		}
	}, []);

	const handleMinimizeApp = () => {
		if (ipcRenderer) ipcRenderer.send('minimizeWindow');
	};

	const handleMaximizeRestoreApp = React.useCallback(async () => {
		if (ipcRenderer) ipcRenderer.send('maximizeRestoreWindow');
		await handleVerifyIfWindowIsMaximized();
	}, []);

	const handleCloseApp = () => {
		if (ipcRenderer) ipcRenderer.send('closeWindow');
	};

	const handleMinus = React.useCallback(() => {
		onMinus ? onMinus() : handleMinimizeApp();
	}, [onMinus]);

	const handleMinimazeMaximaze = React.useCallback(async () => {
		onMinimizeMaximaze ? onMinimizeMaximaze() : await handleMaximizeRestoreApp();
	}, [handleMaximizeRestoreApp, onMinimizeMaximaze]);

	const handleClose = React.useCallback(() => {
		onClose ? onClose() : handleCloseApp();
	}, [onClose]);

	const titlebarComponents = React.useMemo(
		() => [
			<Menu key={0} />,

			<Title key={1}>
				<Text>{title}</Text>
			</Title>,

			<ButtonContainer key={2}>
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
					{isWindowMaximized ? (
						<FiCopy className={actionButtonIconStyle()} style={{ transform: 'scaleX(-1)' }} />
					) : (
						<FiSquare className={actionButtonIconStyle()} />
					)}
				</ActionButton>
				<ActionButton
					type='close'
					onClick={() => {
						handleClose();
					}}>
					<FiX className={actionButtonIconStyle()} />
				</ActionButton>
			</ButtonContainer>,
		],
		[handleClose, handleMinimazeMaximaze, handleMinus, isWindowMaximized, title]
	);

	React.useEffect(() => {
		if (!isElectron)
			console.warn(
				'!Titlebar Alert!: Please Add Electron Button Handler functions manually because this is not an ElectronJS Application!'
			);
		if (ipcRenderer)
			console.warn('!Titlebar Alert!: Please Add the preload configuration on your app preload.(js/ts) file.');
	}, []);

	return (
		<TitlebarContainer size={size}>
			<Logo>
				<LogoImage src={LOGO as unknown as string} alt='Electron Pretty Titlebar Logo' />
			</Logo>

			{titlebarComponents}
		</TitlebarContainer>
	);
}
