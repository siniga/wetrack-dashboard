import React, { useEffect, useState } from "react";
import { BaseUrl } from "../../components/settings/BaseUrl";
import {
  fetchUsersByRegions,
  fetchUsersData,
} from "../../components/api/Users";
import axios from "axios";
import { fetchRegionData } from "../../components/api/Regions";
import PageLoader from "../../components/common/PageLoader";
import { fetchUserReports } from "../../components/api/Report";
import "./Agents.css";
import { Link } from "react-router-dom";
import ColumnChart from "../../charts/ColumnChart";
import { FaFilter } from "react-icons/fa";

function Agents() {
  const [selectedRegion, setSelectedRegion] = useState();
  const [agents, setAgents] = useState([]);
  const [regions, setRegions] = useState([]);
  const [isAgentsLoading, setIsAgentsLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [agentDetails, setAgentDetails] = useState(null);
  const [newDayFilter, setNewDayFilter] = useState("today");

  const BASE_URL = BaseUrl("/");
  const token = localStorage.getItem("token");
  const loggedUser = JSON.parse(localStorage.getItem("user"));

  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    // setIsRegionLoading(true);
    const fetchRegions = async () => {
      const response = await fetchRegionData(axiosInstance);
      if (response) {
        // setIsRegionLoading(false);
        setRegions(response);
        setSelectedRegion(response[0].id);
      }
    };

    fetchRegions();
  }, []);

  useEffect(() => {
    setIsAgentsLoading(true);
    const fetchData = async () => {
      const agents = await fetchUsersByRegions(
        axiosInstance,
        loggedUser.business_id,
        selectedRegion
      );
      if (agents) {
        setIsAgentsLoading(false);
        setAgents(agents);
      }
    };

    fetchData();
  }, [selectedRegion]);

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
  };

  const onAgentClicked = async (agent) => {
    console.log(newDayFilter);
    const response = await fetchUserReports(
      axiosInstance,
      agent.user_id,
      loggedUser.business_id,
      newDayFilter
    );
    if (response) {
      setSelectedAgent(response);
      setAgentDetails(agent);
    }
  };

  const calConvertionRate = (conversions, totalLeads) => {
    if (!conversions && !totalLeads) return 0;
    if (totalLeads === 0) return 0;

    const conversionRate = (conversions / totalLeads) * 100;
    return conversionRate.toFixed();
  };

  const filterData = async (dayFilter) => {
    if (!agentDetails) {
      alert("select user before filtering");
      return;
    }

    // console.log(agentDetails);
    const response = await fetchUserReports(
      axiosInstance,
      agentDetails.user_id,
      loggedUser.business_id,
      dayFilter
    );

    if (response) {
      setSelectedAgent(response);
      // setNewDayFilter(dayFilter);
    }
  };

  //   /users/business/2
  return (
    <>
      {" "}
      <div className="menu-bar">
        <h1 className="page-header">/ Agents Stats</h1>
        <div>
          <ul
            className="view-list"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 14,
              gap: 5,
            }}
          >
            <li>
              <FaFilter />
            </li>
            <li
              style={{
                border: "solid thin #ccc",
                borderRadius: 4,
                paddingRight: 10,
                paddingLeft: 10,
              }}
              className={newDayFilter == "today" && "active"}
              onClick={() => filterData("today")}
            >
              Today
            </li>
            <li
              style={{
                border: "solid thin #ccc",
                borderRadius: 4,
                paddingRight: 10,
                paddingLeft: 10,
              }}
              className={newDayFilter == "week" ? "active" : ""}
              onClick={() => filterData("week")}
            >
              Week
            </li>
            <li
              style={{
                border: "solid thin #ccc",
                borderRadius: 4,
                paddingRight: 10,
                paddingLeft: 10,
              }}
              className={newDayFilter == "month" ? "active" : ""}
              onClick={() => filterData("month")}
            >
              Month
            </li>
          </ul>
        </div>
      </div>
      <div
        className="main-dashboard-wrapper"
        style={{ display: "flex", flexDirection: "row" }}
      >
        <div className="inner-card-wrapper-4" style={{ width: "20%" }}>
          <div className="lg-card left-sidebar">
            <label>
              <select
                style={{ height: 34, cursor: "pointer", padding: 0 }}
                name="regions"
                value={selectedRegion}
                onChange={handleRegionChange}
              >
                {/* <option value="">Filter by Region</option> */}
                {regions.map((region, index) => {
                  return (
                    <option key={index} value={region.id}>
                      {region.name}
                    </option>
                  );
                })}
              </select>
            </label>
            {agents.length === 0 && (
              <div style={{ marginTop: 100, textAlign: "center" }}>
                <p style={{ fontSize: 14, color: "#666" }}>
                  No agents in this region
                </p>
              </div>
            )}
            {isAgentsLoading && <PageLoader />}
            {!isAgentsLoading && (
              <div>
                {agents.length > 0 && (
                  <div style={{ height: 400, overflowY: "scroll" }}>
                    <ul
                      className="city-list"
                      style={{ position: "relative", top: "-20px" }}
                    >
                      {agents &&
                        agents.map((agent, index) => {
                          return (
                            <li
                              key={index}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                cursor: "pointer",
                                paddingLeft: 10,
                                paddingRight: 10,
                              }}
                              onClick={() => onAgentClicked(agent)}
                            >
                              <div>{agent.user_name}</div>
                              {/* <div>{user.num_visits}</div> */}
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="inner-card-wrapper-4 main-content-center">
          <div className="lg-card user-details-wrapper">
            <div className="user-wrapper">
              <div className="user-img-wrapper">K</div>
              <div className="user-personal-details">
                <p style={{ fontSize: 18, fontWeight: "bold" }}>
                  {agentDetails?.user_name}
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    fontSize: 12,
                    color: "#666",
                  }}
                >
                  <p>{agentDetails?.team}</p>
                  {"-"}
                  <p>{agentDetails && "Sales " + agentDetails?.role}</p>
                  {"-"}
                  <p>{agentDetails?.phone}</p>
                </div>
              </div>
            </div>
            {selectedAgent && (
              <div style={{ display: "flex", gap: 10, height: 20 }}>
                <div
                  style={{
                    background: "#ccc",
                    display: "flex",
                    alignItems: "center",
                    height: 24,
                    width: 100,
                    justifyContent: "center",
                    borderRadius: 6,
                    fontSize: 15,
                  }}
                >
                  {selectedAgent?.day_filter[0]}
                </div>
                <div
                  style={{
                    background: "#ccc",
                    display: "flex",
                    alignItems: "center",
                    height: 24,
                    width: 100,
                    justifyContent: "center",
                    borderRadius: 6,
                    fontSize: 15,
                  }}
                >
                  {selectedAgent?.day_filter[0]}
                </div>
                {/* { +
                  " to " +
                  selectedAgent?.day_filter[1]} */}
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div className="lg-card top-stat-wrapper">
              <div className="card-header">Customer Visits</div>
              <div className="card-stat">{selectedAgent?.total_visits}</div>
              <div className="card-footer"></div>
            </div>
            <div className="lg-card top-stat-wrapper">
              <div className="card-header">Total Sales</div>
              <div className="card-stat">{selectedAgent?.total_num_sales}</div>
              <div className="card-footer"></div>
            </div>
            <div className="lg-card top-stat-wrapper">
              <div className="card-header">New Customers</div>
              <div className="card-stat">
                {selectedAgent?.total_num_customers}
              </div>
              <div className="card-footer"></div>
            </div>
            <div className="lg-card top-stat-wrapper">
              <div className="card-header">Total Revenue</div>
              <div className="card-stat">
                {selectedAgent?.total_revenue.toLocaleString("en-TZ", {
                  style: "currency",
                  currency: "TZS",
                })}
              </div>
              <div className="card-footer"></div>
            </div>
          </div>
          <div className="lg-card time-metric-wrapper">
            <span>Avg time spent at a customer:</span>
            <span>
              {!selectedAgent?.avg_time_spent
                ? 0
                : selectedAgent?.avg_time_spent}{" "}
              minutes
            </span>
          </div>
          <div className="lg-card time-metric-wrapper">
            <span>Average Conversion Rate:</span>
            <span style={{ display: "flex", gap: 10 }}>
              <span>
                {calConvertionRate(
                  selectedAgent?.total_num_sales,
                  selectedAgent?.total_visits
                ) < 40 && (
                  <span
                    style={{
                      color: "white",
                      background: "red",
                      fontSize: 13,
                      paddingLeft: 10,
                      paddingRight: 10,
                      paddingTop: 2,
                      paddingBottom: 2,
                      borderRadius: 5,
                    }}
                  >
                    Poor
                  </span>
                )}
                {calConvertionRate(
                  selectedAgent?.total_num_sales,
                  selectedAgent?.total_visits
                ) > 50 &&
                  calConvertionRate(
                    selectedAgent?.total_num_sales,
                    selectedAgent?.total_visits
                  ) < 70 && (
                    <span
                      style={{
                        color: "black",
                        background: "yellow",
                        fontSize: 13,
                        paddingLeft: 10,
                        paddingRight: 10,
                        paddingTop: 2,
                        paddingBottom: 2,
                        borderRadius: 5,
                      }}
                    >
                      Good
                    </span>
                  )}
                {calConvertionRate(
                  selectedAgent?.total_num_sales,
                  selectedAgent?.total_visits
                ) > 70 &&
                  calConvertionRate(
                    selectedAgent?.total_num_sales,
                    selectedAgent?.total_visits
                  ) < 80 && (
                    <span
                      style={{
                        color: "white",
                        background: "green",
                        fontSize: 13,
                        paddingLeft: 10,
                        paddingRight: 10,
                        paddingTop: 2,
                        paddingBottom: 2,
                        borderRadius: 5,
                      }}
                    >
                      Great
                    </span>
                  )}
                {calConvertionRate(
                  selectedAgent?.total_num_sales,
                  selectedAgent?.total_visits
                ) >= 80 && (
                  <span
                    style={{
                      color: "white",
                      background: "green",
                      fontSize: 13,
                      paddingLeft: 10,
                      paddingRight: 10,
                      paddingTop: 2,
                      paddingBottom: 2,
                      borderRadius: 5,
                    }}
                  >
                    Boss Mode
                  </span>
                )}
              </span>
              {calConvertionRate(
                selectedAgent?.total_num_sales,
                selectedAgent?.total_visits
              )}
              %
            </span>
          </div>
          <div className="lg-card time-metric-wrapper" style={{ height: 425 }}>
            <ColumnChart
              categories={selectedAgent?.product_sold.categories}
              series={[
                {
                  name: "Number of sales",
                  data: selectedAgent?.product_sold.data,
                },
              ]}
            />
          </div>
          <div className="md-card">
            <p
              className="card-header"
              style={{ position: "relative", top: 16, left: 20 }}
            >
              {/* Visited customers {selectedAgent?.agent_customers} */}
            </p>
            <div style={{ padding: 20 }}>
              <table>
                <thead>
                  <tr className="table-row">
                    <th>Name</th>
                    <th>Visits</th>
                    <th>Items</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedAgent?.agent_customers.map((customer, index) => {
                    return (
                      <tr style={{ height: 40 }} key={index}>
                        <td>{customer.name}</td>
                        <td>{customer.total_visits}</td>
                        <td>{customer.total_quantity}</td>
                        <td>{customer.total_amount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div
                style={{ position: "relative", top: 20, textAlign: "right" }}
              >
                <Link
                  to={""}
                  style={{
                    color: "#f60",
                    fontSize: 14,
                  }}
                >
                  {/* Show All */}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Agents;
