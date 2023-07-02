import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";
import Logo from "../../img/logo_black.png";

const LoginPage = () => {
    const navigate = useNavigate();
const onLoginBtnClicked = (e) =>{
    e.preventDefault()
    navigate("/dashboard")
}
  return (
    <div className="login-page">
      <div className="left-side"></div>
      <div className="right-side">
      <img src={Logo} width={150} />
        <div className="login-form">
          {/* <div className="welcome-header">
            <h2>Welcome back</h2>
            <p className="subtext">Please sign in to continue</p>
          </div> */}
          <form>
            <label className="form-label">Email</label>
            <input type="email" placeholder="Email" />
            <label className="form-label">Password</label>
            <input type="password" placeholder="Password" />
            <button type="submit" onClick={onLoginBtnClicked}>Login</button>
          </form>
          <p className="register-text">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
     
      </div>
    </div>
  );
};

export default LoginPage;
