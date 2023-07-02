import React, { useContext, useEffect, useState } from "react";
import "./Navbar.css";
import Dropdown from "../common/Dropdown";
import { useNavigate } from "react-router-dom";
import Loader from "../../img/spinner_loader.gif";
import { AuthContext } from "../../context/authContext";

function NavBar({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [isLoginOut, setIsLoggingOut] = useState(false);
  const {loginState, dispatchLoginState} = useContext(AuthContext)

  const handleItemClick = () => {
    localStorage.clear();

    setIsLoggingOut(true);
    setTimeout(function () {
      navigate("/");
      setIsLoggingOut(false);
      //setIsLoggedIn(false);

      dispatchLoginState({
        type: "LOGIN",
        payload: {
          token: "",
          user: null,
          isLoggedIn: false,
        },
      });
    }, 3000);
    
  };
  
  return (
    <div>
      <div className="main-nav-header">
        <div
          style={{
            borderRadius: 8,
            background: "#f2f2f2",
            padding: "0 15px 0 15px",
            marginLeft:30,
            fontWeight:"bold"
          }}
        >
          {loginState.user.business_name}
        </div>
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          {isLoginOut && <img src={Loader} style={{ width: 40, height: 40 }} />}
          <p className="user-initial" style={{ paddingTop: 1 }}>
            {loginState?.user.name.substr(0, 1)}
          </p>
          <Dropdown
            link={loginState?.user.name}
            list={[{ name: "Account" }, { name: "Logout" }]}
            handleItemClick={handleItemClick}
          />
        </div>
      </div>
    </div>
  );
}

export default NavBar;
