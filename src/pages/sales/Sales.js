import React, { useState, useEffect, useContext } from "react";
import "../Pages.css";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import {
  FaPlus,
  FaFileExport,
  FaFileDownload,
  FaCalendar,
  FaFilter,
  FaArrowRight,
  FaTimes,
  FaEdit,
  FaTrashAlt,
} from "react-icons/fa";
import { json, useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import ActionButtonsMenue from "../../components/header/ActionButtonsMenue";
import FilterButtonsMenue from "../../components/header/FilterButtonsMenue";
import axios from "axios";
import { BaseUrl } from "../../components/settings/BaseUrl";
import { authToken } from "../../components/settings/Authentication";
import TableRow from "../../components/tables/TableRow";
import TableData from "../../components/tables/TableData";
import TableHeader from "../../components/tables/TableHeader";
import Card from "../../components/cards/Card";
import Table from "../../components/tables/Table";
import { UserContext } from "../../components/context/UserContext";
import Loader from "../../components/pageloader/Loader";
import { FetchData } from "../../components/settings/api/FetchData";
import Pusher from "pusher-js";

const columns = [
  "Sales Number",
  "Time Submited",
  "Created By",
  "Customer Name",
  "Customer Phone",
  "Status",
  "Action",
];

function Sales(props) {
  const { campaignId } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sales, setSales] = useState([]);
  const [newOrder, setNewOrder] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = false;

    var pusher = new Pusher("5e0181cb424c02006d6a", {
      cluster: "ap2",
    });

    var channel = pusher.subscribe("notify-channel");
    channel.bind("notify-event", function (data) {
      let sales = JSON.parse(localStorage.getItem("cached_sales_data"));
      setSales([...sales, data.message.original.new_order]);
    });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    FetchData(`orders/campaign/${campaignId}`)
      .then((response) => {
        setSales(response);
        localStorage.setItem("cached_sales_data", JSON.stringify(response));
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, [campaignId]);

  const showDatePickerModal = () => {
    setShowModal(true);
  };

  const viewOrder = (sale) => {
    navigate("/view-sales", { state: { sale: sale } });
  };

  const cancelOrder = () => {
    alert("cancelOrder");
  };

  return (
    <>
      <div className="page sales-container">
        <Header showDatePickerModal={showDatePickerModal}>
          <ActionButtonsMenue></ActionButtonsMenue>
          <FilterButtonsMenue>
            {/* <Menu
              menuButton={
                <MenuButton>
                  <FaFilter /> <span>Status</span>
                </MenuButton>
              }
              transition
            >
              <MenuItem>Cancelled</MenuItem>
              <MenuItem>Processing</MenuItem>
              <MenuItem>Completed</MenuItem>
            </Menu> */}
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
              <MenuItem>Today</MenuItem>
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
        <Table>
          <Loader isLoading={isLoading} loadMsg={"Data is still loading... "} />
          <Card>
            <TableHeader columns={columns} />
            {sales && sales.length > 0
              ? sales.map((sale, index) => {
                  return (
                    <div>
                      <TableRow key={index}>
                        <TableData>
                          {"#"}
                          {sale.order_no}
                        </TableData>
                        <TableData>{sale.device_time}</TableData>
                        <TableData>{sale.user}</TableData>
                        <TableData>{sale.customer}</TableData>
                        <TableData>{sale.customer_phone}</TableData>
                        <TableData>
                          {sale.status == 0 && (
                            <span className="pills pending">Pending</span>
                          )}
                          {sale.status == 1 && (
                            <span className="pills processing">Processing</span>
                          )}
                          {sale.status == 2 && (
                            <span className="pills completed">Completed</span>
                          )}
                          {sale.status == 3 && (
                            <span className="pills cancelled">Cancelled</span>
                          )}
                        </TableData>
                        <TableData>
                          <div
                            className="action-btns"
                            onClick={() => viewOrder(sale)}
                          >
                            <FaArrowRight />
                          </div>
                        </TableData>
                      </TableRow>
                    </div>
                  );
                })
              : "No data available"}
          </Card>
        </Table>
      </div>
    </>
  );
}

export default Sales;
