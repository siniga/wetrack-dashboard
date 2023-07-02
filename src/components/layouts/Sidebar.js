import React, { useContext, useEffect, useState } from "react";
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
  FaMapMarkerAlt,
} from "react-icons/fa";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import Logo from "../../img/logo.png";
import { AuthContext } from "../../context/authContext";

function Sidebar() {
  const { isLoggedIn } = useContext(AuthContext);
  const [activeLink, setActiveLink] = useState("/dashboard");

  useEffect(()=>{
    let lastClickedLink = localStorage.getItem('last_link_clicked');
    setActiveLink(lastClickedLink)
  },[])

  if (isLoggedIn) {
    return null; // Return null to hide the sidebar when the user is logged in
  }

  const handleLinkClick = (link) => {
    setActiveLink(link);
    localStorage.setItem("last_link_clicked", link)
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <img src={Logo} width={120} />
      </div>
      <ul className="sidebar-nav">
        <li className="list-header">reports</li>
        <li className={activeLink === "/dashboard" ? "active" : ""}>
          <Link to="/dashboard" onClick={() => handleLinkClick("/dashboard")}>
            <FaThLarge />
            Dashboard
          </Link>
        </li>
        <li className={activeLink === "/calls" ? "active" : ""}>
          <Link to="/calls" onClick={() => handleLinkClick("/calls")}>
            <FaMapMarkerAlt />
            Maps
          </Link>
        </li>
        <li className={activeLink === "/sales" ? "active" : ""}>
          <Link to="/sales" onClick={() => handleLinkClick("/sales")}>
            <FaChartPie />
            Sales
          </Link>
        </li>
        <li className={activeLink === "/agents" ? "active" : ""}>
          <Link to="/agents" onClick={() => handleLinkClick("/agents")}>
            <FaChartPie />
            Agents
          </Link>
        </li>
        <li className="list-header" style={{ marginTop: 40 }}>
          Management
        </li>
        <li className={activeLink === "/products" ? "active" : ""}>
          <Link to="/products" onClick={() => handleLinkClick("/products")}>
            <FaShoppingBag />
            Products
          </Link>
        </li>
        <li className={activeLink === "/customers" ? "active" : ""}>
          <Link to="/customers" onClick={() => handleLinkClick("/customers")}>
            <FaStore />
            Customers
          </Link>
        </li>
        <li className={activeLink === "/users" ? "active" : ""}>
          <Link to="/users" onClick={() => handleLinkClick("/users")}>
            <FaUserTie />
            Users
          </Link>
        </li>
        <li className={activeLink === "/teams" ? "active" : ""}>
          <Link to="/teams" onClick={() => handleLinkClick("/teams")}>
            <FaUsers />
            Teams
          </Link>
        </li>
        <li className={activeLink === "/account" ? "active" : ""}>
          <Link to="/account" onClick={() => handleLinkClick("/account")}>
            <FaUserCog />
            Account
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
