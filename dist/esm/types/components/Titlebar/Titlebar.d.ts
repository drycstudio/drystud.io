/// <reference types="react" />
import './Titlebar.css';
export interface TitlebarProps {
    title: string | undefined | null;
    logo?: string;
    onMinus?: () => void;
    onMinimazeMaximaze?: () => void;
    onClose?: () => void;
}
export default function Titlebar({ title, onClose, onMinus, onMinimazeMaximaze }: TitlebarProps): JSX.Element;
