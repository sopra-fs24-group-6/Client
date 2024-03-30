import React, { ReactNode } from "react";

interface NESContainerProps {
  title: string;
  children?: ReactNode;
}

const NESContainer: React.FC<NESContainerProps> = ({ title, children }) => {
  return (
    <div className="nes-container is-dark with-title">
      {title && <p className="title">{title}</p>}
      {children}
    </div>
  );
};

export default NESContainer;