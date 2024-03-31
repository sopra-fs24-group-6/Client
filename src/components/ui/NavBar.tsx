import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/ui/NavBar.scss";

function NavBar() {
  return (
    <nav className="nav">
      <NavLink to="/menu" className="nav-item">
        Word Wolf
      </NavLink>
      <ul>
        <li>
          <NavLink to="/" className="nav-item">
            Friends
          </NavLink>
        </li>
        <li>
          <NavLink to="/" className="nav-item">
            Profile
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;