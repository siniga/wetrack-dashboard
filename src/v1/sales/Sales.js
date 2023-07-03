import React, { useContext, useEffect, useState } from "react";
import "../Pages.css";
import { FaTrashAlt } from "react-icons/fa";
import { BaseUrl } from "../../components/settings/BaseUrl";
import { fetchSales } from "../../components/api/Sales";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import Dropdown from "../../components/common/Dropdown";
import PageLoader from "../../components/common/PageLoader";

function Sales() {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [sales, setSales] = useState([]);
  const { loginState } = useContext(AuthContext);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");

  //handle pagination
  const itemsPerPage = 10; // Number of items to show per page
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems?.slice(indexOfFirstItem, indexOfLastItem);

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

    setIsPageLoading(true);
    
    const fetchData = async () => {
      const salesData = await fetchSales(axiosInstance, loggedUser.business_id);
      if (salesData) {
        setSales(salesData);
        setFilteredItems(salesData);
        setIsPageLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDropDownClick = (item) => {
    setSelectedItem(item);
    setIsPageLoading(true);

    setTimeout(function () {
      setIsPageLoading(false);
      filterItems(item);
    }, 500);
  };

  const filterItems = (selectedItem) => {
    console.log(selectedItem);
    if (selectedItem == "All") {
      setFilteredItems(sales);
      return;
    }


    const filtered = sales.filter((item) =>
      item.status.toLowerCase().includes(selectedItem.toLowerCase())
    );

    setFilteredItems(filtered);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className="menu-bar">
        <h1 className="page-header">/ Sales Page</h1>
        <div>
          <Dropdown
            link={"Filter by status"}
            list={[{ name: "Order" }, { name: "Sale"}, { name: "All" }]}
            handleItemClick={handleDropDownClick}
            style={{ zIndex: 99999, minWidth: "160%" }}
          />
        </div>
      </div>
      <div style={{ background: "white", padding: 30, borderRadius: 10 }} className="table-wrapper">
      {isPageLoading && <PageLoader />}
       {!isPageLoading &&  <table>
          <thead>
            <tr className="table-row">
              <th>Time Submited</th>
              <th>Sales Number</th>
              <th>Customer Name</th>
              <th>Customer Phone</th>
              <th>Customer Location</th>
              <th>Status</th>
              <th>Created by</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems?.map((item, index) => {
              return (
                <tr>
                  <td>{item?.device_time}</td>
                  <td>#{item?.order_no}</td>
                  <td>{item?.customers.name}</td>
                  <td>{item?.customers.phone}</td>
                  <td>{item?.customers.location}</td>
                  <td>
                    {item.status == 1 && (
                      <span class="status-pill pending">order</span>
                    )}
                    {item.status == 2 && (
                      <span class="status-pill completed">sale</span>
                    )}
                     {item.status == 3 && (
                      <span class="status-pill completed">credit</span>
                    )}
                  </td>
                  <td>{item.user.name}</td>
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
        </table>}
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

export default Sales;
