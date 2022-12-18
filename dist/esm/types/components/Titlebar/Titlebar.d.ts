export interface TitlebarProps {
    title?: string | null;
    logo?: string;
    onMinus?: () => void;
    onMinimizeMaximaze?: () => void;
    onClose?: () => void;
}
export default function Titlebar({ title, logo, onClose, onMinus, onMinimizeMaximaze }: TitlebarProps): JSX.Element;
