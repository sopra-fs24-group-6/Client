import React from "react";
import "../../styles/ui/RoleWordOverlay.scss";

interface RoleWordOverlayProps {
  isVisible: boolean;
  word: string;
  isWolf: boolean | null;
}

const RoleWordOverlay: React.FC<RoleWordOverlayProps> = ({ isVisible, word, isWolf }) => {
  if (!isVisible) return null;

  return (
    <div className="overlay">
      {isWolf ? "You are the Wolf! Be sneaky!" : `You are a Villager! Your word is: ${word}`}
    </div>
  );
};

export default RoleWordOverlay;