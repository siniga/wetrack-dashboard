import React, { useEffect, useState, useContext } from "react";
import "./Dashboard.css";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import {
  FaPlus,
  FaFileExport,
  FaFileDownload,
  FaCalendar,
  FaChartPie,
  FaStoreAlt,
  FaWallet,
  FaWalking,
  FaUser,
  FaEdit,
  FaTrashAlt,
} from "react-icons/fa";
import ActionButtonsMenue from "../../components/header/ActionButtonsMenue";
import Header from "../../components/header/Header";
import FilterButtonsMenue from "../../components/header/FilterButtonsMenue";
import Modal from "../../components/modal/Modal";
import DatePicker from "../../components/modal/DatePicker";
import { Button } from "../../components/elements/Button";
import Card from "../../components/cards/Card";
import Stats from "../../components/cards/Stats";
import { Chart } from "react-google-charts";
import VertList from "../../components/common/VertList";
import Select from "react-select";
import Product1 from "../../img/products/castleLight.png";
import Product2 from "../../img/products/kilimanjaro.png";
import Product3 from "../../img/products/safari.png";
import Table from "../../components/tables/Table";
import TableHeader from "../../components/tables/TableHeader";
import axios from "axios";
import { BaseUrl, StorageUrl } from "../../components/settings/BaseUrl";
import { authToken } from "../../components/settings/Authentication";
import TableData from "../../components/tables/TableData";
import TableRow from "../../components/tables/TableRow";
import { useNavigate } from "react-router-dom";
import Pusher from "pusher-js";
import { NumericFormat } from "react-number-format";
import {
  authUserBusinessData,
  authUserData,
} from "../../components/settings/AuthUserData";
import { UserContext } from "../../components/context/UserContext";
import Loader from "../../components/pageloader/Loader";
import NoDataMessage from "../../components/common/NoDataMessage";
import {
  calcPercentage,
  compareFromPrevData,
} from "../../components/helpers/Helpers";
import CompareStats from "../../components/cards/CompareStats";
import { FetchData } from "../../components/settings/api/FetchData";

export const productByAreaData = [
  ["Product", "Product Sold"],
  ["Castle Light", 11],
  ["Safari", 2],
  ["Kilimanjaro", 2],
];

export const topDistrictOptions = {
  chartArea: { left: 40, top: 0, width: "90%", height: "90%" },
  legend: { position: "bottom", textStyle: { color: "blue", fontSize: 16 } },
  colors: ["#ff6600", "#145365", "#feca3c", "#fd9b3d"],
  pieHole: 0.4,
};

export const productByAreaOptions = {
  chartArea: { left: 40, top: 0, width: "90%", height: "90%" },
  legend: { position: "bottom", textStyle: { color: "blue", fontSize: 16 } },
  colors: ["#ff6600", "#145365", "#feca3c", "#fd9b3d"],
  pieHole: 0.4,
};

export const monthlyAttendance = [
  ["Month", "Attendance", "Absent"],
  ["Jan", 200, 40],
  ["Feb", 120, 10],
  ["March", 200, 120],
  ["Apr", 130, 30],
];

export const options = {
  chart: {
    title: "",
    subtitle: "",
  },
  chartArea: { left: 40, top: 0, width: "90%", height: "90%" },
  legend: { position: "bottom", textStyle: { color: "blue", fontSize: 16 } },
  colors: ["#145365", "#ff6600", "#feca3c", "#fd9b3d"],
};

const month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const d = new Date();
let monthName = month[d.getMonth()];

function Dashboard(props) {
  const { setTopNav, campaignId } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({});
  const [trends, setTrends] = useState([]);
  const [regions, setRegions] = useState([]);
  const [regionId, setRegionId] = useState(1);
  const [topProducts, setTopProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTrendLoading, setIsTrendLoading] = useState(false);
  const [isTopProductsLoading, setIsTopProductsLoading] = useState(false);
  const [isNoticeBoadLoading, setIsNoticeBoardLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [thisMonthCustomers, setThisMonthCustomers] = useState(0);
  const [lastMonthCustomers, setLastMonthCustomers] = useState(0);
  const [noticeBoard, setNoticeBoard] = useState([]);
  const navigate = useNavigate();

  const showDatePickerModal = () => {
    setShowModal(true);
  };

  useEffect(() => {
    getStats();
  }, [campaignId]);

  useEffect(() => {
    getTrends();
  }, [campaignId]);

  useEffect(() => {
    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = false;

    var pusher = new Pusher("5e0181cb424c02006d6a", {
      cluster: "ap2",
    });

    var channel = pusher.subscribe("notify-channel");
    channel.bind("notify-event", function (data) {
      // console.log(data.message);
      setStats(data.message.original);
    });
  }, []);

  useEffect(() => {
    FetchData("regions")
      .then((response) => {
        setRegions(response);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    setIsTopProductsLoading(true);
    FetchData(`top-products/campaign/${campaignId}/region/${regionId}`)
      .then((response) => {
        setTopProducts(response);
        setIsTopProductsLoading(false);
      })
      .catch((err) => {
        setIsTopProductsLoading(false);
      });
  }, [regionId]);

  const getStats = () => {
    setIsLoading(true);
    if (!authUserBusinessData()) return;

    axios({
      url: BaseUrl("stats/campaign/" + campaignId),
      method: "get",
      headers: {
        Authorization: "Bearer " + authToken(),
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.data.stats.num_new_customers) {
          setThisMonthCustomers(
            response.data.stats.num_new_customers.this_month_customers
          );
          setLastMonthCustomers(
            response.data.stats.num_new_customers.last_month_customers
          );
        }
        setStats(response.data);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const getTrends = () => {
    setIsTrendLoading(true);
    axios({
      url: BaseUrl("trends/campaign/" + campaignId + "/user/0"),
      method: "get",
      headers: {
        Authorization: "Bearer " + authToken(),
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setTrends(response.data);
        setIsTrendLoading(false);
        getNoticeBoard();
      })
      .catch((err) => {
        setIsTrendLoading(false);
      });
  };

  const getNoticeBoard = () => {
    setIsNoticeBoardLoading(true);
    axios({
      url: BaseUrl("notice-board/campaign/" + campaignId),
      method: "get",
      headers: {
        Authorization: "Bearer " + authToken(),
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setNoticeBoard(response.data);
        setIsNoticeBoardLoading(false);
      })
      .catch((err) => {
        setIsNoticeBoardLoading(false);
      });
  };

  const viewUser = (user) => {
    // console.log(userId)
    navigate("/user", { state: { user: user, flag: 1 } });
  };

  const downloadOrders = () => {
    axios
      .get(BaseUrl("orders/export"), {
        responseType: "blob",
        headers: {
          Authorization: "Bearer " + authToken(),
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "orders.xlsx");
        document.body.appendChild(link);
        link.click();
      });
  };

  const handleRegionChange = (e) => {
    setRegionId(e.target.value);
  };

  return (
    <div className="page dashboard-page">
      {isLoading ? <Loader loadMsg={"loading map..."} /> : null}
      <Header showDatePickerModal={showDatePickerModal}>
        <ActionButtonsMenue>
          <Button buttonLink={"/add-campaign"}>New Campaign</Button>
          <Button buttonLink={"/locations"} buttonStyle={"btn--outline"}>
            View Locations
          </Button>
        </ActionButtonsMenue>
        <FilterButtonsMenue>
          <Menu
            menuButton={
              <MenuButton>
                {/* <FaCalendar /> <span>Select Date</span> */}
              </MenuButton>
            }
            transition
          >
            <MenuItem>Today</MenuItem>
            <MenuItem>Yesterday</MenuItem>
            <MenuItem>This Week</MenuItem>
            <MenuItem>This Month</MenuItem>
            <MenuItem>3 Month</MenuItem>
            <MenuItem>6 Month</MenuItem>
            <MenuItem>This Year</MenuItem>
            {/* <MenuItem onClick={showDatePickerModal}>Select Date Range</MenuItem> */}
          </Menu>

          <Menu
            menuButton={
              <MenuButton>
                <FaFileExport /> <span>Export</span>
              </MenuButton>
            }
            transition
          >
            <MenuItem onClick={downloadOrders}>Today</MenuItem>
            <MenuItem>Yesterday</MenuItem>
            <MenuItem>This Week</MenuItem>
            <MenuItem>This Month</MenuItem>
            <MenuItem>3 Month</MenuItem>
            <MenuItem>6 Month</MenuItem>
            <MenuItem>This Year</MenuItem>
            <MenuItem>Select Date Range</MenuItem>
          </Menu>
        </FilterButtonsMenue>
      </Header>
      <Modal
        header="Select Dates"
        showBackDrop={true}
        modalWidth={"24%"}
        showModal={showModal}
        setShowModal={setShowModal}
      >
        <DatePicker />
      </Modal>
      <div className="stats-pannel">
        {/* Stats */}
        <div style={{ display: "flex", gap: 20, width: "100%" }}>
          <Card minWidth={"23.6%"}>
            <Stats
              bg={"#fd9b3d2b"}
              color={"#fd9b3d"}
              title={"Visits"}
              stat={stats.stats ? stats.stats.num_visits : 0}
              icon={<FaWalking />}
            />
          </Card>
          <Card minWidth={"23.6%"}>
            <Stats
              bg={"#1453652b"}
              color={"#145365"}
              title={"Effective Sales"}
              stat={
                stats.stats && stats.stats.num_sales != 0
                  ? calcPercentage(
                      stats.stats.num_sales,
                      stats.stats.num_visits
                    ).toFixed() + "%"
                  : 0
              }
              icon={<FaChartPie />}
            />
          </Card>

          <Card minWidth={"23.6%"}>
            <Stats
              bg={"#feca3c2b"}
              color={"#feca3c"}
              title={"Revenue"}
              stat={stats.stats ? stats.stats.revenue : 0}
              statFormat={"currency"}
              icon={<FaWallet />}
            />
          </Card>
          <Card minWidth={"23.6%"}>
            <CompareStats
              bg={"#0099ff2b"}
              color={"#2779ad"}
              title={`${monthName} customers from all your campaigns`}
              subTitle={
                compareFromPrevData(
                  thisMonthCustomers,
                  lastMonthCustomers
                ).toFixed() + " % "
              }
              stat={stats.stats ? thisMonthCustomers : 0}
              currentData={thisMonthCustomers}
              prevData={lastMonthCustomers}
              icon={<FaStoreAlt />}
            />
          </Card>
        </div>
        {/* Charts */}
        <div style={{ display: "flex", gap: 20, width: "100%" }}>
          <div
            style={{
              minWidth: "65%",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {/* {trends && console.log( trends.monthly_visits.length) } */}
            <Card
              minWidth={"100%"}
              cardHeader={"Number of visits vs number of affective sales"}
              isDataAvailable={
                trends &&
                trends.monthly_visits &&
                trends.monthly_visits.length <= 2
              }
            >
              <Loader
                isLoading={isTrendLoading}
                loadMsg={"Data is still loading... "}
              />
              <br />
                <Chart
                  chartType="Bar"
                  width="100%"
                  height="400px"
                  data={trends && trends.monthly_visits}
                  options={options}
                />
            </Card>

            {/* <Card cardHeader={"Monthly Attendance"}>
              <Chart
                chartType="Bar"
                width="100%"
                height="400px"
                data={monthlyAttendance}
                options={options}
              />
            </Card> */}
            <Card
              cardHeader={"Monthly number of Item Sold Trend"}
              isDataAvailable={
                trends.item_sold_trends && trends.item_sold_trends.length == 1
              }
            >
              <Loader
                isLoading={isTrendLoading}
                loadMsg={"Data is still loading... "}
              />
              <br />   <br />
              {trends.item_sold_trends && trends.item_sold_trends.length > 2 && trends.item_sold_trends.length < 5 ? (
                <Chart
                  chartType="Line"
                  width="100%"
                  height="400px"
                  data={trends && trends.item_sold_trends}
                  options={options}
                />
              ) : (
                <Chart
                  chartType="Bar"
                  width="100%"
                  height="400px"
                  data={trends && trends.item_sold_trends}
                  options={options}
                />
              )}
            </Card>
            <Table
              style={{ minHeight: 300 }}
              isDataAvailable={
                trends.top_sales_men && trends.top_sales_men.length == 0
              }
            >
              <p>Top Agents</p>
              <br />
              <TableHeader
                style={{ minWidth: 140 }}
                columns={[
                  "Name",
                  "Visits",
                  "Effective Sale",
                  "Qnty Sold",
                  "Amount",
                ]}
              />
              {trends.top_sales_men
                ? trends.top_sales_men.map((user, index) => {
                    return (
                      <TableRow key={index} onClick={() => viewUser(user)}>
                        <TableData style={{ minWidth: 140 }}>
                          {user.name}
                        </TableData>
                        <TableData style={{ minWidth: 140 }}>
                          {user.num_visit ? user.num_visit : 0}
                        </TableData>
                        <TableData style={{ minWidth: 140 }}>
                          {user.num_sale ? user.num_sale : 0}
                        </TableData>
                        <TableData style={{ minWidth: 140 }}>
                          {user.product_stats &&
                          user.product_stats.total_qnty_sold
                            ? user.product_stats.total_qnty_sold
                            : 0}
                        </TableData>
                        <TableData style={{ minWidth: 140 }}>
                          <NumericFormat
                            thousandSeparator={true}
                            displayType={"text"}
                            value={
                              user.product_stats &&
                              user.product_stats.total_amount_sold
                                ? user.product_stats.total_amount_sold
                                : 0
                            }
                            allowLeadingZeros
                            prefix={"Tsh "}
                          />
                        </TableData>
                      </TableRow>
                    );
                  })
                : null}
            </Table>
            <Table
              style={{ minHeight: 300 }}
              isDataAvailable={
                trends.top_customers && trends.top_customers.length == 0
              }
            >
              <p>Top Customers</p>
              <br />
              <TableHeader
                style={{ minWidth: 140 }}
                columns={[
                  "Name",
                  "Visits",
                  "Num of purchase",
                  "Item purchased",
                  "Amount",
                ]}
              />
              {trends.top_customers
                ? trends.top_customers.map((customer, index) => {
                    return (
                      <TableRow key={index}>
                        <TableData style={{ minWidth: 140 }}>
                          {customer.name}
                        </TableData>
                        <TableData style={{ minWidth: 140 }}>
                          {customer.num_visit}
                        </TableData>
                        <TableData style={{ minWidth: 140 }}>
                          {customer.num_sale}
                        </TableData>
                        <TableData style={{ minWidth: 140 }}>
                          {customer.product_stats &&
                          customer.product_stats.total_qnty_sold
                            ? customer.product_stats.total_qnty_sold
                            : 0}
                        </TableData>
                        <TableData style={{ minWidth: 120 }}>
                          <NumericFormat
                            thousandSeparator={true}
                            displayType={"text"}
                            value={
                              customer.product_stats &&
                              customer.product_stats.total_amount_sold
                                ? customer.product_stats.total_amount_sold
                                : 0
                            }
                            allowLeadingZeros
                            prefix={"Tsh "}
                          />
                        </TableData>
                      </TableRow>
                    );
                  })
                : null}
            </Table>
          </div>
          <div
            style={{
              minWidth: "33%",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <Card minWidth={"100%"} height={280}>
              <Loader
                isLoading={isNoticeBoadLoading}
                loadMsg={"Data is still loading... "}
              />
              <p>Notice Board (Last 30 days)</p>
              <br />
              <ul style={{ display: "flex", gap: 10, flexDirection: "column" }}>
                <VertList background={"#ecf4fc"} color={"#144b81"} radius={7}>
                  <p className="children">
                    {noticeBoard &&
                      calcPercentage(
                        noticeBoard.num_new_customers_without_orders,
                        noticeBoard.num_new_total_customers
                      ).toFixed()}
                    % of customers never purchased our products
                  </p>
                </VertList>
                {/* <VertList background={"#ecf4fc"} color={"#144b81"} radius={7}>
                  <p className="children">
                    {noticeBoard &&
                      calcPercentage(
                        noticeBoard.customer_with_sku,
                        noticeBoard.num_new_total_customers
                      ).toFixed()}
                    % of customers have bought atleast one sku
                  </p>
                </VertList> */}
                <VertList background={"#ecf4fc"} color={"#144b81"} radius={7}>
                  <p className="children">
                    {noticeBoard &&
                      calcPercentage(
                        noticeBoard.num_agents_sold_over_mil,
                        noticeBoard.total_num_agents
                      ).toFixed()}
                    % of agents made more than tsh 1,000,000
                    {/* Revenue earned, total TSH{" "}
                    {stats.notifications
                      ? stats.notifications.total_new_revenue
                      : 0} */}
                  </p>
                </VertList>
                <VertList background={"#ecf4fc"} color={"#144b81"} radius={7}>
                  <p className="children">
                    {noticeBoard &&
                      calcPercentage(
                        noticeBoard.num_customers_visited,
                        noticeBoard.num_new_total_customers
                      ).toFixed()}
                    % customers have been visited
                    {/* Customer has been visited, total{" "}
                    {stats.notifications
                      ? stats.notifications.total_new_customer_visited
                      : 0} */}
                  </p>
                </VertList>
                {/* <VertList background={"#ecf4fc"} color={"#144b81"} radius={7}>
                  <p className="children">
                    10% of our Agents skipped work for various reasons
                   
                  </p>
                </VertList> */}
                {/* <VertList background={"#ecf4fc"} color={"#144b81"} radius={7}>
                  <p className="children">
                    28% of our Agents have called in sick
                   
                  </p>
                </VertList> */}
                <VertList background={"#ecf4fc"} color={"#144b81"} radius={7}>
                  <p className="children">
                    {noticeBoard &&
                      calcPercentage(
                        noticeBoard.num_repeat_customers,
                        noticeBoard.num_new_total_customers
                      ).toFixed()}
                    % of our customers bought more than 5 times
                    {/* Customer has been visited, total{" "}
                    {stats.notifications
                      ? stats.notifications.total_new_customer_visited
                      : 0} */}
                  </p>
                </VertList>
              </ul>
            </Card>
            <Card
              height={320}
              isDataAvailable={
                trends.top_products && trends.top_products.length == 0
              }
            >
              <div className="card-header-inline">
                <p>Top Products</p>
                <select
                  className="form-input"
                  style={{
                    border: "solid thin #ccc",
                    borderRadius: 5,
                    fontSize: 10,
                    color: "#666",
                    outline: "none",
                    padding: 7,
                  }}
                  value={regionId}
                  onChange={handleRegionChange}
                >
                  {regions &&
                    regions != undefined &&
                    regions.map((val, index) => {
                      return (
                        <option key={index} value={val.id}>
                          {val.value}
                        </option>
                      );
                    })}
                </select>
              </div>
              <br />
              {isTopProductsLoading ? (
                <Loader loadMsg={"Product loading..."} />
              ) : (
                <ul
                  style={{ display: "flex", gap: 10, flexDirection: "column" }}
                >
                  {topProducts.top_products &&
                  topProducts.top_products.length > 0
                    ? topProducts.top_products.map((product, index) => {
                        return (
                          <VertList
                            background={"#ecf4fc"}
                            color={"#144b81"}
                            radius={7}
                            key={index}
                          >
                            <img
                              src={StorageUrl(product.img)}
                              style={{ width: 20 }}
                            />{" "}
                            <p
                              className="children"
                              style={{
                                justifyContent: "space-between",
                                width: "100%",
                                gap: 0,
                              }}
                            >
                              <div>
                                {" "}
                                {product.name} {"X"} {product.total_quantity}
                              </div>{" "}
                              <div>
                                <NumericFormat
                                  thousandSeparator={true}
                                  displayType={"text"}
                                  value={product.total_amount}
                                  allowLeadingZeros
                                  prefix={"Tsh"}
                                />
                              </div>
                            </p>
                          </VertList>
                        );
                      })
                    : null}
                </ul>
              )}
            </Card>
            <Card
              height={600}
              isDataAvailable={
                topProducts.sales_by_customer_types &&
                topProducts.sales_by_customer_types.length <= 2
              }
            >
              <div className="card-header-inline">
                <p>Customer types</p>
                <select
                  className="form-input"
                  style={{
                    border: "solid thin #ccc",
                    borderRadius: 5,
                    fontSize: 10,
                    color: "#666",
                    outline: "none",
                    padding: 7,
                  }}
                  value={regionId}
                  onChange={handleRegionChange}
                >
                  {regions &&
                    regions != undefined &&
                    regions.map((val, index) => {
                      return (
                        <option key={index} value={val.id}>
                          {val.value}
                        </option>
                      );
                    })}
                </select>
              </div>
              <br />
              {isTopProductsLoading ? (
                <Loader loadMsg={"Product loading..."} />
              ) : (
                <Chart
                  chartType="PieChart"
                  data={
                    topProducts.top_products &&
                    topProducts.sales_by_customer_types.length > 0 &&
                    topProducts.sales_by_customer_types &&
                    topProducts.sales_by_customer_types
                  }
                  options={productByAreaOptions}
                  width={"100%"}
                  height={"400px"}
                />
              )}
            </Card>
            <Card isDataAvailable={topProducts.top_products_by_districts != undefined && topProducts.top_products_by_districts.length <= 2}>
              <div className="card-header-inline">
                <p>Top products by district</p>
                <select
                  className="form-input"
                  style={{
                    border: "solid thin #ccc",
                    borderRadius: 5,
                    fontSize: 10,
                    color: "#666",
                    outline: "none",
                    padding: 7,
                  }}
                  value={regionId}
                  onChange={handleRegionChange}
                >
                  {regions &&
                    regions != undefined &&
                    regions.map((val, index) => {
                      return (
                        <option key={index} value={val.id}>
                          {val.value}
                        </option>
                      );
                    })}
                </select>
              </div>
              <br />

              {/* <Select options={fetchRegions && fetchRegions} placeholder={"Filter by region..."} /> */}
              <Chart
                chartType="PieChart"
                data={topProducts.top_products_by_districts != undefined && topProducts.top_products_by_districts}
                options={topDistrictOptions}
                width={"100%"}
                height={"400px"}
              />
            </Card>
          </div>
        </div>
        {/* <div style={{ display: "flex", gap: 20, width: "100%" }}>
          <Card minWidth={"65%"} height={300}></Card>
          <Card minWidth={"33%"} height={300}></Card>
        </div> */}
        <div></div>
      </div>
    </div>
  );
}

export default Dashboard;
