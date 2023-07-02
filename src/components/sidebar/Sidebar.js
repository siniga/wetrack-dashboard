import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
import Logo from "../../img/we_logo.png";
// import Avatar from "../../img/avatar.jpg";
import {
  FaThLarge,
  FaChartPie,
  FaHome,
  FaFileInvoiceDollar,
  FaStore,
  FaShoppingBag,
  FaUsers,
  FaUserCog,
  FaUserAlt,
  FaPowerOff,
  FaUserTie,
  FaChartArea,
} from "react-icons/fa";


const links = [
  { link: "dashboard", icon: <FaThLarge />, name: "Dashboard" },
  { link: "sales", icon: <FaChartPie />, name: "Sales" },
  { link: "agents", icon: <FaChartArea />, name: "Stats" },
  { link: "products", icon: <FaShoppingBag />, name: "Products" },
  { link: "customers", icon: <FaStore />, name: "Customers" },
  { link: "users", icon: <FaUserTie />, name: "Agents" },
  { link: "teams", icon: <FaUsers />, name: "Teams" },
  { link: "account", icon: <FaUserCog />, name: "Account" },
];

function Sidebar(props) {
  const { sidebar, activeLink, setActiveLink } = props;
  const navigate = useNavigate();


  useEffect(()=>{
    const lastLink  = localStorage.getItem("last_link", activeLink)
    if(!lastLink)
    return;

    //remember last link
    setActiveLink(lastLink)
  },[])

  const storeLastClicked = (link) =>{
    //store last link clicked on local storage
    //to help browser remember it when it is refreshed
    localStorage.setItem("last_link", link);
  }

  return (
    <>
      <div
        className="sidebar main-sidebar"
        style={sidebar ? { display: "flex" } : { display: "none" }}
      >
        <div>
          {/* <p className="logo">Wetrack</p> */}
          {/* <img src={Logo} className="logo" /> */}
          <ul>
            {links.map((val, i) => {
              return (
                <li
                key={i}
                 className={activeLink === val.link? 'active' : null}
                  onClick={() => {
                    navigate("/" + val.link);
                    setActiveLink(val.link);
                    storeLastClicked(val.link)
                  }}
                >
                  <span>{val.icon}</span>
                  <span>{val.name}</span>
                </li>
              );
            })}
          </ul>
          {/* <ul>
            <li
              onClick={() => {
                navigate("/dashboard");
                setActiveLink(true)
              }}
              className={activeLink ? 'active' : null}
            >
              <FaThLarge />
              <span>Dashboard</span>
            </li>
            <li
              onClick={() => {
                navigate("/sales");
              }}
            >
              <FaChartPie />
              <span>Sales</span>
            </li>
            <li
              onClick={() => {
                navigate("/invoices");
              }}
            >
              <FaFileInvoiceDollar />
              <span>Invoices</span>
            </li>
            <li
              onClick={() => {
                navigate("/products");
              }}
            >
            <FaShoppingBag />
             <span>Products</span> 
            </li>
            <li
              onClick={() => {
                navigate("/users");
              }}
            >
              <FaStore />
              Customers
            </li>
            <li
              onClick={() => {
                navigate("/users");
              }}
            >
              <FaUsers />
              <span>Teams</span>
              </li>
            <li
              onClick={() => {
                navigate("/users");
              }}
            >
            <FaUserAlt />
            <span>Admin</span>  
            </li>
            <li
              onClick={() => {
                navigate("/users");
              }}
            >
            <FaUserCog />
            <span>Account</span>  
            </li>
            <li
              onClick={logout}
            >
              <FaPowerOff />
              Logout
            </li>
          </ul> */}
        </div>
      </div>
    </>
  );
}

export default Sidebar;
