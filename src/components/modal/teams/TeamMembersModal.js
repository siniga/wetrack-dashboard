import React, { useState } from "react";
import Loader from "../../../../src/img/spinner_loader.gif";
import "./TeamMembersModal.css";
import { FaCaretDown, FaUserAlt } from "react-icons/fa";
import TeamMembersList from "./TeamMembersList";
import { assignUsersToTeam } from "../../api/Users";

function TeamMembersModal(props) {
  const { setShowMembersModal, teamMembers, selectedTeam, axiosInstance,setAssignedUserMsg} = props;

  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const onCancel = () => {
    setShowMembersModal(false);
  };
  const saveMembers = async(e) => {
    e.preventDefault();
 
    const newUsers = [];
    selectedUsers.forEach(item => {
        newUsers.unshift({user_id:item.id, team_id:selectedTeam.id})
    });

    setIsLoading(true)
    const response = await assignUsersToTeam(axiosInstance, {users: newUsers});
    if(response){
        setIsLoading(false)
        setShowMembersModal(false);
        setAssignedUserMsg(response)
    }
  };

  const handleUserSelect = (user, isSelected) => {
    if (isSelected) {
      setSelectedUsers([...selectedUsers, user]);
    } else {
      setSelectedUsers(
        selectedUsers.filter((selectedUser) => selectedUser !== user)
      );
    }
  };

  return (
    <div id="myModal" className="modal">
      <div class="modal-content" style={{ width: "50%", height:650, marginTop:"1%"}}>
        <span className="close" onClick={onCancel}>
          &times;
        </span>
        <h1 style={{ fontSize: 22 }}>Select Members</h1>
        <h3>You can select more than one member</h3>
        <div style={{ display: "flex", flexDirection: "row", }}>
          <div style={{width:"65%", height:500,overflowY:"scroll" }}>
            {teamMembers?.map((user, index) => {
              return (
                <TeamMembersList
                  key={user.id}
                  user={user}
                  onSelect={handleUserSelect}
                />
              );
            })}
          </div>
          <div style={{paddingLeft:40, width:"35%", border:"solid thin #ccc",height:500,overflowY:"scroll"}}>
            {/* Selected Users: */}
            <ul>
              {selectedUsers.map((user) => (
                <li className="list-item" key={user.id}>{user.name}</li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit" className="primary-btn" onClick={saveMembers}>
            {isLoading && <img src={Loader} width={30} />}
            {!isLoading && <p>Save</p>}
          </button>
          <button type="submit" className="white-btn" onClick={onCancel}>
            cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeamMembersModal;
