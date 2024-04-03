import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import NesContainer from "../ui/NESContainer";
import NESContainerW from "../ui/NESContainerW";
import CustomButton from "../ui/CustomButton";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const Login = () => {
  const navigate = useNavigate();

  const [isSecure, setIsSecure] = useState(true);
  const [password, setPassword] = useState<string>(null);
  const [username, setUsername] = useState<string>(null);

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const loginResponse = await api.post("/users/login", {
        username,
        password,
      });

      // Get the returned user and update a new object.
      const loggedInUser = new User(loginResponse.data);

      // Store the token into the local storage.
      localStorage.setItem("userId", loggedInUser.id);

      // Login successfully worked --> navigate to the route /game in the GameRouter
      navigate("/menu");
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
      navigate("/login");
    }
  };

  return (
    <NesContainer title="">
      <div className="login container">
        <label>Username:</label>
        <input
          className="username-field"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Password:</label>
        <input
          className="password-field"
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
            text="Login"
            disabled={!username || !password}
            className="50 hover-green"
            onClick={() => doLogin()}
          ></CustomButton>
        </div>
        <span className="register-text">
          Don't have an account yet?{" "}
          <span className="register-cta" onClick={() => navigate("/register")}>
            Register a new account
          </span>
        </span>
      </div>
    </NesContainer>
  );
};

/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default Login;
