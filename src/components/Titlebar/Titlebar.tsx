import React from "react";
import { FiMinus, FiSquare, FiX, FiMinimize, FiMaximize } from "react-icons/fi";

import titlebarLogo from "../../assets/icon/logo/electron-pretty-titlebar-logo.svg";
import './Titlebar.css';

export interface TitlebarProps {
    title: string | undefined | null;
    logo: string;
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

    console.log(onClose, onMinus, ' => Log do Pepino!')

    const handleMinus = () => (!!onMinus) ? onMinus : alert('Please Add Electron Minus Button Handler');

    const handleMinimazeMaximaze = () => (!!onMinimazeMaximaze) ? onMinimazeMaximaze : alert('Please Add Electron Minimaze/Maximaze Button Handler');

    const handleClose = () => (!!onClose) ? onClose : alert('Please Add Electron Close Button Handler');

    return (
        <div className="epTitlebar">
            <div className="epTitlebar__logo">
                <img className="flex-1 p-[6px] h-[38px] w-[38px]" src={titlebarLogo} alt="Electron Pretty Titlebar Logo" />
            </div>
            <div className="epTitlebar__menu">
            </div>
            <div className="epTitlebar__title">
                <h6 className="title__text">{title}</h6>
            </div>
            <div className="epTitlebar__actionButtons">
                <button className="actionButtons__button actionButtons__minus" onClick={handleMinus}>
                    <FiMinus className="actionButtons__icon flex-1 w-5 h-5" />
                </button>
                <button className="actionButtons__button actionButtons__minimazeMaximaze" onClick={handleMinimazeMaximaze}>
                    <FiSquare className="actionButtons__icon flex-1 w-5 h-5" />
                </button>
                <button className="actionButtons__button actionButtons__close" onClick={handleClose}>
                    <FiX className="actionButtons__icon flex-1 w-5 h-5" />
                </button>
            </div>
        </div>
    );
};