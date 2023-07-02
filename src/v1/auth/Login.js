import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import Logo from "../../img/logo_black.png";
import { login } from "../../components/api/Auth";
import Loader from "../../img/spinner_loader.gif";
import { BaseUrl } from "../../components/settings/BaseUrl";
import axios from "axios";

function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsloading] = useState(false);

  const { loginState, dispatchLoginState } = useContext(AuthContext);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    navigate("/dashboard");
  }, []);

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      alert("email is required");
      return;
    }

    if (!formData.password) {
      alert("Password is required");
      return;
    }
    //TODO:connect login with input box and make it work for real
    setIsloading(true);
    // const response = await login(formData);
    axios({
      url: BaseUrl("/login"),
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log(response);
        setIsloading(false);

        const { user, token } = response.data;
        // Store the token in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        dispatchLoginState({
          type: "LOGIN",
          payload: {
            isLoggedIn: true,
            token: token,
            user: user,
          },
        });

        navigate("/dashboard");
      })
      .catch((err) => {
        setIsloading(false);
      });
  };

  return (
    <div className="login-page" style={{ marginTop: 50 }}>
      <div className="left-side"></div>
      <div className="right-side">
        <img src={Logo} width={150} />
        <div className="login-form">
          <form onSubmit={handleLogin}>
            <label className="form-label">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              name="email"
              onChange={handleOnchange}
            />
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              name="password"
              onChange={handleOnchange}
            />
            <button type="submit" className="primary-btn">
              {isLoading && <img src={Loader} width={30} />}
              {!isLoading && <p>Login</p>}
            </button>
          </form>
          <p className="register-text">
            Don't have an account? <Link to="/register">Register</Link>
          </p>

          {loginError && (
            <p
              className="error"
              style={{
                marginTop: 40,
                display: "flex",
                justifyContent: "center",
                height: 50,
                width: "100%",
                background: "#f9e1e1",
                alignItems: "center",
                border: "#fbbebe solid thin",
              }}
            >
              {loginError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
