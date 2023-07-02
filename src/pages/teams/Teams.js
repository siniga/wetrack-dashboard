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

function Teams(props) {
  const { businessCampaigns, campaignId } = useContext(UserContext);
  const [showTeams, setShowTeams] = useState(false);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTeam, setCurrentTeam] = useState({});
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    getUsers();
  }, [campaignId]);

  useEffect(() => {
    setIsLoading(true);
    FetchData(`teams/campaign/${campaignId}`)
      .then((response) => {
        setIsLoading(false);
        setTeams(response);
      })
      .catch((err) => {});
  }, [campaignId]);

  const getUsers = () => {
    setIsLoading(true)
    axios({
      url: BaseUrl("users/campaign/" + campaignId),
      method: "get",
      headers: {
        Authorization: "Bearer " + authToken(),
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setIsLoading(false)
        setUsers(response.data);
      })
      .catch((err) => {
        setIsLoading(false)
      });
  };

  const editProduct = () => {};

  const deleteTeam = () => {
    setIsModalLoading(true);
    axios({
      url: BaseUrl("team/" + currentTeam.id),
      method: "delete",
      headers: {
        Authorization: "Bearer " + authToken(),
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setIsModalLoading(false);
        let filteredTeams = teams.filter((team) => team.id !== currentTeam.id);

        setTeams(filteredTeams);
        setShowModal(false);
      })
      .catch((err) => {
        setIsModalLoading(false);
      });
  };

  const showDeletePopup = (currentTeam) => {
    setShowModal(true);
    setCurrentTeam(currentTeam);
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
        continueAction={deleteTeam}
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
          <Button buttonLink={"/add-team"}>New Team</Button>
        </ActionButtonsMenue>
        <FilterButtonsMenue>
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
        <h4>Teams</h4>
        <Loader loadMsg={"Loading data..."} isLoading={isLoading}/>
            <TableHeader
              style={{ width: "30%" }}
              columns={["Name", "Campaingn", "Region", "Created", "Actions"]}
            />
            {teams &&
              teams.map((team, key) => {
                return (
                  <div key={key}>
                    <TableRow>
                      <TableData style={{ width: "19%" }}>
                        {team.name}{"-"}{"Team"}
                      </TableData>
                      <TableData style={{ width: "19%" }}>
                        {team.campaign}
                      </TableData>
                      <TableData style={{ width: "19%" }}>
                        {team.region}
                      </TableData>
                      <TableData style={{ width: "20%" }}>
                        {team.time_ago}
                      </TableData>
                      <TableData>
                        {" "}
                        <div
                          className="action-btns"
                          onClick={() => showDeletePopup(team)}
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

export default Teams;
