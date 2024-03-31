import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

const FormField = (props) => {
  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        type={props.type}
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
  type: PropTypes.string,
};

const Registration = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const doRegistration = async () => {
    try {
      await api.post("/users", {
        username,
        password,
        name,
      });

      // Perform automatic login after registration
      const loginResponse = await api.post("/login", {
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
    <BaseContainer>
      <div className="login container">
        <div className="login form">
          <FormField
            label="Name"
            value={name}
            onChange={(un) => setName(un)}
            type="text"
          />
          <FormField
            label="Username"
            value={username}
            onChange={(un) => setUsername(un)}
            type="text"
          />
          <FormField
            label="Password"
            value={password}
            onChange={(n) => setPassword(n)}
            type="password"
          />
          <div className="login button-container">
            <Button
              disabled={!username || !password}
              width="100%"
              onClick={() => doRegistration()}
            >
              Register
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default Registration;
