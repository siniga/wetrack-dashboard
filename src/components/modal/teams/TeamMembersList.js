// ReactJS Component
import React, { useState } from 'react';
import { FaUserAstronaut } from 'react-icons/fa';

const TeamMembersList = ({ user, onSelect }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    onSelect(user, !isChecked);
  };

  return (
    <div className="list-item">
      <div className="user-icon">
        <FaUserAstronaut />
      </div>
      <div className="username">{user.name}</div>
      <div className="checkbox">
        <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
      </div>
    </div>
  );
};

export default TeamMembersList;
