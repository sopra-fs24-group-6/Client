import React, { ReactNode } from "react";
import "../../styles/ui/ContainerW.scss";

interface NESContainerProps {
  title: string;
  children?: ReactNode;
  className?: string;
  scrollable?: boolean;
}

const NESContainerW: React.FC<NESContainerProps> = ({
  title,
  children,
  className,
  scrollable = false,
}) => {
  const containerClassName = `nes-container custom-style with-title ${className || ""} ${scrollable ? "scrollable" : ""}`;

  return (
    <div className={containerClassName}>
      {title && <p className="title">{title}</p>}
      {children}
    </div>
  );
};

export default NESContainerW;