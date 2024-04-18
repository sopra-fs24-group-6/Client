import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { GameGuard } from "../routeProtectors/GameGuard";
import GameRouter from "./GameRouter";
import { LoginGuard } from "../routeProtectors/LoginGuard";
import Login from "../../views/Login";
import UserDetails from "../../views/UserDetails";
import Menu from "../../views/Menu";
import Registration from "../../views/Registration";
import Lobby from "../../views/Lobby";
import Browser from "../../views/Browser";

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
          <Route path=":userId" element={<UserDetails />} />
        </Route>

        <Route path="/login" element={<LoginGuard />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route path="/register" element={<Registration />} />
          
        <Route path="/menu" element={<Menu />} />
          
        <Route path="/lobby" element={<Lobby />} />

        <Route path="/browser" element={<Browser />} />

        <Route path="/" element={
          <Navigate to="/game" replace />
        }/>

        <Route path="/" element={<Navigate to="/users" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

/*
 * Don't forget to export your component!
 */
export default AppRouter;
