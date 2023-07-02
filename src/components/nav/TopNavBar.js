import React, { useEffect, useState, useContext } from "react";
import "./TopNavBar.css";
import Avatar from "../../img/avatar.png";
import {
  FaSearch
} from "react-icons/fa";
import { authUserBusinessData } from "../settings/AuthUserData";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { authToken } from "../settings/Authentication";
import { BaseUrl } from "../settings/BaseUrl";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { useNavigate } from "react-router-dom";

function TopNavBar() {
  const {  topNav, setTopNav, setSideBar, businessCampaigns, setBusinessCampaigns,campaignId, setCampaignId,isCampaignAdded, setActiveLink} = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    getBusinessCampaigns();
  }, [authToken(), isCampaignAdded]);

  const getBusinessCampaigns = () => {
    
    if(!authUserBusinessData())
    return; 
    
    axios({
      url: BaseUrl("business/" +authUserBusinessData().business_id+ "/campaigns"),
      method: "get",
      headers: {
        Authorization: "Bearer " + authToken(),
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setBusinessCampaigns(response.data);
        setCampaignId(response.data.campaigns[0].id)
      })
      .catch((err) => {});
  };

  const logout = () => {
    setSideBar(false)
    setTopNav(false)
    setActiveLink('dashboard')
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <header className="main-header sticky top-0 bg-white border-b border-slate-200 z-999"  style={topNav ? { display: "flex" } : { display: "none" }}>
        <div className="campaign-wrapper">
          <span>{authUserBusinessData() && authUserBusinessData().business} </span>
          {businessCampaigns.campaigns &&
            businessCampaigns.campaigns.map((val, index) => {
              return (
                <span key={index} className={val.id == campaignId ? "pills active" : "pills"} onClick={()=>{
                  setCampaignId(val.id)
                }}>
                  {val.name}
                </span>
              );
            })}

          {/* <span className="pills">Sales Survey Campaigns</span> */}
          {/* <span className="pills"><FaEllipsisH /></span> */}
        </div>
        <ul className="top-menu-items">
          <li>
            <div className="h-icon-wrapper">
              {/* <FaSearch /> */}
            </div>
          </li>
          {/* <li>
            <div className="h-icon-wrapper">
              <FaShoppingCart />
            </div>
          </li>
          <li>
            <div className="h-icon-wrapper">
              <FaComments />
            </div>
          </li> */}
          <li>
            <Menu
            menuButton={
              <MenuButton>
                        <img src={Avatar} className="avatar" />
              </MenuButton>
            }
            transition
          >
            <MenuItem onClick={()=>navigate('/account')}>Account</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
          </li>
        </ul>
      </header>
    </>
  );
}

export default TopNavBar;
