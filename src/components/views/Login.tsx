import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = (props) => {
  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        type={props.type} // Use type prop to determine input type
        className="login input"
        placeholder="enter here.."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string, // Add PropTypes for type
};

const Login = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>(undefined);
  const [username, setUsername] = useState<string>(undefined);

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/users/login", { username, password });

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem("userId", user.id);

      // Login successfully worked --> navigate to the route /game in the GameRouter
      navigate("/users");
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

  return (
    <BaseContainer>
      <div className="login container">
        <div className="login form">
          <FormField
            label="Username"
            value={username}
            onChange={(un: string) => setUsername(un)}
            type="text" // Specify type as text for username
          />
          <FormField
            label="Password"
            value={password}
            onChange={(n) => setPassword(n)}
            type="password" // Specify type as password for password
          />
          <div className="login button-container">
            <Button
              disabled={!username || !password}
              width="100%"
              onClick={() => doLogin()}
            >
              Login
            </Button>
          </div>
          <span className="register-text">
            Do not have an account?{" "}
            <span className="register-cta" onClick={() => navigate("/register")}>
              Register a new account
            </span>
          </span>
        </div>
      </div>
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default Login;
