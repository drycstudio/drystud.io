/// <reference types="react" />
interface TitlebarProps {
    title: string | undefined | null;
    logo?: string;
    onMinus?: () => void;
    onMinimazeMaximaze?: () => void;
    onClose?: () => void;
}
declare function Titlebar({ title, logo, onClose, onMinus, onMinimazeMaximaze }: TitlebarProps): JSX.Element;

export { Titlebar };
