import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import {
  FaPlus,
  FaFileExport,
  FaFileDownload,
  FaCalendar,
  FaFilter,
  FaArrowRight,
  FaTimes,
  FaTrashAlt,
  FaEdit,
  FaMapMarkedAlt,
  FaUser,
} from "react-icons/fa";
import Header from "../../components/header/Header";
import ActionButtonsMenue from "../../components/header/ActionButtonsMenue";
import { Button } from "../../components/elements/Button";
import FilterButtonsMenue from "../../components/header/FilterButtonsMenue";
import axios from "axios";
import { BaseUrl } from "../../components/settings/BaseUrl";
import { authToken } from "../../components/settings/Authentication";
import Table from "../../components/tables/Table";
import TableData from "../../components/tables/TableData";
import TableRow from "../../components/tables/TableRow";
import Card from "../../components/cards/Card";
import TableHeader from "../../components/tables/TableHeader";
import { authUserBusinessData } from "../../components/settings/AuthUserData";
import { UserContext } from "../../components/context/UserContext";
import Modal from "../../components/modal/Modal";
import Loader from "../../components/pageloader/Loader";
import NoDataMessage from "../../components/common/NoDataMessage";
import { FetchData } from "../../components/settings/api/FetchData";

function Customers(props) {
  const navigate = useNavigate();
  const { campaignId } = useContext(UserContext);
  const { setSideBar } = props;
  const [showModal, setShowModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [currentCustomer, setCurrentCustomer] = useState({});
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    FetchData(`customers/campaign/${campaignId}`)
      .then((response) => {
        setIsLoading(false);
        setCustomers(response);
        console.log(response)
      })
      .catch((err) => {});
  }, [campaignId]);

  const deleteCustomer = () => {};

  const showDeletePopup = (currentCustomer) => {
    setShowModal(true);
    setCurrentCustomer(currentCustomer);
  };

  return (
    <>
      <div className="page product-container">
        <Modal
          showContinueBtn={false}
          header="Delete Item"
          showBackDrop={true}
          style={{ minWidth: "40%", height: "150px", background: "white" }}
          showModal={showModal}
          continueAction={deleteCustomer}
          setShowModal={setShowModal}
          isModalLoading={isModalLoading}
        >
          <p>You dont have the permission to delete this item</p>
        </Modal>
        <Header>
          <ActionButtonsMenue>
            {/* <Button buttonLink={"/add-customer"}>New Customer</Button> */}
            <Button
              buttonLink={"/view-customer-locations"}
              buttonStyle={"btn--outline"}
            >
              Customer Locations
            </Button>
          </ActionButtonsMenue>
          <FilterButtonsMenue>
            {/* <p>
              <MenuButton>
                <FaTrashAlt /> <span>Trash</span>
              </MenuButton>
            </p>
            <Menu
              menuButton={
                <MenuButton>
                  <FaFilter /> <span>Type</span>
                </MenuButton>
              }
              transition
            >
              <MenuItem>Water</MenuItem>
              <MenuItem>Beer</MenuItem>
              <MenuItem>Milk</MenuItem>
              <MenuItem>More</MenuItem>
            </Menu>
            <Menu
              menuButton={
                <MenuButton>
                  <FaCalendar /> <span>Select Date</span>
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
             <MenuItem onClick={showDatePickerModal}>Select Date Range</MenuItem> }
            </Menu> */}

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
        <div style={{ display: "flex", gap: 20 }}>
          <Table>
            <Loader loadMsg={"Loading data..."} isLoading={isLoading} />
            <TableHeader
              columns={[
                "Customer",
                "Phone",
                "Added on",
                "Locality",
                "Address",
                "Created by",
                "Action",
              ]}
            />
            {customers && customers.length > 0 ? (
              customers.map((customer, index) => {
                return (
                  <div>
                    <TableRow key={index}>
                      <TableData>{customer.name}</TableData>
                      <TableData>{customer.phone}</TableData>
                      <TableData>{customer.device_time}</TableData>
                      <TableData>{customer.user_input_address}</TableData>
                      <TableData>
                        {customer.location && customer.location.substr(0, 16)}
                        ...
                      </TableData>
                      <TableData>
                        <strong style={{ color: "#666" }}>
                          {customer.user}
                        </strong>
                      </TableData>
                      <TableData>
                        {/* <div className="action-btns">
                          <FaUser />
                        </div>
                        <div className="action-btns">
                          <FaEdit />
                        </div> */}
                        <div
                          className="action-btns"
                          onClick={() => showDeletePopup(customer)}
                        >
                          <FaTrashAlt />
                        </div>
                      </TableData>
                    </TableRow>
                  </div>
                );
              })
            ) : (
              <NoDataMessage>No data is available</NoDataMessage>
            )}
          </Table>
        </div>
      </div>
    </>
  );
}

export default Customers;
