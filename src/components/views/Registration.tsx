import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import NesContainer from "../ui/NESContainer";
import NESContainerW from "../ui/NESContainerW";
import CustomButton from "../ui/CustomButton";

const Registration = () => {
  const navigate = useNavigate();
  const [isSecure, setIsSecure] = useState(true);
  const [name, setName] = useState(null);
  const [password, setPassword] = useState(null);
  const [username, setUsername] = useState(null);

  const doRegistration = async () => {
    try {
      await api.post("/users/register", {
        username,
        password,
        name,
      });

      // Perform automatic login after registration
      const loginResponse = await api.post("/users/login", {
        username,
        password,
      });

      const loggedInUser = new User(loginResponse.data);
      localStorage.setItem("userId", loggedInUser.id); // Update user id in local storage

      // Navigate to the desired route
      navigate("/users");
    } catch (error) {
      alert(
        `Something went wrong during the registration: \n${handleError(error)}`
      );
    }
  };

  return (
    <NESContainerW title="">
      <div className="login container">
        <label>Username:</label>
        <input
          className="username-field"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Name:</label>
        <input
          className="name-field"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>Password:</label>
        <input
          className="username-field"
          type={isSecure ? "password" : "text"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <CustomButton
          text={isSecure ? "Show" : "Hide"}
          className={
            isSecure ? "small 50 hover-green" : "small 50 hover-orange"
          }
          onClick={() => setIsSecure((prev) => !prev)}
        />
        <div className="login button-container">
          <CustomButton
            text="Register"
            disabled={!username || !name || !password}
            className="50 hover-green"
            onClick={() => doRegistration()}
          ></CustomButton>
        </div>
      </div>
    </NESContainerW>
  );
};

export default Registration;
