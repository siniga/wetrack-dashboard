import React, { Children } from "react";
// import "./Main.css";
import { useNavigate } from "react-router-dom";

const Main = ({children}) => {
    const navigate = useNavigate();

    const onDashboardLink = (e) =>{
        e.preventDefault();

        navigate("/sales")
    }
  return (
    <div className="content">
            {children}
        </div>
  );
};

export default Main;
