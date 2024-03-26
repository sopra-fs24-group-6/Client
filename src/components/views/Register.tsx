import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Register.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

const FormFieldReg = (props) => {
  return (
    <div className="register field">
      <label className="register label">{props.label}</label>
      <input
        type={props.type}
        className="register input"
        placeholder="enter here.."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormFieldReg.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const Register = () => {
  const navigate = useNavigate();

  const [isSecure, setIsSecure] = useState(true);
  const [password, setPassword] = useState<string>(null);
  const [username, setUsername] = useState<string>(null);

  const navigateBack = () => {
    navigate("/login");
  };

  const doRegistration = async () => {
    try {
      // Make sure the requestBody matches the backend's expected DTO structure
      const requestBody = JSON.stringify({
        username,
        password,
      });
      // Assuming `api` is set up to point to your backend, adjust the endpoint to `/users`
      const response = await api.post("/users", requestBody);
      const user = new User(response.data);

      localStorage.setItem("token", user.token);
      localStorage.setItem("id", user.id);
      navigate("/game");
    } catch (error) {
      alert(
        `Something went wrong during the registration: \n${handleError(error)}`
      );
    }
  };

  return (
    <BaseContainer>
      <div className="register container">
        <div className="register form">
          <FormFieldReg
            label="username"
            value={username}
            onChange={(un: string) => setUsername(un)}
          />
          <div>
            <FormFieldReg
              type={isSecure ? "password" : "text"}
              label="Password"
              value={password}
              onChange={setPassword}
            />

            <Button onClick={() => setIsSecure((prev) => !prev)}>
              {isSecure ? "Show" : "Hide"}
            </Button>
          </div>

          <div className="submit button container">
            <Button
              disabled={!username || !password}
              width="50%"
              onClick={doRegistration}
            >
              Submit Registration
            </Button>
            <Button width="50%" onClick={navigateBack}>
              Log in
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default Register;
