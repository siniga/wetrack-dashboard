import React, { useState, useEffect, useContext } from "react";
import Card from "../../components/cards/Card";
import Table from "../../components/tables/Table";
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
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import { Button } from "../../components/elements/Button";
import ActionButtonsMenue from "../../components/header/ActionButtonsMenue";
import FilterButtonsMenue from "../../components/header/FilterButtonsMenue";
import Header from "../../components/header/Header";
import { Checkbox } from "../../components/elements/Checkbox";
import axios from "axios";
import { BaseUrl } from "../../components/settings/BaseUrl";
import { authToken } from "../../components/settings/Authentication";
import TableData from "../../components/tables/TableData";
import TableRow from "../../components/tables/TableRow";
import TableHeader from "../../components/tables/TableHeader";
import VertList from "../../components/common/VertList";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../components/context/UserContext";
import Modal from "../../components/modal/Modal";
import Loader from "../../components/pageloader/Loader";
import { FetchData } from "../../components/settings/api/FetchData";

function Users(props) {
  const { businessCampaigns, campaignId } = useContext(UserContext);
  const [showTeams, setShowTeams] = useState(false);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    FetchData(`users/campaign/${campaignId}`)
      .then((response) => {
        setIsLoading(false);
        setUsers(response);
      })
      .catch((err) => {});
  }, [campaignId]);

  useEffect(() => {
    // getTeams();
  }, []);

  const getUsers = () => {
    setIsLoading(true);
    axios({
      url: BaseUrl("" + campaignId),
      method: "get",
      headers: {
        Authorization: "Bearer " + authToken(),
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log(response.data);
        setIsLoading(false);
        setUsers(response.data);
      })
      .catch((err) => {});
  };

  const getTeams = () => {
    console.log(campaignId);
    axios({
      url: BaseUrl("teams/campaign/" + campaignId),
      method: "get",
      headers: {
        Authorization: "Bearer " + authToken(),
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log(response.data.products);
        setTeams(response.data.products);
      })
      .catch((err) => {});
  };

  const editProduct = () => {};

  const deleteUser = () => {
    setIsModalLoading(true);
    axios({
      url: BaseUrl("user/" + currentUser.id),
      method: "delete",
      headers: {
        Authorization: "Bearer " + authToken(),
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setIsModalLoading(false);
        let filteredUsers = users.filter((user) => user.id !== currentUser.id);

        setUsers(filteredUsers);
        setShowModal(false);
      })
      .catch((err) => {
        setIsModalLoading(false);
      });
  };

  const showDeletePopup = (currentUser) => {
    setShowModal(true);
    setCurrentUser(currentUser);
  };

  const viewUser = (user) => {
    // console.log(userId)
    navigate("/user", { state: { user: user, users: users } });
  };

  return (
    <div className="page">
      <Modal
        showContinueBtn={true}
        header="Delete Item"
        showBackDrop={true}
        style={{ minWidth: "40%", height: "150px", background: "white" }}
        showModal={showModal}
        continueAction={deleteUser}
        setShowModal={setShowModal}
        isModalLoading={isModalLoading}
      >
        <p>
          This item will not be retrieved once deleted, are you sure you want to
          continue
        </p>
        <br />
      </Modal>
      <Header>
        <ActionButtonsMenue>
          <Button buttonLink={"/add-team-member"}>New Member</Button>
        </ActionButtonsMenue>
        <FilterButtonsMenue>
          {/* <p>
            <MenuButton>
              <FaTrashAlt /> <span>Trash</span>
            </MenuButton>
          </p> */}
          {/* <Menu
            menuButton={
              <MenuButton>
                <FaFilter /> <span>Member Role</span>
              </MenuButton>
            }
            transition
          >
            <MenuItem>Admin</MenuItem>
            <MenuItem>Manager</MenuItem>
            <MenuItem>Supervisor</MenuItem>
            <MenuItem>Member</MenuItem>
          </Menu> */}
          {/* <Menu
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
            <MenuItem onClick={showDatePickerModal}>Select Date Range</MenuItem>
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
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Table style={{ minWidth: "100%" }}>
          <Loader loadMsg={"Loading data..."} isLoading={isLoading} />
          <TableHeader
            columns={[
              "Name",
              "Phone",
              "Email",
              "Created Date",
              "Role",
              "Team",
              "Action",
            ]}
          />
          {users &&
            users.map((user, key) => {
              return (
                <div key={key}>
                  <TableRow>
                    <TableData>{user.name}</TableData>
                    <TableData>{user.phone}</TableData>
                    <TableData>{user.email}</TableData>
                    <TableData>{user.time_ago}</TableData>
                    <TableData>{user.roles[0] ? user.roles[0].name: null}</TableData>
                    <TableData>{user.team}</TableData>
                    <TableData>
                      {/* <div
                          className="action-btns"
                          onClick={() => viewUser(user)}
                        >
                          <FaUser />
                        </div> */}
                      {/* <div className="action-btns">
                          <FaEdit />
                        </div> */}
                      <div
                        className="action-btns"
                        onClick={() => showDeletePopup(user)}
                      >
                        <FaTrashAlt />
                      </div>
                    </TableData>
                  </TableRow>
                </div>
              );
            })}
        </Table>
      </div>
    </div>
  );
}

export default Users;
