import React, { useContext, useEffect, useState } from "react";
import "../Pages.css";
import { FaTrashAlt } from "react-icons/fa";
import {
  assignTeamSupervisor,
  fetchTeamData,
} from "../../components/api/Teams";
import { Link } from "react-router-dom";
import Loader from "../../img/spinner_loader.gif";
import {
  fetchSupervisors,
  fetchUsersByBusinessId,
} from "../../components/api/Users";
import PageLoader from "../../components/common/PageLoader";
import cities from "../../json/cities.json";
import Dropdown from "../../components/common/Dropdown";
import { AuthContext } from "../../context/authContext";
import { BaseUrl } from "../../components/settings/BaseUrl";
import axios from "axios";
import TeamMembersModal from "../../components/modal/teams/TeamMembersModal";

function Team() {
  const [teams, setTeams] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState();
  const [selectedTeam, setSelectedTeam] = useState();
  const [supervisorModal, setSupervisorModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isSupervisorAdding, setIsSupervisorAdding] = useState(false);
  const [updateTableData, setUpdateTableData] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [assignedUserMsg, setAssignedUserMsg] = useState("");

  const { loginState } = useContext(AuthContext);

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
      Authorization: `Bearer ${token}`, //TODO: store token in .env file
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const teamData = await fetchTeamData(
        axiosInstance,
        loggedUser.business_id
      );
      if (teamData) {
        console.log(teamData);
        setTeams(teamData);
        setUpdateTableData(false);
        setFilteredItems(teamData);
        setAssignedUserMsg("")
      }
    };

    fetchData();
  }, [updateTableData, assignedUserMsg]);

  useEffect(() => {
    const fetchSupervisorData = async () => {
      setIsPageLoading(true);
      const supervisors = await fetchSupervisors(
        axiosInstance,
        "supervisor",
        loggedUser.business_id
      );
      setIsPageLoading(false);

      if (supervisors.length > 0) {
        setSupervisors(supervisors);
        setSelectedSupervisor(supervisors[0].id);
      }
    };

    fetchSupervisorData();
  }, []);

  useEffect(() => {
    // console.log(loggedUser);
    const fetchData = async () => {
      const userData = await fetchUsersByBusinessId(
        axiosInstance,
        loggedUser.business_id
      );
      if (userData) {
        setTeamMembers(userData);
      }
    };

    fetchData();
  }, [assignedUserMsg]);

  const handleSupervisorChange = (e) => {
    setSelectedSupervisor(e.target.value);
  };

  const onCancel = () => {
    setSupervisorModal(false);
  };

  const assignSupervisor = (team) => {
    setSupervisorModal(true);
    setSelectedTeam(team);
  };

  const saveSupervisor = async (e) => {
    e.preventDefault();

    const data = {
      user_id: selectedSupervisor,
      team_id: selectedTeam.id,
    };

    const response = await assignTeamSupervisor(axiosInstance, data);
    if (response) {
      setSupervisorModal(false);
      setIsSupervisorAdding(false);
      setUpdateTableData(true);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDropDownClick = (item) => {
    setIsPageLoading(true);

    setTimeout(function () {
      filterItems(item);
      setIsPageLoading(false);
    }, 500);
  };

  const filterItems = (selectedItem) => {
    if (selectedItem.toLowerCase() === "all") {
      setFilteredItems(teams);
      return;
    }

    const filtered = teams.filter((item) =>
      item.region.name.toLowerCase().includes(selectedItem.toLowerCase())
    );

    setFilteredItems(filtered);
  };

  const assignMembers = (team) => {
    setShowMembersModal(true);
    setSelectedTeam(team);
  };
  return (
    <div>
      {supervisorModal && (
        <div id="myModal" className="modal">
          <div class="modal-content">
            <span className="close" onClick={onCancel}>
              &times;
            </span>
            <h1 style={{ fontSize: 22 }}>Select Supervisor</h1>
            <h3>supervisor Details</h3>
            <form onSubmit={saveSupervisor}>
              <div className="form-contols-container">
                <div className="input-section" style={{ width: "100%" }}>
                  <label>
                    Select Supervisors:
                    <select
                      name="supervisor"
                      value={selectedSupervisor}
                      onChange={handleSupervisorChange}
                      // className={roleError ? "invalid" : ""}
                    >
                      {supervisors.length > 0 &&
                        supervisors?.map((supervisor, index) => (
                          <option key={index} value={supervisor.id}>
                            {supervisor.name}
                          </option>
                        ))}
                    </select>
                  </label>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button type="submit" className="primary-btn">
                  {isSupervisorAdding && <img src={Loader} width={30} />}
                  {!isSupervisorAdding && <p>Save</p>}
                </button>
                <button type="submit" className="white-btn" onClick={onCancel}>
                  cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMembersModal && (
        <TeamMembersModal
          setAssignedUserMsg={setAssignedUserMsg}
          axiosInstance={axiosInstance}
          setShowMembersModal={setShowMembersModal}
          teamMembers={teamMembers}
          selectedTeam={selectedTeam}
        />
      )}
      <div className="menu-bar">
        <h1 className="page-header">/ Teams Page</h1>
        <div>
          <Dropdown
            withIcon={true}
            link={"Filter by region"}
            list={cities}
            handleItemClick={handleDropDownClick}
            style={{
              zIndex: 99999,
              overflowY: "scroll",
              minWidth: "160%",
              height: 500,
            }}
          />
        </div>
      </div>
      <div className="table-wrapper">
        <div style={{ display: "flex", gap: 10 }}>
          <Link className="primary-btn" to={"/create/team"}>
            Add Teams
          </Link>
        </div>
        {isPageLoading && <PageLoader />}
        {!isPageLoading && (
          <table>
            <thead>
              <tr className="table-row">
                <th>Team</th>
                <th>Region</th>
                <th>Surpervisor</th>
                <th>Assign Members</th>
                <th>Team Members</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems &&
                currentItems?.map((team, index) => {
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
                          <span>{team.name}</span>
                        </div>
                      </td>
                      <td>{team.region.name}</td>
                      {team.users.length > 0 && <td>{team.users[0].name}</td>}
                      {team.users?.length === 0 && (
                        <td>
                          <p
                            className="status-pill pending"
                            style={{
                              color: "white",
                              background: "#666",
                              cursor: "pointer",
                              width:160
                            }}
                            onClick={() => assignSupervisor(team)}
                          >
                            Asign Surpervisor
                          </p>
                        </td>
                      )}
                      <td>
                        <p
                          className="status-pill pending"
                          style={{
                            color: "#666",
                            cursor: "pointer",
                            background:"rgb(250 250 250)",
                            border:"solid thin #666"
  
                          }}
                          onClick={() => assignMembers(team)}
                        >
                          Asign Members
                        </p>
                      </td>
                      <td>{team.users.length}</td>
                      {/* Change this to time ago */}
                      <td>{team.created_at}</td>
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

export default Team;
