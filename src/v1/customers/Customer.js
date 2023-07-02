import React, { useEffect, useState } from "react";
import "../Pages.css";
import ProductImg from "../../img/online-store.png";
import { FaTrashAlt } from "react-icons/fa";
import { fetchCustomers } from "../../components/api/Customers";
import PageLoader from "../../components/common/PageLoader";
import { filterItems } from "../../components/helpers/Helpers";
import Dropdown from "../../components/common/Dropdown";
import { BaseUrl } from "../../components/settings/BaseUrl";
import axios from "axios";

const filterList = [
  { name: "Duka", alias: "duka" },
  { name: "Supermarket", alias: "supermarket" },
  { name: "Bar", alias: "bar" },
  { name: "All", alias: "all" },
];

function Customer() {
  const [customers, setCustomers] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");

  const [filteredItems, setFilteredItems] = useState([]);

  //handle pagination
  const itemsPerPage = 20; // Number of items to show per page
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems?.slice(indexOfFirstItem, indexOfLastItem);

  const BASE_URL = BaseUrl("/");
  const token = localStorage.getItem("token");
  const loggedUser = JSON.parse(localStorage.getItem('user'))

  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    setIsPageLoading(true);
    const fetchData = async () => {
      const customerData = await fetchCustomers(axiosInstance, loggedUser.business_id);
      if (customerData) {
        setCustomers(customerData);
        setIsPageLoading(false);
        setFilteredItems(customerData);
      }
      console.log(customerData);
    };

    fetchData();
  }, []);

  const handleDropDownClick = (item) => {
    setSelectedItem(item);

    setIsPageLoading(true);
    setTimeout(function () {
      filterItems(item);
      setIsPageLoading(false);
    }, 500);
  };

  const filterItems = (selectedItem) => {
    if (selectedItem.toLowerCase() === "all") {
      setFilteredItems(customers);
      return;
    }

    console.log(selectedItem);

    const filtered = customers.filter((item) =>
      item.customer_type.name.toLowerCase().includes(selectedItem.toLowerCase())
    );

    setFilteredItems(filtered);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className="menu-bar">
        <h1 className="page-header">/ Customers Page</h1>
        <div>
          <Dropdown
            withIcon={true}
            link={"Filter by customer types"}
            list={filterList}
            handleItemClick={handleDropDownClick}
            style={{ zIndex: 99999, minWidth: "160%" }}
          />
          {/* <ul className="view-list">
            {filterList.map((item, index) => {
              return (
                <li onClick={() => handleItemClick(item.alias)}>{item.name}</li>
              );
            })}
          </ul> */}
        </div>
      </div>
      <div className="table-wrapper">
        <div style={{ display: "flex", gap: 10 }}>
          <button className="primary-btn">Import Customer</button>
        </div>
        {isPageLoading && <PageLoader />}
        {!isPageLoading && (
          <table>
            <thead>
              <tr className="table-row">
                <th>Customer</th>
                <th>Date Added</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Customer type</th>
                <th>District</th>
                <th>Created by</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* {customers?.length > 0 && */}
              {currentItems.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 20,
                        }}
                      >
                        <div
                          style={{
                            width: 60,
                            height: 60,
                            background: "#f2f2f2",
                            justifyContent: "center",
                            display: "flex",
                            alignItems: "center",
                            borderRadius: 100,
                            borderWidth: 1,
                            borderColor: "#ddd",
                          }}
                        >
                          <img
                            style={{
                              width: 20,
                            }}
                            src={ProductImg}
                          />
                        </div>
                        <span>{item.name} </span>
                      </div>
                    </td>
                    <td>{item.created_date}</td>
                    <td>{item.phone}</td>
                    <td>{item.location}</td>
                    <td style={{textAlign:"center"}}>{item.customer_types?.name}</td>
                    <td>{item.districts?.name}</td>
                    <td>{item.user?.name}</td>
                    <td>
                      <div
                        className="action-btns"
                        //   onClick={() => showDeletePopup(team)}
                      >
                        <FaTrashAlt />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <div className="pagination">
          {Array.from({
            length: Math.ceil(filteredItems?.length / itemsPerPage),
          }).map((_, index) => (
            <button
              key={index}
              className={currentPage === index + 1 ? "active" : ""}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Customer;
