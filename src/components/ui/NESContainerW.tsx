import React, { ReactNode } from "react";
import "../../styles/ui/ContainerW.scss";

interface NESContainerProps {
  title: string;
  children?: ReactNode; // children is now optional
  className?: string; // className is also optional
}

const NESContainerW: React.FC<NESContainerProps> = ({
  title,
  children,
  className,
}) => {
  const containerClassName = `nes-container custom-style with-title ${className || ""
    }`.trim();
  return (
    <div className={containerClassName}>
      {title && <p className="title">{title}</p>}
      {children}
    </div>
  );
};

export default NESContainerW;
