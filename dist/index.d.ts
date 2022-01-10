/// <reference types="react" />
interface TitlebarProps {
    title: string | undefined | null;
    logo?: string;
    onMinus?: () => void;
    onMinimazeMaximaze?: () => void;
    onClose?: () => void;
}
declare function Titlebar({ title, onClose, onMinus, onMinimazeMaximaze }: TitlebarProps): JSX.Element;

export { Titlebar };
