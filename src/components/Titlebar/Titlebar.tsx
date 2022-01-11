import React, { FC } from "react";
import { FiMinus, FiSquare, FiX, FiMinimize, FiMaximize } from "react-icons/fi";

import titlebarLogo from "../../assets/icon/logo/electron-pretty-titlebar-logo.svg";
import CSS from './titlebar.module.css';

export interface TitlebarProps {
    title: string | undefined | null;
    logo?: string;
    onMinus?: () => void;
    onMinimazeMaximaze?: () => void;
    onClose?: () => void;
}

export default function Titlebar({
    title,
    logo,
    onClose,
    onMinus,
    onMinimazeMaximaze
}: TitlebarProps) {

    console.log(onClose, onMinus, ' => Log do Pepino!')

    const handleMinus = () => (!!onMinus) ? onMinus() : alert('Please Add Electron Minus Button Handler');

    const handleMinimazeMaximaze = () => (!!onMinimazeMaximaze) ? onMinimazeMaximaze() : alert('Please Add Electron Minimaze/Maximaze Button Handler');

    const handleClose = () => (!!onClose) ? onClose() : alert('Please Add Electron Close Button Handler');

    return (
        <div className={CSS.epTitlebar}>
            <div className={CSS.epTitlebar__logo}>
                <img className={CSS.logo__image} src={(!!logo) ? logo : titlebarLogo} alt="Electron Pretty Titlebar Logo" />
            </div>
            <div className={CSS.epTitlebar__menu}>
            </div>
            <div className={CSS.epTitlebar__title}>
                <h6 className={CSS.title__text} style={{ margin: 0 }}>{title}</h6>
            </div>
            <div className={CSS.epTitlebar__actionButtons}>
                <button className={`${CSS.actionButtons__button} ${CSS.actionButtons__minus}`} onClick={handleMinus}>
                    <FiMinus className={CSS.actionButtons__icon} />
                </button>
                <button className={`${CSS.actionButtons__button} ${CSS.actionButtons__minimazeMaximaze}`} onClick={handleMinimazeMaximaze}>
                    <FiSquare className={CSS.actionButtons__icon} />
                </button>
                <button className={`${CSS.actionButtons__button} ${CSS.actionButtons__close}`} onClick={handleClose}>
                    <FiX className={CSS.actionButtons__icon} />
                </button>
            </div>
        </div>
    );
};