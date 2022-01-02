/// <reference types="react" />
export interface TitlebarProps {
    title: string | undefined | null;
    onMinus?: () => void;
    onMinimazeMaximaze?: () => void;
    onClose?: () => void;
}
export default function Titlebar({ title, onClose, onMinus, onMinimazeMaximaze }: TitlebarProps): JSX.Element;
