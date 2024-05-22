import React from "react";
import "../../styles/ui/ContainerB.scss";

interface NESContainerProps {
  title: string;
  children: React.ReactNode;
}

const NESContainer: React.FC<NESContainerProps> = ({ title, children }) => {
  return (
    <div className="nes-container custom-styleB is-dark with-title"> 
      {title && <p className="title">{title}</p>}
      {children}
    </div>
  );
};

export default NESContainer;