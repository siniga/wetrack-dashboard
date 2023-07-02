import React, { useContext, useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { fetchUsersData } from "../../components/api/Users";
import PageLoader from "../../components/common/PageLoader";
import { filterItems } from "../../components/helpers/Helpers";
import Dropdown from "../../components/common/Dropdown";
import { AuthContext } from "../../context/authContext";
import { BaseUrl } from "../../components/settings/BaseUrl";
import axios from "axios";

const roles = [
  { name: "Admin" },
  { name: "Supervisor" },
  { name: "Agent" },
  { name: "All" },
];

function User() {
  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const [users, setUsers] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  //handle pagination
  const itemsPerPage = 10; // Number of items to show per page
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems?.slice(indexOfFirstItem, indexOfLastItem);

  // const {loginState, dispatchLoginState } = useContext(AuthContext);

  const BASE_URL = BaseUrl("/");
  const token = localStorage.getItem("token");

  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, //TODO: store token in .env file
    },
  });

  useEffect(() => {
    setIsPageLoading(true);

    const getUsers = async () => {
      console.log(loggedUser.business_id);
      const response = await fetchUsersData(
        axiosInstance,
        loggedUser.business_id
      );
      if (response) {
        setIsPageLoading(false);
        setUsers(response);
        setFilteredItems(response);
      }
    };

    // console.log(loginState);
    getUsers();
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
    if (selectedItem === "All") {
      setFilteredItems(users);
      return;
    }
    const filtered = users.filter((item) =>
      item.role.toLowerCase().includes(selectedItem.toLowerCase())
    );

    setFilteredItems(filtered);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className="menu-bar">
        <h1 className="page-header">/ Users Page</h1>
        <div>
          <Dropdown
            withIcon={true}
            link={"Filter by role"}
            list={roles}
            handleItemClick={handleDropDownClick}
            style={{ zIndex: 99999, minWidth: "160%" }}
          />
        </div>
      </div>
      <div className="table-wrapper">
        <div style={{ display: "flex", gap: 10 }}>
          <Link to={"/create/user"} className="primary-btn">
            Add User
          </Link>
        </div>
        {isPageLoading && <PageLoader />}
        {!isPageLoading && (
          <table>
            <thead>
              <tr className="table-row">
                <th>User</th>
                <th>Date Added</th>
                <th>Phone</th>
                <th>Role</th>
                <th>login code</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems?.length > 0 &&
                currentItems.map((user, index) => {
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
                          <span>{user.name} </span>
                        </div>
                      </td>
                      <td>{user.created_at}</td>
                      <td>{user.phone}</td>
                      <td>{user.role}</td>
                      <td>{user.code}</td>
                      <td>
                        {user.active_status == 1 && (
                          <span className="status-pill completed">Active</span>
                        )}
                        {user.active_status == 0 && (
                          <span className="status-pill pending">inactive</span>
                        )}
                      </td>
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

export default User;
