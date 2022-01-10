/// <reference types="react" />
export interface TitlebarProps {
    title: string | undefined | null;
    logo?: string;
    onMinus?: () => void;
    onMinimazeMaximaze?: () => void;
    onClose?: () => void;
}
export default function Titlebar({ title, logo, onClose, onMinus, onMinimazeMaximaze }: TitlebarProps): JSX.Element;
