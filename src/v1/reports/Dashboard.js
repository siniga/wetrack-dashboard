import React, { useEffect, useState } from "react";
import "../Pages.css";
import "./Dashboard.css";
import {
  fetchCustomerVisitors,
  fetchReports,
} from "../../components/api/Report";
import { BaseUrl } from "../../components/settings/BaseUrl";
import axios from "axios";
import PieChart from "../../charts/PieChart";
import ColumnChart from "../../charts/ColumnChart";
import AreaChart from "../../charts/AreaChart";
import List from "../../charts/List";
import { Link } from "react-router-dom";
import BubbleChart from "../../charts/BubleChart";
import PageLoader from "../../components/common/PageLoader";
import { exportOrderData } from "../../components/api/Exports";
import Loader from "../../img/spinner_loader.gif";

export const options = {
  chart: {
    title: "",
    subtitle: "",
  },
  chartArea: { left: 40, top: 0, width: "90%", height: "90%" },
  // legend: { position: "bottom", textStyle: { color: "blue", fontSize: 16 } },
  legend: { position: "top" },
  colors: ["#145365", "#ff6600", "#feca3c", "#fd9b3d"],
};

function Dashboard() {
  const [reports, setReports] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

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

  const handleDownload = async () => {
    setIsExporting(true);
    const data = await exportOrderData(axiosInstance);
    if (data) {
      setIsExporting(false);
      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = "sales.csv"; // Specify the filename
      link.click();

      // Clean up the URL object
      URL.revokeObjectURL(url);
    }
  };

  useEffect(() => {
    setIsPageLoading(true);
    if (!loggedUser) {
      return;
    }

    const fetchData = async () => {
      const response = await fetchReports(
        axiosInstance,
        loggedUser.business_id
      );
      if (response) {
        setIsPageLoading(false);
        setReports(response);
      }
    };

    fetchData();
  }, []);

  const mergeRepeatedItems = (data) => {
    // Merge the data for products with the same name
    const mergedData = data.reduce((result, current) => {
      const existing = result.find((item) => item.name === current.name);

      if (existing) {
        existing.data = existing.data.map(
          (value, index) => value + current.data[index]
        );
      } else {
        result.push(current);
      }

      return result;
    }, []);


    return mergedData;
  };

  return (
    <div>
      <div className="menu-bar">
        <h1 className="page-header">/ Dashboard</h1>
        <div>
          <ul className="view-list">
            {!isExporting && (
              <li className="active" onClick={handleDownload}>
                <span> Export</span>
              </li>
            )}
            {isExporting && (
              <li style={{ position: "relative" }}>
                <span>
                  <img src={Loader} style={{ width: 40, height: 40 }} />
                </span>
              </li>
            )}
            <li>Refresh</li>
          </ul>
        </div>
      </div>
      <div style={{ position: "relative" }}>
        {isPageLoading && <PageLoader />}
      </div>
      {!isPageLoading && reports && (
        <div
          className="main-dashboard-wrapper"
          style={{ position: "relative" }}
        >
          <div className="inner-card-wrapper-1">
            <div className="sm-card">
              <div className="card-header">Customer Visits</div>
              {console.log(reports)}
              <div className="card-stat">
                {reports !== undefined && reports?.customer_visit.this_month}
              </div>
              <div className="card-footer">
                vs last month{" "}
                {reports !== undefined && reports?.customer_visit.last_month}{" "}
              </div>
            </div>
            <div className="sm-card">
              <div className="card-header">Effective Sales</div>
              <div className="card-stat">
                {reports && reports?.sales.this_month}{" "}
              </div>
              <div className="card-footer">
                vs last month {reports && reports?.sales.last_month}
              </div>
            </div>
            <div className="sm-card">
              <div className="card-header">Revenue</div>
              <div className="card-stat">
                {reports &&
                  reports?.revenue?.this_month.toLocaleString("en-TZ", {
                    style: "currency",
                    currency: "TZS",
                  })}{" "}
              </div>
              <div className="card-footer">
                vs last month{" "}
                {reports &&
                  reports?.revenue?.last_month.toLocaleString("en-TZ", {
                    style: "currency",
                    currency: "TZS",
                  })}{" "}
              </div>
            </div>
            <div className="sm-card">
              <div className="card-header">New Customer Revenue</div>
              <div className="card-stat">
                {reports?.new_customers_revenue.this_month &&
                  reports?.new_customers_revenue?.this_month.toFixed(0)}
                %{" "}
              </div>
              <div className="card-footer">
                vs last month{" "}
                {reports?.new_customers_revenue.this_month &&
                  reports?.new_customers_revenue?.last_month.toFixed(0)}
                %{" "}
              </div>
            </div>
          </div>
          <div className="inner-card-wrapper-2">
            <div className="lg-card">
              <p className="card-header">Visits vs Sales overview</p>
              <ColumnChart
                categories={reports?.charts.sales_vs_visits.sales.categories}
                series={[
                  {
                    name: "Visits",
                    data: reports?.charts.sales_vs_visits.visits.data,
                  },

                  {
                    name: "Sales",
                    data: reports?.charts.sales_vs_visits.sales.data,
                  },
                ]}
              />
            </div>
            <div className="md-card">
              <p
                className="card-header"
                style={{ position: "relative", top: 16, left: 20 }}
              >
                Top products
              </p>
              <PieChart
                series={[
                  {
                    name: "Quantity",
                    data: reports?.charts.top_products,
                  },
                ]}
              />
            </div>
          </div>
          <div className="inner-card-wrapper-2">
            <div className="md-card">
              <p
                className="card-header"
                style={{ position: "relative", top: 16, left: 20 }}
              >
                Teams sales vs visits
              </p>
              <div style={{ marginTop: 25 }}>
                <ColumnChart
                  categories={
                    reports?.charts.team_sales_vs_visits.visits.categories
                  }
                  series={[
                    {
                      name: "Visits",
                      data: reports?.charts.team_sales_vs_visits.visits.data,
                    },

                    {
                      name: "Sales",
                      data: reports?.charts.team_sales_vs_visits.sales.data,
                    },
                  ]}
                />
              </div>
            </div>
            <div className="md-card">
              <p
                className="card-header"
                style={{ position: "relative", top: 16, left: 20 }}
              >
                Top Customer types
              </p>
              <PieChart
                series={[
                  {
                    name: "Quantity",
                    data: reports?.charts.top_customer_types,
                  },
                ]}
              />
            </div>
          </div>
          <div className="inner-card-wrapper-2">
            <div className="md-card">
              <p
                className="card-header"
                style={{ position: "relative", top: 16, left: 20 }}
              >
                Sales Trend
              </p>
              <div style={{ padding: 20 }}>
                {/* <BubbleChart
                  series={reports?.charts?.top_disctricts}
                /> */}
                <ColumnChart
                  categories={reports.sales_trend.categories}
                  series={mergeRepeatedItems(reports?.sales_trend.data)}
                />
              </div>
            </div>
          </div>
          <div className="inner-card-wrapper-2">
            <div className="md-card">
              <p
                className="card-header"
                style={{ position: "relative", top: 16, left: 20 }}
              >
                Top Teams
              </p>
              {/* <PieChart /> */}

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
                    {reports?.data?.top_teams.map((team, index) => {
                      return (
                        <tr key={index} style={{ height: 40 }}>
                          <td>{team.name}</td>
                          <td>{team.total_visits}</td>
                          <td>{team.total_quantity}</td>
                          <td>{team.total_amount}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="inner-card-wrapper-2">
            <div className="md-card">
              <p
                className="card-header"
                style={{ position: "relative", top: 16, left: 20 }}
              >
                Top Customers
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
                    {reports?.data?.top_customers.map((customer, index) => {
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
          <div className="inner-card-wrapper-4" style={{ display: "none" }}>
            <div className="md-card"></div>
            <div className="md-card">
              <p
                className="card-header"
                style={{ position: "relative", top: 16, left: 20 }}
              >
                Districts
              </p>
              {console.log(reports?.charts?.top_disctricts)}
              <div style={{ padding: 20 }}>
                {/* <BubbleChart
                  series={reports?.charts?.top_disctricts}
                /> */}
                <AreaChart
                  categories={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]}
                  series={[
                    {
                      name: "Series 1",
                      data: [10, 8, 12, 6, 14, 9, 15],
                      color: "blue", // Custom color for Series 1
                    },
                    {
                      name: "Series 2",
                      data: [5, 3, 6, 2, 7, 4, 8],
                      color: "green", // Custom color for Series 2
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
