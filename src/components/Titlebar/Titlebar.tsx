import React from "react";

export interface TitlebarProps {
  label: string;
}

const Titlebar = ({ label }: TitlebarProps) => {
  return <button>{label}</button>;
};

export default Titlebar;