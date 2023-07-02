import React from "react";
import NoDataMessage from "../common/NoDataMessage";
import "./Card.css";

function Card(props) {
  const { children, minWidth, height, cardHeader, isDataAvailable } = props;
  return (
    <>
      <div
        className="card-wrapper card"
        style={{ minWidth: minWidth, height: height }}
      >
        <p>{cardHeader}</p>
   
        {children}
        {isDataAvailable ? <NoDataMessage>No available data</NoDataMessage> : null}
      </div>
    </>
  );
}

export default Card;
