import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import "styles/views/Login.scss";
import NesContainer from "../ui/NESContainer";
import NESContainerW from "../ui/NESContainerW";
import CustomButton from "../ui/CustomButton";
import languages from 'helpers/languages.json';
import "../../styles/ui/AppBody.scss";

const Registration = () => {
  const navigate = useNavigate();
  const [isSecure, setIsSecure] = useState(true);
  const [name, setName] = useState(null);
  const [password, setPassword] = useState(null);
  const [username, setUsername] = useState(null);
  const [language, setLanguage] = useState('en');

  const doRegistration = async () => {
    try {
      await api.post("/users", {
        username,
        password,
        language,
      });

      // Perform automatic login after registration
      const loginResponse = await api.post("/login", {
        username,
        password,
        language,
      });

      const loggedInUser = new User(loginResponse.data);
      localStorage.setItem("userId", loggedInUser.id); // Update user id in local storage

      // Navigate to the desired route
      navigate("/menu");
    } catch (error) {
      alert(
        `Something went wrong during the registration: \n${handleError(error)}`
      );
    }
  };

  return (
    <>
      <div className="Center">
        <NesContainer title="Word Wolf">
          <h1 className="press-start-font">Register Here</h1>
        </NesContainer>
      </div>
      <div className="Extension">
        <NESContainerW title="Welcome" className="center">
          <div className="field-aligner">
            <label className="log-label">Username:</label>
            <input
              className="log-field"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="field-aligner">
            <label className="log-label">Password:</label>
            <input
              className="log-field"
              type={isSecure ? "password" : "text"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <CustomButton
              text={isSecure ? "Show" : "Hide"}
              className={
                isSecure ? "small 50 hover-green" : "small 50 hover-orange"
              }
              onClick={() => setIsSecure(!isSecure)}
            />
          </div>
          <div className="field-aligner">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}>
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          <CustomButton
            text="Register"
            disabled={!username || !password}
            className="w55 hover-green"
            onClick={() => doRegistration()}
          />
        </NESContainerW>
      </div>
    </>
  );
};

export default Registration;


{/* <NESContainerW title="">
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
</NESContainerW> */}
