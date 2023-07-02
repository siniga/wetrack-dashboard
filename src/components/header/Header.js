import React, { useState } from "react";
import "./Header.css";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import {
  FaPlus,
  FaFileExport,
  FaFileDownload,
  FaCalendar,
} from "react-icons/fa";

function Header(props) {
  const { showDatePickerModal, children } = props;

  return (
    <div className="content">
      {children}
    </div>
  );
}

export default Header;
