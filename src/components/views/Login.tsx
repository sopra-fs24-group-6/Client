import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import "styles/views/Login.scss";
import NesContainer from "../ui/NESContainer";
import NESContainerW from "../ui/NESContainerW";
import CustomButton from "../ui/CustomButton";
import "../../styles/ui/AppBody.scss";


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
    <>
      <div className="Center">
        <NesContainer title="Word Wolf">
          <h1 className="press-start-font">Log In</h1>
        </NesContainer>
      </div>
      <div className="Extension">
        <NESContainerW title="Welcome back" className="center">
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
          <CustomButton
            text="Login"
            disabled={!username || !password}
            className="w55 hover-green"
            onClick={() => doLogin()}>
          </CustomButton>
          <div className="Space">
            <div className="register-text2">
              Don&apos;t have an account yet?
              <span className="register-cta2" onClick={() => navigate("/register")}>
                Register here
              </span>
            </div>
          </div>
        </NESContainerW>
      </div>
    </>

  );
};

/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default Login;


// <NESContainerW title="">
//   <div className="login container">
//     <label>Username:</label>
//     <input
//       className="username-field"
//       type="text"
//       value={username}
//       onChange={(e) => setUsername(e.target.value)}
//     />
//     <label>Password:</label>
//     <input
//       className="password-field"
//       type={isSecure ? "password" : "text"}
//       value={password}
//       onChange={(e) => setPassword(e.target.value)}
//     />
//     <CustomButton
//       text={isSecure ? "Show" : "Hide"}
//       className={
//         isSecure ? "small 50 hover-green" : "small 50 hover-orange"
//       }
//       onClick={() => setIsSecure((prev) => !prev)}
//     />

//     <div className="login button-container">
//       <CustomButton
//         text="Login"
//         disabled={!username || !password}
//         className="50 hover-green"
//         onClick={() => doLogin()}
//       ></CustomButton>
//     </div>
//     <span className="register-text">
//       `Don&apos;t have an account yet?`
//       <span className="register-cta" onClick={() => navigate("/register")}>
//         Register a new account
//       </span>
//     </span>
//   </div>
// </NESContainerW>