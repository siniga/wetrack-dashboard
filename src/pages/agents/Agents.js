import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { FaCalendar, FaFileExport, FaFilter, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../components/context/UserContext";
import ActionButtonsMenue from "../../components/header/ActionButtonsMenue";
import FilterButtonsMenue from "../../components/header/FilterButtonsMenue";
import Header from "../../components/header/Header";
import Loader from "../../components/pageloader/Loader";
import { FetchData } from "../../components/settings/api/FetchData";
import { authToken } from "../../components/settings/Authentication";
import { BaseUrl } from "../../components/settings/BaseUrl";
import Table from "../../components/tables/Table";
import TableData from "../../components/tables/TableData";
import TableHeader from "../../components/tables/TableHeader";
import TableRow from "../../components/tables/TableRow";

function Agents(props) {
  const { campaignId } = useContext(UserContext);
  const [showTeams, setShowTeams] = useState(false);
  const [agents, setAgents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true)
    FetchData(`agent-stats/campaign/${campaignId}`)
    .then((response) => {
      setAgents(response);
     setIsLoading(false)
    })
    .catch((err) => {
      setIsLoading(false)
    });
  }, [campaignId]);

  const getAgentStats = () => {
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
        setAgents(response.data);
      })
      .catch((err) => {});
  };

  const viewUser = (user) => {
    // console.log(userId)
    navigate("/user", { state: { user: user,flag: 0 } });
  };

  return (
    <>
    <div className="page">
    <Header>
    <ActionButtonsMenue></ActionButtonsMenue>
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
      <Table style={{ minHeight: 300 }}>
        <p>Agent stats</p>
        <br />
        
        <Loader
            isLoading={isLoading}
            loadMsg={"Data is still loading... "}
          />
        <TableHeader
          columns={["Name", "Visits", "Effective Sale", "Qnty Sold", "Revenue","number of customers","last visitation"]}
        />
        {agents.length > 0
          ? agents.map((user, index) => {
              return (
                <TableRow key={index} onClick={() => viewUser(user)}>
                  <TableData>{user.name}</TableData>
                  <TableData>{user.num_visit}</TableData>
                  <TableData>{user.num_sale}</TableData>
                  <TableData>{user.total_qnty_sold}</TableData>
                  <TableData>{user.total_amount_sold}</TableData>
                  <TableData>{user.num_customers}</TableData>
                  {/* last visitation has to be in hours ago*/}
                </TableRow>
              );
            })
          : "No data available"}
      </Table>
      </div>
    </>
  );
}

export default Agents;
