import React, { useContext, useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import Sidebar from "./components/layouts/Sidebar";
import Sales from "./v1/sales/Sales";
import NavBar from "./components/layouts/NavBar";
import Products from "./v1/products/Products";
import Customer from "./v1/customers/Customer";
import User from "./v1/users/User";
import Team from "./v1/teams/Team";
import Account from "./v1/account/Account";
import Dashboard from "./v1/reports/Dashboard";
import CallsMade from "./v1/maps/CallsMade";
import CreateTeam from "./v1/teams/CreateTeam";
import CreateUser from "./v1/users/CreateUser";
import CreateProduct from "./v1/products/CreateProduct";
import { AuthProvider } from "./context/authContext";
import Login from "./v1/auth/Login";
import Main from "./components/layouts/Main";
import { Offline, Online } from "react-detect-offline";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const token = localStorage.getItem("token");
  const loggedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!token) {
      setIsLoggedIn(false);
      return;
    }
    setIsLoggedIn(true);
  }, [token]);

  // console.log(loggedUser);
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* <Offline>You are offline!</Offline> */}
        <Main />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
