import React, { useState, useEffect, useContext } from "react";
import Card from "../../components/cards/Card";
import { BsGear, BsLock, BsPerson } from "react-icons/bs";
import Avatar from "../../components/common/Avatar";
import { Checkbox } from "../../components/elements/Checkbox";
import Field from "../../components/elements/Field";
import Form from "../../components/elements/Form";
import ImageUploader from "react-images-upload";
import VertList from "../../components/common/VertList";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { authToken } from "../../components/settings/Authentication";
import { BaseUrl } from "../../components/settings/BaseUrl";
import "./User.css";
import { UserContext } from "../../components/context/UserContext";
import { NumericFormat } from "react-number-format";

function User(props) {
  const { campaignId } = useContext(UserContext);
  const { setSideBar } = props;
  const [agents, setAgents] = useState([]);
  const [pictures, setPictures] = useState([]);
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [imgPreview, setImgPreview] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setSideBar(true);
  }, []);

  useEffect(() => {
    getAgents();
  }, [campaignId]);

  const getAgents = () => {
    axios({
      url: BaseUrl("agent-stats/campaign/" + campaignId),
      method: "get",
      headers: {
        Authorization: "Bearer " + authToken(),
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log(response.data);
        setAgents(response.data);
        setUserStats(response.data[0]);
      })
      .catch((err) => {});
  };

  const getNumCustomers = (uid) => {
    axios({
      url: BaseUrl("agent/"+uid+"/num-customers"),
      method: "get",
      headers: {
        Authorization: "Bearer " + authToken(),
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setUserStats(response.data);
      })
      .catch((err) => {});
  };



  const onDrop = (picture) => {
    console.log(pictures);
    setPictures([...pictures, picture]);
  };

  return (
    <div
      className="page main-page-container"
      style={{ display: "flex", gap: 20 }}
    >
      
      <Card minWidth="25%">
        <div style={{ padding: "2px 20px" }}>
          <div
            className="back-btn-wrapper action-btns"
            onClick={() => {
              location.state.user.flag = 1
                ? navigate("/dashboard")
                : navigate("/agents");
            }}
          >
            <FaArrowLeft />
          </div>
          <ul className="vertical-ul">
            {agents.length > 0 &&
              agents.map((agent, index) => {
                return (
                  <VertList
                    key={index}
                    background={agent.id ==  userStats.id ? "#ecf4fc" : null}
                    color={"#144b81"}
                    radius={7}
                    showBorder={false}
                    onClick={() => {
                      setUserStats(agent)
                    }}
                  >
                    <p>{agent.name}</p>
                  </VertList>
                );
              })}
          </ul>
        </div>
      </Card>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <Card>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div>
              <Avatar width={80} height={80} avatarImgPreview={imgPreview} />
              <h4 style={{ marginTop: 15 }}>
                {userStats && userStats.name}
              </h4>
            </div>
          </div>
        </Card>
        <div style={{ display: "flex", gap: 43 }}>
          <Card minWidth={"20%"}>
            <span>Visitations</span>
            <br />
            <span className="user-stats-num">
              {" "}
              {userStats ? userStats.num_visit : 0}
            </span>
          </Card>
          <Card minWidth={"20%"}>
            Effective Sales
            <br />
            <span className="user-stats-num">
              {" "}
              {userStats ? userStats.num_sale : 0}
            </span>
          </Card>
          <Card minWidth={"25%"}>
            Revenue
            <br />
            <span className="user-stats-num">
            <NumericFormat
              thousandSeparator={true}
              displayType={"text"}
              value={userStats && userStats.product_stats ? userStats.product_stats.total_amount_sold : 0}
              allowLeadingZeros
              prefix={"Tsh "}
            />
            
            </span>
          </Card>
          <Card minWidth={"20%"}>
            Number of customers
            <br />
            <span className="user-stats-num">
              {userStats ? userStats.num_customers : 0}
            </span>
          </Card>
          {/* <Card minWidth={"25%"}>aha</Card> */}
        </div>
        {/* <Card minWidth={"100%"}>
          This month Sales <br />
          <span className="user-stats-num">
            {" "}
            {userStats.num_visit ? userStats.num_visit : 0}
          </span>
        </Card> */}
        {/* <Card minWidth={"100%"}>
          Customers <br />
          <span className="user-stats-num">
            {" "}
            {userStats.num_visit ? userStats.num_visit : 0}
          </span>
        </Card>
        <Card minWidth={"100%"}>
          {" "}
          Top Customers <br />
          <span className="user-stats-num">
            {" "}
            {userStats.num_visit ? userStats.num_visit : 0}
          </span>
        </Card> */}
      </div>
    </div>
  );
}

export default User;
