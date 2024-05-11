// import React, { useState, useEffect } from "react";
// import icon1 from "../../assets/icons/Sheep.png";
// import icon2 from "../../assets/icons/Sheep1.png";
// import icon3 from "../../assets/icons/Sheep2.png";
// import icon4 from "../../assets/icons/Sheep3.png";
// import icon5 from "../../assets/icons/Sheep4.png";
// import icon6 from "../../assets/icons/Sheep5.png";
// import "../../styles/ui/PlayerIcon.scss";

// const icons = [icon1, icon2, icon3, icon4, icon4, icon5, icon6];

// interface Player {
//   username: string;
//   // any other properties like id, etc.
// }

// interface PlayerIconsProps {
//   players: Player[];
// }

// const PlayerIcons: React.FC<PlayerIconsProps> = ({ players }) => {

//   const [playersWithIcons, setPlayersWithIcons] = useState<(Player & { icon: string })[]>([]);

//   useEffect(() => {
//     const newPlayersWithIcons = players.map(player => ({
//       ...player,
//       icon: icons[Math.floor(Math.random() * icons.length)]
//     }));
//     setPlayersWithIcons(newPlayersWithIcons);
//   }, [players]);

//   return (
//     <div>
//       {playersWithIcons.map((player, index) => (
//         <div key={index}>
//           <img src={player.icon} alt="Player icon" className="player-icon" />
//           <p>{player.username}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default PlayerIcons;

import React, { useState, useEffect } from "react";
import icon1 from "../../assets/icons/Sheep.png";
import icon2 from "../../assets/icons/Sheep1.png";
import icon3 from "../../assets/icons/Sheep2.png";
import icon4 from "../../assets/icons/Sheep3.png";
import icon5 from "../../assets/icons/Sheep4.png";
import icon6 from "../../assets/icons/Sheep5.png";
import "../../styles/ui/PlayerIcon.scss";

const icons = [icon1, icon2, icon3, icon4, icon4, icon5, icon6];

interface Player {
  username: string;
}

interface PlayerIconsProps {
  players: Player[];
}

const PlayerIcons: React.FC<PlayerIconsProps> = ({ players }) => {
  const [playersWithIcons, setPlayersWithIcons] = useState<(Player & { icon: string, style: React.CSSProperties })[]>([]);

  useEffect(() => {
    const newPlayersWithIcons = players.map(player => ({
      ...player,
      icon: icons[Math.floor(Math.random() * icons.length)],
      style: {
        left: `${Math.floor(Math.random() * 90)}%`,
        top: `${Math.floor(Math.random() * 90)}%`,
      }
    }));
    setPlayersWithIcons(newPlayersWithIcons);
  }, [players]);

  return (
    <div>
      {playersWithIcons.map((player, index) => (
        <div key={index} style={player.style}>
          <img src={player.icon} alt="Player icon" className="player-icon" />
          <p>{player.username}</p>
        </div>
      ))}
    </div>
  );
};

export default PlayerIcons;