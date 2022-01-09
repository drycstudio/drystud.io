import React from "react";
import { FiMinus, FiSquare, FiX } from "react-icons/fi";

import './Titlebar.css';

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
        <div className="epTitlebar">
            <div className="epTitlebar__logo"></div>
            <div className="epTitlebar__title">
                <h6 className="title__text">{title}</h6>
            </div>
            <div className="epTitlebar__actionButtons">
                <button className="actionButtons__button actionButtons__minus"onClick={handleMinus}><FiMinus /></button>
                <button className="actionButtons__button actionButtons__minimazeMaximaze"onClick={handleMinimazeMaximaze}><FiSquare /></button>
                <button className="actionButtons__button actionButtons__close"onClick={handleClose}><FiX /></button>
            </div>
        </div>
    );
};