import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { GameGuard } from "../routeProtectors/GameGuard";
import GameRouter from "./GameRouter";
import { LoginGuard } from "../routeProtectors/LoginGuard";
import Login from "../../views/Login";
import Profile from "../../views/Profile";
import Menu from "../../views/Menu";
import Registration from "../../views/Registration";
import Lobby from "../../views/Lobby";
import Browser from "../../views/Browser";
import LeaderBoard from "../../views/LeaderBoard";
import HowToPlay from "../../views/HowToPlay";
import GameDemo from "../../views/GameDemo";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reactrouter.com/en/main/start/tutorial
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/users/*" element={<GameGuard />}>
          <Route path="/users/*" element={<GameRouter base="/users" />} />
          <Route path=":userId" element={<Profile />} />
        </Route>

        <Route path="/login" element={<LoginGuard />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route path="/register" element={<Registration />} />
          
        <Route path="/menu" element={<Menu />} />

        <Route path="/howtoplay" element={<HowToPlay />} />
          
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/lobby/:lobbyId" element={<Lobby />} />

        <Route path="/browser" element={<Browser />} />

        <Route path="/leaderboard" element={<LeaderBoard />} />

        <Route path="/game/:lobbyId" element={<GameDemo />} />

        <Route path="/demo" element={<GameDemo />} />

        <Route path="/" element={
          <Login />
        }/>
      </Routes>
    </BrowserRouter>
  );
};

/*
 * Don't forget to export your component!
 */
export default AppRouter;
