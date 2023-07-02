import React from "react";
import NoDataMessage from "../common/NoDataMessage";
import "./Table.css";

function Table(props) {
  const { children, style, isDataAvailable} = props;
  return (
    <div className="table" style={style}>
      {children}{" "}
      {isDataAvailable ? (
        <NoDataMessage>No available data</NoDataMessage>
      ) : null}
    </div>
  );
}

export default Table;
