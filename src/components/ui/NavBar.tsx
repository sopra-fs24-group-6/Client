import React from "react";
import "../../styles/ui/NavBar.scss";

function NavBar() {
  return(
    <nav className="nav">
      <a>
        Word Wolf
      </a>
      <ul>
        <li className="active">
          Profile
        </li>
        <li className="active">
          Search
        </li>
      </ul>
    </nav>
  )
}
export default NavBar;