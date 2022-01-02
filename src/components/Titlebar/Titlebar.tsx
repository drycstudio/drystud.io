import React from "react";

export interface TitlebarProps {
    title: string | undefined | null;
    onMinus?: () => void;
    onMinimazeMaximaze?: () => void;
    onClose?: () => void;
}

export default function Titlebar({
    title,
    onClose,
    onMinus,
    onMinimazeMaximaze
}: TitlebarProps) {

    const handleMinus = () => !onClose ? onMinus : alert('Please Add Electron Minus Button Handler');

    const handleMinimazeMaximaze = () => !onClose ? onMinimazeMaximaze : alert('Please Add Electron Minimaze/Maximaze Button Handler');

    const handleClose = () => !onClose ? onClose : alert('Please Add Electron Close Button Handler');

    return (
        <div>
            <button>{title}</button>
            <button onClick={handleMinus}>Minus</button>
            <button onClick={handleMinimazeMaximaze}>Minimize/Maximaze</button>
            <button onClick={handleClose}>Close</button>
        </div>
    );
};