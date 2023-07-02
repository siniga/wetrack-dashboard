import React, { useState, useEffect, useRef } from "react";
import "./Dropdown.css";
import { FaCaretDown } from "react-icons/fa";

const Dropdown = ({list, link, handleItemClick, style, withIcon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };


  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <div className={`dropdown ${isOpen ? "open" : ""}`} ref={dropdownRef} style={{display:"flex",flexDirection:"row", alignItems:"center"}}>
      <p  onClick={toggleDropdown} style={{cursor:"pointer"}}>
      {link}
      </p>
      {withIcon && <FaCaretDown /> }
      {isOpen && (
        <ul className="dropdown-menu" style={style}>
          {list.map((item, index) => {
            return <li key={index} onClick={()=>{handleItemClick(item.name);setIsOpen(false);}}>{item.name}</li>;
          })}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
