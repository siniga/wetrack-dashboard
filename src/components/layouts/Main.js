import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Login from "../../v1/auth/Login";
import Sales from "../../v1/sales/Sales";
import Dashboard from "../../v1/reports/Dashboard";
import CallsMade from "../../v1/maps/CallsMade";
import Products from "../../v1/products/Products";
import Customer from "../../v1/customers/Customer";
import User from "../../v1/users/User";
import Team from "../../v1/teams/Team";
import Account from "../../v1/account/Account";
import CreateUser from "../../v1/users/CreateUser";
import CreateTeam from "../../v1/teams/CreateTeam";
import CreateProduct from "../../v1/products/CreateProduct";
import NavBar from "./NavBar";
import Sidebar from "./Sidebar";
import Agents from "../../v1/agents/Agents";

function Main({ children }) {
  const { loginState, dispatchLoginState } = useContext(AuthContext);

  const token = localStorage.getItem("token");
  const loggedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    //if user is logged in change login state to true
    if (token && loggedUser) {
      dispatchLoginState({
        type: "LOGIN",
        payload: {
          isLoggedIn: true,
          token: token,
          user: loggedUser,
        },
      });
    } else {
      dispatchLoginState({
        type: "LOGIN",
        payload: {
          token: token,
          user: loggedUser,
          isLoggedIn: false,
        },
      });
    }
  }, []);

  return (
    <div className="App">
      {loginState?.isLoggedIn && (
        <div style={{ flex: 1 }}>
          <Sidebar />
        </div>
      )}
      <div className="main-container">
        {loginState?.isLoggedIn && <NavBar />}
        <div style={{ padding: "10px 60px 0px 60px" }}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/calls" element={<CallsMade />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customers" element={<Customer />} />
            <Route path="/users" element={<User />} />
            <Route path="/teams" element={<Team />} />
            <Route path="/account" element={<Account />} />

            {/* create items */}
            <Route path="/create/user" element={<CreateUser />} />
            <Route path="/create/team" element={<CreateTeam />} />
            <Route path="/create/product" element={<CreateProduct />} />
          </Routes>
        </div>
      </div>
    </div>
  );
  // return <div className="App">{children}</div>;
}

export default Main;
