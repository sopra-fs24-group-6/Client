import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/ui/NavBar.scss";
import logo from "../../assets/logo.jpeg";

function NavBar() {
  return (
    <nav className="nav">
      <NavLink to="/menu" className="nav-item">
        {/* <img src={logo} alt="Logo" className="logo-image" /> */}
        Word Wolf
      </NavLink>
      <ul>
        <li>
          <NavLink to="/" className="nav-item">
            Friends
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`/users/${localStorage.getItem("userId")}`}
            className="nav-item"
          >
            Profile
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
